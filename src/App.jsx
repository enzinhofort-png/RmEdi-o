// src/App.jsx
// ─────────────────────────────────────────────
// Entry point com autenticação real (Supabase)
// e roteamento de páginas
// ─────────────────────────────────────────────

import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { AuthScreen } from "./components/AuthScreen";

import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { Editor } from "./components/Editor";
import { ProjectsPage } from "./components/ProjectsPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { RenderQueuePage } from "./components/RenderQueuePage";
import { SettingsPage } from "./components/SettingsPage";
import { PricingPage } from "./components/PricingPage";

export default function App() {
  const { isAuthenticated, loading, profile, signOut } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Tela de loading inicial (verifica sessão salva)
  if (loading) return (
    <div className="h-screen w-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 20L18 4M18 4H10M18 4V12" />
          </svg>
        </div>
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    </div>
  );

  // Usuário não autenticado → tela de login
  if (!isAuthenticated) return <AuthScreen />;

  // Usuário autenticado → app completo
  // O `profile` vem do banco (tabela profiles) com todos os dados reais
  const user = profile ? {
    id: profile.id,
    name: profile.name,
    email: profile.email || "",
    avatar: profile.avatar_url,
    plan: profile.plan,
    storageUsed: profile.storage_used,
    storageLimit: profile.storage_limit,
    exportsThisMonth: profile.exports_month,
    createdAt: profile.created_at,
  } : null;

  return (
    <div className="h-screen w-screen flex bg-gray-950 text-white overflow-hidden" style={{ fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        @keyframes scale-in { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(200%)} }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { appearance:none; width:12px; height:12px; border-radius:50%; background:#7c3aed; cursor:pointer; }
      `}</style>

      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        onLogout={signOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} setPage={setPage} />
        <div className="flex-1 overflow-hidden">
          {page === "dashboard" && <Dashboard setPage={setPage} user={user} setProjectId={setSelectedProjectId} />}
          {page === "editor" && <Editor setPage={setPage} user={user} projectId={selectedProjectId} />}
          {page === "projects" && <ProjectsPage setPage={setPage} user={user} setProjectId={setSelectedProjectId} />}
          {page === "analytics" && <AnalyticsPage />}
          {page === "render-queue" && <RenderQueuePage user={user} />}
          {page === "settings" && <SettingsPage user={user} setPage={setPage} />}
          {page === "pricing" && <PricingPage setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}
