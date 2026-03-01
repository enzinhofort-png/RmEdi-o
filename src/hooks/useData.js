// src/hooks/useData.js
// ─────────────────────────────────────────────
// Hooks de dados: projetos, clipes, analytics
// Todas as operações são isoladas por user_id via RLS
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// ═══════════════════════════════════════════════
// useProjects — CRUD de projetos
// ═══════════════════════════════════════════════
export function useProjects(userId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Buscar projetos ──
  const fetchProjects = useCallback(async (filter = {}) => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    let query = supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (filter.status) query = query.eq("status", filter.status);
    if (filter.search) query = query.ilike("name", `%${filter.search}%`);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setProjects(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Criar projeto ──
  const createProject = useCallback(async ({ name, description, sourceUrl, thumb = "🎬" }) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([{
        user_id: userId,
        name,
        description,
        source_url: sourceUrl,
        thumb,
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setProjects(prev => [data, ...prev]);
    return { success: true, project: data };
  }, [userId]);

  // ── Atualizar projeto ──
  const updateProject = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setProjects(prev => prev.map(p => p.id === id ? data : p));
    return { success: true, project: data };
  }, []);

  // ── Arquivar / restaurar projeto ──
  const archiveProject = useCallback(async (id, archive = true) => {
    return updateProject(id, { status: archive ? "archived" : "active" });
  }, [updateProject]);

  // ── Deletar projeto ──
  const deleteProject = useCallback(async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    setProjects(prev => prev.filter(p => p.id !== id));
    return { success: true };
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    archiveProject,
    deleteProject,
  };
}

// ═══════════════════════════════════════════════
// useClips — CRUD de clipes de um projeto
// ═══════════════════════════════════════════════
export function useClips(projectId, userId) {
  const [clips, setClips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchClips = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) setError(error.message);
    else setClips(data || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchClips(); }, [fetchClips]);

  // ── Criar clipe ──
  const createClip = useCallback(async (clipData) => {
    const { data, error } = await supabase
      .from("clips")
      .insert([{
        project_id:    projectId,
        user_id:       userId,
        name:          clipData.name,
        start_time:    clipData.start,
        end_time:      clipData.end,
        platform:      clipData.platform || "tiktok",
        quality:       clipData.quality  || "hd",
        has_captions:  clipData.hasCaptions || false,
        caption_text:  clipData.captionText || "",
        caption_style: clipData.captionStyle || 0,
        caption_font:  clipData.captionFont  || "Oswald",
        caption_size:  clipData.captionSize  || 24,
        zoom_level:    clipData.zoomLevel    || 100,
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setClips(prev => [...prev, data]);
    return { success: true, clip: data };
  }, [projectId, userId]);

  // ── Atualizar clipe ──
  const updateClip = useCallback(async (id, updates) => {
    // Mapeia campos do frontend para snake_case do banco
    const dbUpdates = {};
    if (updates.name          !== undefined) dbUpdates.name           = updates.name;
    if (updates.start         !== undefined) dbUpdates.start_time     = updates.start;
    if (updates.end           !== undefined) dbUpdates.end_time       = updates.end;
    if (updates.platform      !== undefined) dbUpdates.platform       = updates.platform;
    if (updates.quality       !== undefined) dbUpdates.quality        = updates.quality;
    if (updates.status        !== undefined) dbUpdates.status         = updates.status;
    if (updates.renderProgress!== undefined) dbUpdates.render_progress= updates.renderProgress;
    if (updates.hasCaptions   !== undefined) dbUpdates.has_captions   = updates.hasCaptions;
    if (updates.captionText   !== undefined) dbUpdates.caption_text   = updates.captionText;
    if (updates.captionStyle  !== undefined) dbUpdates.caption_style  = updates.captionStyle;
    if (updates.captionFont   !== undefined) dbUpdates.caption_font   = updates.captionFont;
    if (updates.captionSize   !== undefined) dbUpdates.caption_size   = updates.captionSize;
    if (updates.zoomLevel     !== undefined) dbUpdates.zoom_level     = updates.zoomLevel;
    if (updates.fileSize      !== undefined) dbUpdates.file_size      = updates.fileSize;
    if (updates.fileUrl       !== undefined) dbUpdates.file_url       = updates.fileUrl;
    if (updates.exportedAt    !== undefined) dbUpdates.exported_at    = updates.exportedAt;

    const { data, error } = await supabase
      .from("clips")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setClips(prev => prev.map(c => c.id === id ? data : c));
    return { success: true, clip: data };
  }, []);

  // ── Duplicar clipe ──
  const duplicateClip = useCallback(async (id) => {
    const original = clips.find(c => c.id === id);
    if (!original) return { success: false };

    const { id: _, created_at, updated_at, ...rest } = original;
    const { data, error } = await supabase
      .from("clips")
      .insert([{ ...rest, name: `${rest.name} (cópia)`, status: "ready", render_progress: 0, exported_at: null, file_size: null, file_url: null }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setClips(prev => [...prev, data]);
    return { success: true, clip: data };
  }, [clips]);

  // ── Deletar clipe ──
  const deleteClip = useCallback(async (id) => {
    const { error } = await supabase.from("clips").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    setClips(prev => prev.filter(c => c.id !== id));
    return { success: true };
  }, []);

  // ── Simular export (em prod: chamar Edge Function) ──
  const startExport = useCallback(async (id) => {
    // 1. Marca como renderizando
    await updateClip(id, { status: "rendering", renderProgress: 0 });

    // 2. Simula progresso (substituir por polling da Edge Function real)
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 8 + 3;
      if (progress >= 100) {
        clearInterval(interval);
        await updateClip(id, {
          status: "exported",
          renderProgress: 100,
          exportedAt: new Date().toISOString(),
          fileSize: Math.floor(Math.random() * 50000000) + 5000000,
        });
      } else {
        await updateClip(id, { renderProgress: Math.min(99, Math.floor(progress)) });
      }
    }, 400);

    return { success: true };
  }, [updateClip]);

  return {
    clips,
    loading,
    error,
    refetch: fetchClips,
    createClip,
    updateClip,
    duplicateClip,
    deleteClip,
    startExport,
  };
}

// ═══════════════════════════════════════════════
// useAnalytics — dados de analytics do usuário
// ═══════════════════════════════════════════════
export function useAnalytics(userId) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      // Semanal
      const { data: weekly } = await supabase
        .from("analytics_daily")
        .select("date, exports, clips_created")
        .eq("user_id", userId)
        .gte("date", new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0])
        .order("date");

      // Plataformas (agrupa exports por plataforma)
      const { data: byPlatform } = await supabase
        .from("exports")
        .select("platform")
        .eq("user_id", userId)
        .eq("status", "done");

      // Crescimento mensal
      const { data: monthly } = await supabase
        .from("analytics_daily")
        .select("date, clips_created")
        .eq("user_id", userId)
        .gte("date", new Date(Date.now() - 180 * 86400000).toISOString().split("T")[0])
        .order("date");

      // Agrupa plataformas
      const platformMap = (byPlatform || []).reduce((acc, e) => {
        acc[e.platform] = (acc[e.platform] || 0) + 1;
        return acc;
      }, {});
      const total = Object.values(platformMap).reduce((a, b) => a + b, 0) || 1;
      const platformBreakdown = Object.entries(platformMap).map(([p, c]) => ({
        platform: p.charAt(0).toUpperCase() + p.slice(1),
        count: c,
        pct: Math.round((c / total) * 100),
      }));

      setData({
        weeklyExports: (weekly || []).map(d => ({
          day: new Date(d.date).toLocaleDateString("pt-BR", { weekday: "short" }),
          count: d.exports,
        })),
        platformBreakdown,
        monthlyGrowth: (monthly || []).map(d => ({
          month: new Date(d.date).toLocaleDateString("pt-BR", { month: "short" }),
          clips: d.clips_created,
        })),
      });
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { data, loading };
}

// ═══════════════════════════════════════════════
// useDashboard — view agregada (my_dashboard)
// ═══════════════════════════════════════════════
export function useDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("my_dashboard")
      .select("*")
      .single()
      .then(({ data }) => { setData(data); setLoading(false); });
  }, []);

  // Realtime: atualiza quando renders mudam
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "clips" }, () => {
        supabase.from("my_dashboard").select("*").single().then(({ data }) => setData(data));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return { data, loading };
}
