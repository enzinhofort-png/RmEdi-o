# ClipStudio — Guia de Implantação
## Supabase Auth + Banco de Dados

---

## 📋 Visão Geral da Arquitetura

```
ClipStudio (React/Vite)
        │
        ▼
  Supabase Auth         → Login, registro, OAuth, JWT
  Supabase Database     → PostgreSQL com RLS
  Supabase Storage      → Arquivos exportados
  Supabase Realtime     → Progresso de render ao vivo
```

---

## 🚀 Passo 1 — Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **"New Project"**
3. Escolha um nome (ex: `clipstudio`), senha forte para o banco e região **South America (São Paulo)**
4. Aguarde ~2 minutos enquanto o banco é provisionado

---

## 🗄️ Passo 2 — Criar o Banco de Dados

1. No painel Supabase, vá em **SQL Editor** (ícone de terminal na sidebar)
2. Clique em **"New Query"**
3. Cole todo o conteúdo de `supabase/schema.sql`
4. Clique em **"Run"** (ou `Ctrl+Enter`)

Você verá as tabelas criadas em **Table Editor**:
- `profiles` — dados dos usuários
- `projects` — projetos de vídeo
- `clips` — clipes editados
- `exports` — histórico de exports
- `analytics_daily` — métricas diárias

---

## 🔑 Passo 3 — Configurar Variáveis de Ambiente

1. No painel Supabase, vá em **Settings → API**
2. Copie a **Project URL** e a **anon public key**
3. Na raiz do projeto, crie o arquivo `.env`:

```bash
cp .env.example .env
```

4. Preencha com seus valores:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔐 Passo 4 — Configurar Autenticação

### E-mail/Senha (já habilitado por padrão)
Nenhuma configuração extra necessária.

### Google OAuth
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto → **APIs & Services → Credentials**
3. Crie **OAuth 2.0 Client ID** (tipo: Web Application)
4. Adicione em **Authorized redirect URIs**:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
5. No Supabase: **Authentication → Providers → Google**
6. Cole o **Client ID** e **Client Secret**

### GitHub OAuth
1. Acesse [github.com/settings/developers](https://github.com/settings/developers)
2. **New OAuth App**
3. **Authorization callback URL**:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. No Supabase: **Authentication → Providers → GitHub**
5. Cole o **Client ID** e **Client Secret**

---

## 📦 Passo 5 — Instalar Dependências e Rodar

```bash
# Instalar pacotes
npm install @supabase/supabase-js

# Iniciar em desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

---

## 🔗 Passo 6 — Integrar os Hooks no App

Os arquivos estão em `src/hooks/`. Uso básico:

### Autenticação
```jsx
import { useAuth } from "./hooks/useAuth";

function MinhaPagina() {
  const { profile, signOut } = useAuth();
  return <p>Olá, {profile?.name}!</p>;
}
```

### Projetos
```jsx
import { useProjects } from "./hooks/useData";

function Projetos() {
  const { projects, createProject, deleteProject } = useProjects(userId);

  const handleNovo = async () => {
    await createProject({
      name: "Meu Novo Projeto",
      description: "Stream de hoje",
      sourceUrl: "https://youtube.com/...",
      thumb: "🎮",
    });
  };

  return projects.map(p => <div key={p.id}>{p.name}</div>);
}
```

### Clipes
```jsx
import { useClips } from "./hooks/useData";

function Editor({ projectId, userId }) {
  const { clips, createClip, updateClip, deleteClip, startExport } = useClips(projectId, userId);

  const handleExport = async (clipId) => {
    await startExport(clipId); // atualiza status em tempo real
  };
}
```

### Dashboard com Realtime
```jsx
import { useDashboard } from "./hooks/useData";

function Dashboard() {
  const { data } = useDashboard();
  // data.rendering_count atualiza automaticamente via WebSocket
}
```

---

## 🛡️ Segurança — Row Level Security (RLS)

**Todas as tabelas têm RLS ativo.** Isso significa:

✅ Cada usuário só enxerga e modifica os próprios dados  
✅ Funciona automaticamente via JWT do Supabase Auth  
✅ Não é possível acessar dados de outros usuários, mesmo via API direta  

Nunca desabilite o RLS em produção.

---

## 📊 Estrutura de Arquivos

```
clipstudio/
├── src/
│   ├── App.jsx                    ← Entry point com auth routing
│   ├── clipstudio-platform.jsx    ← Componentes de UI
│   ├── lib/
│   │   └── supabase.js            ← Cliente Supabase
│   └── hooks/
│       ├── useAuth.js             ← Auth completo
│       └── useData.js             ← Projetos, clipes, analytics
├── supabase/
│   └── schema.sql                 ← Execute no painel Supabase
├── .env                           ← Suas chaves (não commite!)
├── .env.example                   ← Template público
└── .gitignore                     ← Inclua .env aqui
```

---

## 🚨 Checklist antes de ir para produção

- [ ] `.env` no `.gitignore`
- [ ] RLS habilitado em todas as tabelas ✅ (já está no schema)
- [ ] Confirmar e-mail habilitado (Supabase → Auth → Settings)
- [ ] URL de confirmação apontando para seu domínio real
- [ ] Storage bucket criado (supabase/schema.sql já inclui)
- [ ] Deploy na Vercel com variáveis de ambiente configuradas

---

## 🔜 Próximos Passos Recomendados

| Prioridade | Feature | Como |
|---|---|---|
| 🔴 Alta | Deploy na Vercel | `vercel --prod` |
| 🔴 Alta | Render real de vídeo | Supabase Edge Functions + FFmpeg.wasm |
| 🟡 Média | Pagamentos | Stripe + Supabase webhooks |
| 🟡 Média | Upload de vídeo | Supabase Storage direto |
| 🟢 Baixa | E-mails transacionais | Resend + Supabase hooks |
| 🟢 Baixa | Dashboard admin | Supabase Studio ou Metabase |
