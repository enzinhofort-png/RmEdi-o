-- ============================================================
-- ClipStudio — Supabase Schema
-- Execute no SQL Editor do painel Supabase (supabase.com)
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTENSÕES
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
create type plan_type      as enum ('free', 'pro', 'team');
create type project_status as enum ('active', 'archived');
create type clip_status    as enum ('ready', 'rendering', 'exported', 'error');
create type export_quality as enum ('draft', 'hd', 'max');
create type platform_type  as enum ('tiktok', 'reels', 'shorts', 'youtube', 'square');

-- ─────────────────────────────────────────────
-- TABELA: profiles
-- Extende auth.users com dados da aplicação
-- ─────────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null default '',
  avatar_url      text,
  plan            plan_type not null default 'free',
  storage_used    bigint not null default 0,       -- bytes
  storage_limit   bigint not null default 1073741824, -- 1 GB default
  exports_month   int not null default 0,
  exports_reset   date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Cria profile automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- TABELA: projects
-- ─────────────────────────────────────────────
create table public.projects (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  name           text not null,
  description    text default '',
  source_url     text,
  thumb          text default '🎬',
  status         project_status not null default 'active',
  total_duration int not null default 0,  -- seconds
  clip_count     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_updated_at on public.projects(updated_at desc);

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- TABELA: clips
-- ─────────────────────────────────────────────
create table public.clips (
  id               uuid primary key default uuid_generate_v4(),
  project_id       uuid not null references public.projects(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  name             text not null,
  start_time       numeric(10,2) not null default 0,   -- segundos
  end_time         numeric(10,2) not null default 30,
  platform         platform_type not null default 'tiktok',
  quality          export_quality not null default 'hd',
  status           clip_status not null default 'ready',
  render_progress  int not null default 0 check (render_progress between 0 and 100),
  has_captions     boolean not null default false,
  caption_text     text,
  caption_style    int not null default 0,
  caption_font     text default 'Oswald',
  caption_size     int default 24,
  zoom_level       int not null default 100,
  file_size        bigint,          -- bytes, preenchido após export
  file_url         text,            -- Storage URL do arquivo exportado
  exported_at      timestamptz,
  metadata         jsonb default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_clips_project_id  on public.clips(project_id);
create index idx_clips_user_id     on public.clips(user_id);
create index idx_clips_status      on public.clips(status);

create trigger clips_updated_at
  before update on public.clips
  for each row execute procedure public.set_updated_at();

-- Mantém clip_count e total_duration do projeto sincronizados
create or replace function public.sync_project_clip_stats()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'DELETE' then
    update public.projects
    set
      clip_count = (select count(*) from public.clips where project_id = OLD.project_id),
      total_duration = (select coalesce(sum(end_time - start_time), 0) from public.clips where project_id = OLD.project_id)
    where id = OLD.project_id;
  else
    update public.projects
    set
      clip_count = (select count(*) from public.clips where project_id = NEW.project_id),
      total_duration = (select coalesce(sum(end_time - start_time), 0) from public.clips where project_id = NEW.project_id)
    where id = NEW.project_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger clips_sync_project_stats
  after insert or update or delete on public.clips
  for each row execute procedure public.sync_project_clip_stats();

-- ─────────────────────────────────────────────
-- TABELA: exports (histórico completo)
-- ─────────────────────────────────────────────
create table public.exports (
  id           uuid primary key default uuid_generate_v4(),
  clip_id      uuid not null references public.clips(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  platform     platform_type not null,
  quality      export_quality not null,
  file_size    bigint,
  file_url     text,
  duration_s   numeric(10,2),
  status       text not null default 'pending',   -- pending | processing | done | error
  error_msg    text,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

create index idx_exports_user_id    on public.exports(user_id);
create index idx_exports_created_at on public.exports(created_at desc);

-- ─────────────────────────────────────────────
-- TABELA: analytics_daily (snapshot diário)
-- ─────────────────────────────────────────────
create table public.analytics_daily (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  date         date not null,
  exports      int not null default 0,
  clips_created int not null default 0,
  storage_used bigint not null default 0,
  unique(user_id, date)
);

create index idx_analytics_user_date on public.analytics_daily(user_id, date desc);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Garante isolamento total entre usuários
-- ─────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.projects         enable row level security;
alter table public.clips            enable row level security;
alter table public.exports          enable row level security;
alter table public.analytics_daily  enable row level security;

-- profiles: usuário lê/edita apenas o próprio
create policy "profiles: select own"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- projects: CRUD apenas do próprio usuário
create policy "projects: select own"
  on public.projects for select using (auth.uid() = user_id);

create policy "projects: insert own"
  on public.projects for insert with check (auth.uid() = user_id);

create policy "projects: update own"
  on public.projects for update using (auth.uid() = user_id);

create policy "projects: delete own"
  on public.projects for delete using (auth.uid() = user_id);

-- clips
create policy "clips: select own"
  on public.clips for select using (auth.uid() = user_id);

create policy "clips: insert own"
  on public.clips for insert with check (auth.uid() = user_id);

create policy "clips: update own"
  on public.clips for update using (auth.uid() = user_id);

create policy "clips: delete own"
  on public.clips for delete using (auth.uid() = user_id);

-- exports
create policy "exports: select own"
  on public.exports for select using (auth.uid() = user_id);

create policy "exports: insert own"
  on public.exports for insert with check (auth.uid() = user_id);

-- analytics
create policy "analytics: select own"
  on public.analytics_daily for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- VIEWS ÚTEIS
-- ─────────────────────────────────────────────

-- Resumo do usuário logado (dashboard)
create or replace view public.my_dashboard as
select
  p.id,
  p.name,
  p.plan,
  p.storage_used,
  p.storage_limit,
  p.exports_month,
  (select count(*)  from public.projects where user_id = p.id and status = 'active')                   as active_projects,
  (select count(*)  from public.clips    where user_id = p.id)                                         as total_clips,
  (select count(*)  from public.clips    where user_id = p.id and status = 'rendering')                as rendering_count,
  (select count(*)  from public.clips    where user_id = p.id and status = 'ready')                    as queue_count,
  (select count(*)  from public.exports  where user_id = p.id and created_at > now() - interval '1 day') as exports_today
from public.profiles p
where p.id = auth.uid();

-- Analytics semanal do usuário
create or replace view public.my_weekly_analytics as
select
  date,
  exports,
  clips_created,
  storage_used
from public.analytics_daily
where user_id = auth.uid()
  and date >= current_date - interval '7 days'
order by date;

-- ─────────────────────────────────────────────
-- STORAGE BUCKET para arquivos exportados
-- ─────────────────────────────────────────────
-- Execute no SQL Editor após criar o bucket no painel:
insert into storage.buckets (id, name, public)
values ('exports', 'exports', false)
on conflict do nothing;

create policy "exports bucket: owner read"
  on storage.objects for select
  using (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "exports bucket: owner upload"
  on storage.objects for insert
  with check (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "exports bucket: owner delete"
  on storage.objects for delete
  using (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);
