import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Video, Scissors, Upload, Download, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Type, Music, Maximize, Monitor, Smartphone, Square,
  Settings, Clock, FolderOpen, Plus, Trash2, Copy, Share2, Zap, Layout,
  ChevronDown, ChevronRight, X, Check, AlertTriangle, Layers, Move, ZoomIn,
  Sun, Moon, Home, Film, BarChart3, Crown, Search, Bell, User, Menu,
  GripVertical, Eye, EyeOff, RotateCcw, Sparkles, ChevronLeft, LogOut,
  Mail, Lock, UserPlus, CreditCard, Shield, Globe, Image, Palette, Save,
  RefreshCw, HardDrive, Wifi, WifiOff, Star, Heart, MessageSquare, Flag,
  Filter, SortAsc, Grid, List, MoreVertical, ExternalLink, Headphones, Mic,
  Camera, Sliders, Gauge, Database, Server, Cloud, Key, ArrowRight, ArrowLeft,
  CheckCircle, XCircle, Info, AlertCircle, Loader, TrendingUp, Flame,
  Scissors as ScissorsIcon, FileVideo, Wand2, BarChart2, Users, Activity,
  Keyboard, BookOpen, Hash, Link, Repeat, Shuffle, SkipForward as Next,
  ChevronUp, Timer, Cpu, Wifi as WifiIcon, Package, Rocket, Target, Award
} from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS & CONFIG
// ─────────────────────────────────────────────
const PRESETS = {
  tiktok: { label: "TikTok", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "📱", color: "#FF0050" },
  reels: { label: "Reels", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "📸", color: "#E1306C" },
  shorts: { label: "Shorts", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "▶️", color: "#FF0000" },
  youtube: { label: "YouTube", ratio: "16:9", w: 1920, h: 1080, fps: 60, bitrate: "16M", icon: "🎬", color: "#FF0000" },
  square: { label: "Square", ratio: "1:1", w: 1080, h: 1080, fps: 30, bitrate: "8M", icon: "⬜", color: "#667eea" },
};

const FONTS = ["Montserrat", "Oswald", "Bebas Neue", "Poppins", "Roboto Condensed", "Impact", "Inter", "Arial Black"];

const CAPTION_STYLES = [
  { id: "neon", name: "Neon Glow", bg: "transparent", color: "#00ff88", stroke: true, shadow: "0 0 20px #00ff8860" },
  { id: "classic", name: "Clássico Branco", bg: "rgba(0,0,0,0.75)", color: "#ffffff", stroke: false, shadow: "none" },
  { id: "yellow", name: "Amarelo Bold", bg: "transparent", color: "#ffd700", stroke: true, shadow: "0 0 20px #ffd70060" },
  { id: "minimal", name: "Minimalista", bg: "rgba(255,255,255,0.92)", color: "#111111", stroke: false, shadow: "none" },
  { id: "fire", name: "Vermelho Fogo", bg: "transparent", color: "#ff4444", stroke: true, shadow: "0 0 20px #ff444460" },
  { id: "gradient", name: "Gradiente", bg: "linear-gradient(135deg,#667eea,#764ba2)", color: "#ffffff", stroke: false, shadow: "none" },
];

const PLANS = [
  { id: "free", name: "Gratuito", price: "R$ 0", period: "/mês", badge: "", features: ["5 exports/mês", "720p máximo", "1 GB armazenamento", "Marca d'água", "Suporte básico"], color: "gray", popular: false },
  { id: "pro", name: "Profissional", price: "R$ 49", period: "/mês", badge: "Mais popular", features: ["Exports ilimitados", "1080p + 4K", "50 GB armazenamento", "Sem marca d'água", "Legendas IA", "Analytics avançado", "Suporte prioritário"], color: "violet", popular: true },
  { id: "team", name: "Equipe", price: "R$ 149", period: "/mês", badge: "Melhor custo-benefício", features: ["Tudo do Pro", "Até 10 membros", "200 GB compartilhado", "API completa", "Workspace colaborativo", "Painel de gerentes", "SLA garantido"], color: "emerald", popular: false },
];

const QUALITY_OPTIONS = [
  { id: "draft", label: "Rascunho", desc: "480p · Ultra-rápido", resolution: "854×480", size: "~8 MB", color: "gray" },
  { id: "hd", label: "HD", desc: "1080p · Recomendado", resolution: "1920×1080", size: "~45 MB", color: "violet" },
  { id: "max", label: "4K Max", desc: "2160p · Premium", resolution: "3840×2160", size: "~120 MB", color: "emerald" },
];

function formatTime(s) {
  if (isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function formatDate(d) { return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1) + " MB";
  return (b / 1073741824).toFixed(1) + " GB";
}
function gid() { return Math.random().toString(36).substr(2, 9); }

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const mockUser = {
  id: "usr_1", name: "João Silva", email: "joao@email.com", avatar: null,
  plan: "pro", storageUsed: 4.2 * 1073741824, storageLimit: 50 * 1073741824,
  exportsThisMonth: 47, createdAt: "2025-11-15",
};

const mockProjects = [
  { id: "prj_1", name: "Stream Highlights - Fev 25", description: "Melhores momentos da live de sábado", clipCount: 8, totalDuration: 245, createdAt: "2026-02-25T14:30:00", updatedAt: "2026-02-25T18:45:00", thumb: "🎮", status: "active", sourceUrl: "https://youtube.com/watch?v=abc123" },
  { id: "prj_2", name: "Podcast EP42 - Cortes", description: "Cortes do episódio sobre IA", clipCount: 5, totalDuration: 180, createdAt: "2026-02-23T10:00:00", updatedAt: "2026-02-24T09:15:00", thumb: "🎙️", status: "active", sourceUrl: "https://youtube.com/watch?v=def456" },
  { id: "prj_3", name: "Tutorial React Series", description: "Série de tutoriais React", clipCount: 12, totalDuration: 720, createdAt: "2026-02-20T08:00:00", updatedAt: "2026-02-22T16:30:00", thumb: "📚", status: "active", sourceUrl: "https://youtube.com/watch?v=ghi789" },
  { id: "prj_4", name: "Gaming Montage GTA", description: "Melhores jogadas da semana", clipCount: 15, totalDuration: 540, createdAt: "2026-02-18T20:00:00", updatedAt: "2026-02-19T22:10:00", thumb: "🕹️", status: "archived", sourceUrl: "https://twitch.tv/videos/jkl012" },
  { id: "prj_5", name: "Receitas Rápidas", description: "Cortes do canal de culinária", clipCount: 6, totalDuration: 300, createdAt: "2026-02-15T12:00:00", updatedAt: "2026-02-16T14:00:00", thumb: "🍳", status: "active", sourceUrl: "https://youtube.com/watch?v=mno345" },
  { id: "prj_6", name: "Fitness Challenge", description: "Desafio de 30 dias", clipCount: 30, totalDuration: 900, createdAt: "2026-02-10T06:00:00", updatedAt: "2026-02-28T07:00:00", thumb: "💪", status: "active", sourceUrl: "https://youtube.com/watch?v=pqr678" },
];

const mockClips = [
  { id: "clp_1", projectId: "prj_1", name: "Highlight #1 - Pentakill", start: 12, end: 45, platform: "tiktok", status: "exported", captions: true, quality: "hd", exportedAt: "2026-02-25T19:00:00", fileSize: 15728640, renderProgress: 100 },
  { id: "clp_2", projectId: "prj_1", name: "Reação épica", start: 120, end: 155, platform: "reels", status: "rendering", captions: true, quality: "hd", exportedAt: null, fileSize: null, renderProgress: 65 },
  { id: "clp_3", projectId: "prj_1", name: "Intro da Live", start: 0, end: 30, platform: "youtube", status: "ready", captions: false, quality: "max", exportedAt: null, fileSize: null, renderProgress: 0 },
  { id: "clp_4", projectId: "prj_1", name: "Rage Quit Engraçado", start: 200, end: 218, platform: "shorts", status: "exported", captions: true, quality: "hd", exportedAt: "2026-02-25T19:30:00", fileSize: 8388608, renderProgress: 100 },
  { id: "clp_5", projectId: "prj_1", name: "Final Emocionante", start: 280, end: 324, platform: "tiktok", status: "ready", captions: true, quality: "hd", exportedAt: null, fileSize: null, renderProgress: 0 },
];

const mockNotifications = [
  { id: 1, type: "success", title: "Export concluído", message: "Highlight #1 exportado com sucesso", time: "5 min atrás", read: false },
  { id: 2, type: "warning", title: "Alerta de copyright", message: "Música detectada no clipe 'Reação épica'", time: "15 min atrás", read: false },
  { id: 3, type: "info", title: "Novo recurso", message: "Legendas automáticas com IA disponíveis!", time: "1h atrás", read: true },
  { id: 4, type: "success", title: "Render completo", message: "3 clipes renderizados no projeto Tutorial", time: "3h atrás", read: true },
];

const mockAnalytics = {
  weeklyExports: [{ day: "Seg", count: 18 }, { day: "Ter", count: 24 }, { day: "Qua", count: 12 }, { day: "Qui", count: 32 }, { day: "Sex", count: 28 }, { day: "Sáb", count: 35 }, { day: "Dom", count: 22 }],
  hourlyExports: [{ h: "00", c: 2 }, { h: "03", c: 1 }, { h: "06", c: 4 }, { h: "09", c: 15 }, { h: "12", c: 22 }, { h: "15", c: 28 }, { h: "18", c: 35 }, { h: "21", c: 18 }],
  platformBreakdown: [{ platform: "TikTok", count: 89, pct: 36 }, { platform: "Reels", count: 67, pct: 27 }, { platform: "Shorts", count: 52, pct: 21 }, { platform: "YouTube", count: 28, pct: 11 }, { platform: "Square", count: 11, pct: 5 }],
  monthlyGrowth: [{ month: "Set", clips: 42 }, { month: "Out", clips: 78 }, { month: "Nov", clips: 120 }, { month: "Dez", clips: 156 }, { month: "Jan", clips: 198 }, { month: "Fev", clips: 247 }],
};

const SHORTCUTS = [
  { keys: ["Space"], desc: "Play / Pausa" },
  { keys: ["←", "→"], desc: "Avançar / Retroceder 5s" },
  { keys: ["[", "]"], desc: "Marcar In / Out" },
  { keys: ["Ctrl", "S"], desc: "Salvar projeto" },
  { keys: ["Ctrl", "Z"], desc: "Desfazer" },
  { keys: ["Ctrl", "D"], desc: "Duplicar clipe" },
  { keys: ["Delete"], desc: "Deletar clipe selecionado" },
  { keys: ["Ctrl", "E"], desc: "Abrir modal de export" },
  { keys: ["N"], desc: "Novo clipe no tempo atual" },
  { keys: ["Esc"], desc: "Fechar modal" },
];

// ─────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────
export const Badge = ({ children, variant = "default", size = "sm" }) => {
  const v = {
    default: "bg-gray-700 text-gray-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    error: "bg-red-500/20 text-red-400 border border-red-500/20",
    info: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
    violet: "bg-violet-500/20 text-violet-400 border border-violet-500/20",
    premium: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/20",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v[variant]} ${size === "xs" ? "px-1.5 py-px text-[10px]" : ""}`}>{children}</span>;
};

export const Toggle = ({ value, onChange, label, sublabel }) => (
  <div className="flex items-center justify-between gap-4">
    {label && <div><span className="text-gray-300 text-sm">{label}</span>{sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}</div>}
    <button onClick={() => onChange(!value)} className={`w-10 h-5.5 h-[22px] rounded-full transition-all duration-200 relative shrink-0 ${value ? "bg-violet-600 shadow-lg shadow-violet-600/30" : "bg-gray-700"}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-transform duration-200 shadow ${value ? "translate-x-5" : "translate-x-[3px]"}`} />
    </button>
  </div>
);

export const Modal = ({ open, onClose, title, children, size = "md", noPad = false }) => {
  useEffect(() => { const h = (e) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h); }, [onClose]);
  if (!open) return null;
  const s = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl" };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-gray-900 rounded-2xl border border-gray-700/80 shadow-2xl w-full ${s[size]} max-h-[90vh] flex flex-col`} style={{ animation: "scale-in 0.15s ease-out" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"><X size={16} /></button>
        </div>
        <div className={`flex-1 overflow-auto ${noPad ? "" : "p-5"}`}>{children}</div>
      </div>
    </div>
  );
};

export const ProgressBar = ({ value, max = 100, color = "violet", size = "md", showLabel = false, animated = false }) => {
  const pct = Math.min(100, (value / max) * 100);
  const colors = { violet: "from-violet-500 to-purple-500", emerald: "from-emerald-500 to-green-500", blue: "from-blue-500 to-cyan-500", orange: "from-orange-500 to-red-500", gray: "from-gray-500 to-gray-400" };
  const heights = { xs: "h-0.5", sm: "h-1", md: "h-2", lg: "h-3" };
  return (
    <div className="w-full">
      <div className={`w-full ${heights[size]} bg-gray-800 rounded-full overflow-hidden`}>
        <div className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700 ${animated ? "relative overflow-hidden" : ""}`} style={{ width: `${pct}%` }}>
          {animated && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />}
        </div>
      </div>
      {showLabel && <div className="flex justify-between mt-1 text-xs text-gray-500"><span>{Math.round(pct)}%</span><span>{formatBytes(value)} / {formatBytes(max)}</span></div>}
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 border border-gray-700"><Icon size={30} className="text-gray-600" /></div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-5 max-w-xs leading-relaxed">{description}</p>
    {action && <button onClick={onAction} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-violet-600/20"><Plus size={16} />{action}</button>}
  </div>
);

export const Tooltip = ({ children, text, side = "top" }) => (
  <div className="relative group">
    {children}
    {text && (
      <div className={`absolute ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"} left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 z-50 shadow-lg`}>
        {text}
      </div>
    )}
  </div>
);

const KbdKey = ({ keys }) => (
  <div className="flex items-center gap-1">
    {keys.map((k, i) => <kbd key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">{k}</kbd>)}
  </div>
);

export const Stat = ({ label, value, change, icon: Icon, gradient, onClick }) => (
  <div onClick={onClick} className={`bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-200 ${onClick ? "cursor-pointer hover:scale-[1.01]" : ""}`}>
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}><Icon size={18} className="text-white" /></div>
    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    <div className="flex items-center justify-between mt-1">
      <span className="text-gray-500 text-xs">{label}</span>
      {change && <span className="text-emerald-400 text-xs font-medium">{change}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || (!recovery && !pass)) { setError("Preencha todos os campos"); return; }
    if (mode === "register" && !name) { setError("Preencha seu nome"); return; }
    if (recovery) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setRecoverySent(true); }, 1000);
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(mockUser); }, 1200);
  };

  return (
    <div className="h-screen w-screen bg-gray-950 flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0f0520] via-[#12063a] to-[#0a0a1a]">
        {/* Animated orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-pink-600/15 blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] animate-pulse" style={{ animationDelay: "0.8s" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 flex flex-col justify-center p-16 max-w-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30"><Scissors size={20} className="text-white" /></div>
            <span className="text-2xl font-bold text-white tracking-tight">ClipStudio</span>
            <Badge variant="premium">PRO</Badge>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
            Crie clipes<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">profissionais</span><br />
            em minutos
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">A plataforma mais rápida para clipadores. Recorte, edite e exporte para TikTok, Reels, Shorts e YouTube com IA.</p>
          <div className="space-y-4">
            {[
              [Sparkles, "Legendas automáticas com IA", "Geração instantânea em português"],
              [Zap, "Export otimizado por plataforma", "TikTok, Reels, Shorts, YouTube"],
              [Layers, "Timeline visual com waveform", "Edição precisa com handles arrastáveis"],
              [Cloud, "Processamento em nuvem", "Renderização paralela ultra-rápida"],
            ].map(([Icon, t, sub], i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-violet-500/15 border border-violet-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Icon size={15} className="text-violet-400" /></div>
                <div><p className="text-white text-sm font-medium">{t}</p><p className="text-gray-500 text-xs mt-0.5">{sub}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">{["🎮", "🎙️", "📺", "💪", "🍳"].map((e, i) => <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-sm">{e}</div>)}</div>
            <p className="text-gray-400 text-sm"><span className="text-white font-semibold">+12.400</span> clipadores ativos</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center"><Scissors size={16} className="text-white" /></div>
            <span className="text-xl font-bold text-white">ClipStudio</span>
          </div>

          {recoverySent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-emerald-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-2">E-mail enviado!</h2>
              <p className="text-gray-400 text-sm mb-6">Verifique sua caixa de entrada para redefinir sua senha.</p>
              <button onClick={() => { setRecovery(false); setRecoverySent(false); }} className="text-violet-400 text-sm hover:underline">← Voltar ao login</button>
            </div>
          ) : recovery ? (
            <>
              <button onClick={() => setRecovery(false)} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition-colors"><ChevronLeft size={16} />Voltar</button>
              <h2 className="text-2xl font-bold text-white mb-1">Recuperar senha</h2>
              <p className="text-gray-400 text-sm mb-6">Digite seu e-mail e enviaremos as instruções.</p>
              {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-red-400 text-sm"><AlertCircle size={16} />{error}</div>}
              <div className="relative mb-4"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu e-mail" type="email" className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" /></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader size={16} className="animate-spin" />Enviando...</> : <>Enviar link de recuperação</>}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">{mode === "login" ? "Bem-vindo de volta" : "Criar conta"}</h2>
              <p className="text-gray-400 text-sm mb-6">{mode === "login" ? "Entre na sua conta para continuar" : "Comece a criar clipes profissionais"}</p>
              {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-red-400 text-sm"><AlertCircle size={16} />{error}</div>}
              <div className="space-y-3">
                {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Seu nome completo" className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" />}
                <div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" /><input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Seu e-mail" type="email" className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" /></div>
                <div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Senha" type={showPass ? "text" : "password"} className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-11 pr-12 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
              </div>
              {mode === "login" && <button onClick={() => { setRecovery(true); setError(""); }} className="text-violet-400 text-xs mt-2.5 block hover:underline">Esqueceu a senha?</button>}
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-all mt-5 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
                {loading ? <><Loader size={16} className="animate-spin" />Processando...</> : mode === "login" ? <>Entrar</> : <><UserPlus size={16} />Criar Conta</>}
              </button>
              <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-gray-800" /><span className="text-gray-600 text-xs">ou continue com</span><div className="flex-1 h-px bg-gray-800" /></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(mockUser); }, 800); }} className="flex items-center justify-center gap-2.5 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm transition-colors border border-gray-700"><span className="font-bold text-base leading-none" style={{ fontFamily: "serif" }}>G</span>Google</button>
                <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(mockUser); }, 800); }} className="flex items-center justify-center gap-2.5 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm transition-colors border border-gray-700"><Globe size={15} />GitHub</button>
              </div>
              <p className="text-center text-gray-500 text-sm mt-6">
                {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
                <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-violet-400 hover:underline font-medium">{mode === "login" ? "Criar conta grátis" : "Fazer login"}</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
export const Sidebar = ({ page, setPage, collapsed, setCollapsed, user, onLogout }) => {
  const items = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "editor", icon: Film, label: "Editor" },
    { id: "projects", icon: FolderOpen, label: "Projetos" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "render-queue", icon: Server, label: "Fila de Render", badge: 3 },
    { id: "settings", icon: Settings, label: "Configurações" },
  ];
  return (
    <div className={`flex flex-col bg-[#0a0a10] border-r border-gray-800/80 transition-all duration-300 shrink-0 ${collapsed ? "w-16" : "w-56"}`}>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-800/80 h-14">
        <div className={`flex items-center gap-2.5 ${collapsed ? "mx-auto" : ""}`}>
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md shadow-violet-500/30">
            <Scissors size={14} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">ClipStudio</span>
              <Badge variant="premium">PRO</Badge>
            </div>
          )}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-white p-1 rounded transition-colors ml-auto">
            <ChevronLeft size={15} />
          </button>
        )}
      </div>
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="p-2 text-gray-600 hover:text-white flex justify-center mt-1 transition-colors">
          <ChevronRight size={15} />
        </button>
      )}

      <nav className="flex-1 p-2 space-y-0.5 mt-1">
        {items.map(it => (
          <Tooltip key={it.id} text={collapsed ? it.label : ""} side="top">
            <button onClick={() => setPage(it.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group relative ${page === it.id ? "bg-violet-600/90 text-white shadow-md shadow-violet-600/20" : "text-gray-400 hover:bg-gray-800/60 hover:text-white"}`}>
              <it.icon size={17} className={page === it.id ? "" : "group-hover:scale-110 transition-transform"} />
              {!collapsed && <span className="flex-1 text-left">{it.label}</span>}
              {!collapsed && it.badge && <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">{it.badge}</span>}
              {collapsed && it.badge && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">{it.badge}</span>}
            </button>
          </Tooltip>
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-3 p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={14} className="text-yellow-400" />
            <span className="text-white text-xs font-semibold">Plano Pro</span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Armazenamento</span>
              <span>{formatBytes(user?.storageUsed || 0)} / {formatBytes(user?.storageLimit || 1)}</span>
            </div>
            <ProgressBar value={user?.storageUsed || 0} max={user?.storageLimit || 1} color="violet" size="sm" />
          </div>
          <p className="text-gray-500 text-xs">{user?.exportsThisMonth || 0} exports este mês</p>
        </div>
      )}

      <div className={`p-3 border-t border-gray-800/80 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{user?.name?.[0] || "U"}</div>
            <div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{user?.name}</p><p className="text-gray-500 text-[11px] truncate">{user?.email}</p></div>
            <button onClick={onLogout} className="text-gray-600 hover:text-red-400 transition-colors p-1"><LogOut size={15} /></button>
          </div>
        ) : (
          <button onClick={onLogout} className="text-gray-600 hover:text-red-400 transition-colors p-1"><LogOut size={15} /></button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────
export const TopBar = ({ user, setPage }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifs, setNotifs] = useState(mockNotifications);
  const [search, setSearch] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const unread = notifs.filter(n => !n.read).length;
  const notifRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn);
  }, []);

  const notifIcon = { success: CheckCircle, warning: AlertTriangle, info: Info, error: XCircle };
  const notifColor = { success: "text-emerald-400", warning: "text-yellow-400", info: "text-blue-400", error: "text-red-400" };

  return (
    <>
      <div className="h-14 bg-gray-950 border-b border-gray-800/80 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2 w-72 border border-gray-800 focus-within:border-violet-500/50 transition-colors">
          <Search size={14} className="text-gray-500 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar projetos, clipes..." className="bg-transparent text-sm text-white outline-none w-full placeholder-gray-600" />
          {search && <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white"><X size={13} /></button>}
        </div>

        <div className="flex items-center gap-1.5">
          <Tooltip text="Atalhos (?)"><button onClick={() => setShowShortcuts(true)} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800"><Keyboard size={17} /></button></Tooltip>
          <button onClick={() => setPage("editor")} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md shadow-violet-600/20"><Plus size={14} />Novo Projeto</button>

          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
              <Bell size={17} />
              {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-lg">{unread}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-white text-sm font-semibold">Notificações</span>
                  <button onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))} className="text-violet-400 text-xs hover:underline">Marcar todas lidas</button>
                </div>
                <div className="max-h-72 overflow-auto divide-y divide-gray-800/50">
                  {notifs.map(n => {
                    const Ic = notifIcon[n.type] || Info;
                    return (
                      <div key={n.id} className={`px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer ${!n.read ? "bg-violet-500/5" : ""}`}>
                        <div className="flex items-start gap-3">
                          <Ic size={15} className={`${notifColor[n.type]} shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium">{n.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{n.message}</p>
                            <p className="text-gray-600 text-xs mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-violet-500 rounded-full mt-1.5 shrink-0" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2 border-t border-gray-800"><button className="text-violet-400 text-xs w-full text-center hover:underline">Ver todas as notificações</button></div>
              </div>
            )}
          </div>

          <div onClick={() => setPage("settings")} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-md">{user?.name?.[0] || "U"}</div>
        </div>
      </div>

      <Modal open={showShortcuts} onClose={() => setShowShortcuts(false)} title="Atalhos de Teclado" size="sm">
        <div className="space-y-2">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-gray-300 text-sm">{s.desc}</span>
              <KbdKey keys={s.keys} />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};


// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export const Dashboard = ({ setPage, user }) => {
  const stats = [
    { label: "Total de Clipes", value: "247", change: "+12% esta semana", icon: Film, gradient: "from-violet-500 to-purple-600" },
    { label: "Exports Hoje", value: "18", change: "+5 vs ontem", icon: Download, gradient: "from-blue-500 to-cyan-600" },
    { label: "Armazenamento", value: formatBytes(user?.storageUsed || 0), change: `/ ${formatBytes(user?.storageLimit || 0)}`, icon: HardDrive, gradient: "from-emerald-500 to-green-600" },
    { label: "Fila de Render", value: "3", change: "em processamento", icon: Server, gradient: "from-orange-500 to-red-500" },
  ];

  const maxExport = Math.max(...mockAnalytics.weeklyExports.map(d => d.count));

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Olá, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Aqui está seu resumo de hoje · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <button onClick={() => setPage("editor")} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 hover:scale-[1.02]">
          <Plus size={16} />Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <Stat key={i} {...s} onClick={() => { }} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Projects */}
        <div className="col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Projetos Recentes</h2>
            <button onClick={() => setPage("projects")} className="text-violet-400 text-xs hover:underline flex items-center gap-1">Ver todos<ChevronRight size={12} /></button>
          </div>
          <div className="space-y-1.5">
            {mockProjects.slice(0, 5).map(p => (
              <div key={p.id} onClick={() => setPage("editor")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/60 cursor-pointer transition-all group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl shrink-0">{p.thumb}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium group-hover:text-violet-400 transition-colors truncate">{p.name}</p>
                  <p className="text-gray-500 text-xs">{p.clipCount} clipes · {formatDate(p.updatedAt)}</p>
                </div>
                <Badge variant={p.status === "active" ? "success" : "default"} size="xs">{p.status === "active" ? "Ativo" : "Arquivado"}</Badge>
                <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Render Queue widget */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">Fila de Render<span className="w-5 h-5 bg-orange-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">3</span></h2>
            <button onClick={() => setPage("render-queue")} className="text-violet-400 text-xs hover:underline">Ver fila</button>
          </div>
          <div className="space-y-2.5 flex-1">
            {mockClips.filter(c => c.status !== "exported").map(c => (
              <div key={c.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-xs font-medium truncate flex-1">{c.name}</span>
                  <Badge variant={c.status === "ready" ? "info" : "warning"} size="xs">{c.status === "ready" ? "Na fila" : "Renderizando"}</Badge>
                </div>
                {c.status === "rendering" && <ProgressBar value={c.renderProgress || 0} color="violet" size="sm" animated />}
                <p className="text-gray-600 text-[11px] mt-1.5">{PRESETS[c.platform]?.icon} {PRESETS[c.platform]?.label} · {formatTime(c.end - c.start)}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("render-queue")} className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-lg transition-colors">Gerenciar Fila</button>
        </div>
      </div>

      {/* Export chart */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Exports da Semana</h2>
            <p className="text-gray-500 text-xs mt-0.5">171 exports nos últimos 7 dias</p>
          </div>
          <button onClick={() => setPage("analytics")} className="flex items-center gap-1 text-violet-400 text-xs hover:underline">Analytics completo<ChevronRight size={12} /></button>
        </div>
        <div className="flex items-end gap-3 h-32">
          {mockAnalytics.weeklyExports.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <span className="text-gray-500 text-xs group-hover:text-white transition-colors">{d.count}</span>
              <div className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg transition-all duration-300 group-hover:from-violet-500 group-hover:to-pink-400 group-hover:opacity-100 opacity-80 relative" style={{ height: `${(d.count / maxExport) * 100}%` }}>
                <div className="absolute inset-x-0 -top-6 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-md">{d.count}</span>
                </div>
              </div>
              <span className="text-gray-600 text-xs">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// EDITOR
// ─────────────────────────────────────────────
// Componente para detecção de URL
const getMediaType = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitch.tv")) return "twitch";
  return "video";
};

export const Editor = ({ setPage }) => {
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ct, setCT] = useState(0);
  const [duration, setDuration] = useState(0); // Inicia em 0 até o vídeo carregar
  const [vol, setVol] = useState(80);
  const [muted, setMuted] = useState(false);
  const [preset, setPreset] = useState("tiktok");
  const [clips, setClips] = useState(mockClips);
  const [selClip, setSelClip] = useState("clp_1");
  const [clipStart, setClipStart] = useState(12);
  const [clipEnd, setClipEnd] = useState(45);
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionText, setCaptionText] = useState("Legenda gerada automaticamente");
  const [captionStyle, setCaptionStyle] = useState(0);
  const [font, setFont] = useState("Oswald");
  const [fontSize, setFontSize] = useState(24);
  const [zoom, setZoom] = useState(100);
  const [tab, setTab] = useState("format");
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [quality, setQuality] = useState("hd");
  const [projectName, setProjName] = useState("Novo Projeto");
  const [saved, setSaved] = useState(true);
  const [genAI, setGenAI] = useState(false);
  const tlRef = useRef(null);
  const videoRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  // Limpa timeout ao desmontar
  useEffect(() => () => clearTimeout(loadTimeoutRef.current), []);

  useEffect(() => {
    let iv;
    if (playing) iv = setInterval(() => setCT(p => p >= clipEnd ? (setPlaying(false), clipStart) : p + 0.1), 100);
    return () => clearInterval(iv);
  }, [playing, clipEnd, clipStart]);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
      if (e.key === "ArrowLeft") setCT(p => Math.max(0, p - 5));
      if (e.key === "ArrowRight") setCT(p => Math.min(duration, p + 5));
      if (e.key === "[") setClipStart(Math.floor(ct));
      if (e.key === "]") setClipEnd(Math.floor(ct));
      if (e.key === "n" || e.key === "N") addClip();
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); setSaved(true); }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") { e.preventDefault(); setShowExportModal(true); }
    };
    if (loaded) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [loaded, ct, duration]);

  // Unificado: Controle de Reprodução e Sincronização
  useEffect(() => {
    let iv;
    if (loaded && playing) {
      const v = videoRef.current;
      if (v) {
        v.currentTime = ct;
        v.play().catch(() => { });
        iv = setInterval(() => {
          setCT(v.currentTime);
          if (v.currentTime >= clipEnd) {
            setPlaying(false);
            v.pause();
            setCT(clipStart);
          }
        }, 100);
      } else {
        // Se não for vídeo HTML5 (ex: YouTube ou Fake), usa timer JS
        iv = setInterval(() => {
          setCT(p => {
            const next = p + 0.1;
            if (next >= clipEnd) {
              setPlaying(false);
              return clipStart;
            }
            return next;
          });
        }, 100);
      }
    }
    return () => {
      if (iv) clearInterval(iv);
      if (videoRef.current) videoRef.current.pause();
    };
  }, [playing, clipStart, clipEnd, loaded]); // Removido 'ct' da dependência para evitar resets constantes

  const handleLoad = () => {
    if (!url.trim()) return;
    setLoading(true);
    loadTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      if (url.includes("demo")) setDuration(324);
    }, 1200);
  };

  const handleExport = () => {
    setShowExportModal(false); setExporting(true); setExportProgress(0);
    const iv = setInterval(() => { setExportProgress(p => { if (p >= 100) { clearInterval(iv); setTimeout(() => setExporting(false), 2000); return 100; } return p + Math.random() * 5 + 2; }); }, 250);
  };

  const addClip = () => {
    const id = "clp_" + gid();
    const nc = { id, projectId: "prj_1", name: `Clipe #${clips.length + 1}`, start: Math.floor(ct), end: Math.min(Math.floor(ct) + 30, duration || 30), platform: preset, status: "ready", captions: showCaptions, quality, exportedAt: null, fileSize: null, renderProgress: 0 };
    setClips([...clips, nc]); setSelClip(id); setClipStart(nc.start); setClipEnd(nc.end); setSaved(false);
  };

  const p_config = PRESETS[preset];

  // ─────────────────────────────────────────────
  // RENDER: Usando Raiz Única Estável
  // ─────────────────────────────────────────────
  // EXPORT MODAL definition
  const exportModal = (
    <Modal open={showExportModal} onClose={() => setShowExportModal(false)} title="Exportar Clipe" size="xl">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">Plataforma de Destino</label>
            <div className="space-y-1.5">
              {Object.entries(PRESETS).map(([k, v]) => (
                <button key={k} onClick={() => setPreset(k)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${preset === k ? "bg-violet-600/20 border border-violet-500/40" : "bg-gray-800 border border-transparent hover:bg-gray-700"}`}>
                  <span className="text-lg">{v.icon}</span>
                  <div className="text-left flex-1">
                    <p className="text-white text-sm font-medium">{v.label}</p>
                    <p className="text-gray-500 text-xs">{v.w}×{v.h} · {v.fps}fps</p>
                  </div>
                  {preset === k && <Check size={14} className="text-violet-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">Qualidade de Export</label>
            <div className="space-y-2">
              {QUALITY_OPTIONS.map(q => (
                <button key={q.id} onClick={() => setQuality(q.id)} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all ${quality === q.id ? "bg-violet-600/20 border border-violet-500/40" : "bg-gray-800 border border-transparent hover:bg-gray-700"}`}>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{q.label}</p>
                    <p className="text-gray-500 text-xs">{q.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{q.size}</span>
                    {q.id === "max" && <Badge variant="premium">PRO</Badge>}
                    {quality === q.id && <Check size={14} className="text-violet-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
            <h4 className="text-white font-medium text-xs mb-2">Resumo do Export</h4>
            {[
              ["Duração", formatTime(Math.max(0, clipEnd - clipStart))],
              ["Resolução", QUALITY_OPTIONS.find(q => q.id === quality)?.label || "—"],
              ["FPS", `${p_config.fps} fps`],
              ["Legendas", showCaptions ? "Sim" : "Não"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-xs"><span className="text-gray-500">{l}</span><span className="text-white">{v}</span></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowExportModal(false)} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors">Cancelar</button>
            <button onClick={handleExport} className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"><Download size={15} />Exportar Agora</button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#060609]" id="editor-root">
      {!loaded ? (
        <div key="load-screen" className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-xl w-full">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30"><Scissors size={34} className="text-white" /></div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Novo Projeto</h1>
              <p className="text-gray-500">Cole a URL do vídeo ou live para começar a editar</p>
            </div>
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 space-y-4 mb-5">
              <div className="flex gap-2">
                <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLoad()} placeholder="Cole a URL..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors" />
                <button onClick={handleLoad} disabled={loading} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2">
                  {loading ? <Loader size={15} className="animate-spin" /> : <Zap size={15} />}Carregar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Games", "Podcast", "Live"].map((title, i) => (
                <button key={i} onClick={() => { setUrl("demo"); handleLoad(); }} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-violet-500/30 rounded-xl p-4 transition-all text-left">
                  <p className="text-white text-sm font-medium">{title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div key="editor-content" className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-11 bg-gray-900/95 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setLoaded(false)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"><ChevronLeft size={15} /></button>
              <input value={projectName} onChange={e => { setProjName(e.target.value); setSaved(false); }} className="text-white text-sm font-medium bg-transparent outline-none border-b border-transparent hover:border-gray-700 focus:border-violet-500 transition-colors px-1 w-52" />
              <span className={`text-[11px] flex items-center gap-1 ${saved ? "text-emerald-400" : "text-yellow-400"}`}>{saved ? <><Check size={10} />Salvo</> : <><AlertCircle size={10} />Não salvo</>}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip text="Salvar (Ctrl+S)"><button onClick={() => setSaved(true)} className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><Save size={13} />Salvar</button></Tooltip>
              <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><RotateCcw size={13} />Desfazer</button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><Share2 size={13} />Compartilhar</button>
              <div className="w-px h-5 bg-gray-800 mx-1" />
              <Tooltip text="Exportar (Ctrl+E)"><button onClick={() => setShowExportModal(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-1.5 rounded-lg font-semibold transition-all shadow-md shadow-emerald-600/20"><Download size={13} />Exportar</button></Tooltip>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left - Clips */}
            <div className="w-52 bg-[#060609] border-r border-gray-800 flex flex-col shrink-0">
              <div className="px-3 py-2.5 border-b border-gray-800 flex items-center justify-between">
                <span className="text-white text-xs font-semibold">Clipes <span className="text-gray-600">({clips.length})</span></span>
                <Tooltip text="Novo clipe (N)"><button onClick={addClip} className="p-1 text-violet-400 hover:bg-gray-800 rounded-lg transition-colors"><Plus size={14} /></button></Tooltip>
              </div>
              <div className="flex-1 overflow-auto p-2 space-y-1">
                {clips.map(c => (
                  <div key={c.id} onClick={() => { setSelClip(c.id); setClipStart(c.start); setClipEnd(c.end); setCT(c.start); setPreset(c.platform); }} className={`p-2.5 rounded-xl cursor-pointer transition-all group ${selClip === c.id ? "bg-violet-600/15 border border-violet-500/30" : "bg-gray-800/20 border border-transparent hover:bg-gray-800/50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-xs font-medium truncate flex-1 mr-1">{c.name}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); dupClip(c.id); }} className="p-0.5 text-gray-500 hover:text-white rounded transition-colors"><Copy size={10} /></button>
                        <button onClick={e => { e.stopPropagation(); deleteClip(c.id); }} className="p-0.5 text-gray-500 hover:text-red-400 rounded transition-colors"><Trash2 size={10} /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-[11px] mb-1.5"><Clock size={9} />{formatTime(c.start)} → {formatTime(c.end)}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{PRESETS[c.platform]?.icon}</span>
                      <Badge variant={c.status === "ready" ? "info" : c.status === "rendering" ? "warning" : "success"} size="xs">{c.status === "ready" ? "Pronto" : c.status === "rendering" ? "Render..." : "Exportado"}</Badge>
                    </div>
                    {c.status === "rendering" && <div className="mt-1.5"><ProgressBar value={c.renderProgress || 0} size="xs" animated /></div>}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-800">
                <button onClick={addClip} className="w-full py-2 bg-gray-800/30 hover:bg-gray-800 text-gray-500 hover:text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-dashed border-gray-700"><Plus size={12} />Adicionar Clipe</button>
              </div>
            </div>

            {/* Center - Preview */}
            <div className="flex-1 flex flex-col bg-[#040407] items-center justify-center p-4 min-w-0">
              {/* Preset tabs */}
              <div className="flex items-center gap-1.5 mb-3 flex-wrap justify-center">
                {Object.entries(PRESETS).map(([k, v]) => (
                  <button key={k} onClick={() => { setPreset(k); setSaved(false); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${preset === k ? "bg-violet-600 text-white shadow-md shadow-violet-600/20" : "bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    <span>{v.icon}</span>{v.label}
                  </button>
                ))}
              </div>

              {/* Video preview */}
              <div className={`${p.ratio === "9:16" ? "aspect-[9/16]" : p.ratio === "1:1" ? "aspect-square" : "aspect-video"} bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800/80 shadow-2xl shadow-black/60`}
                style={{ maxWidth: p.ratio === "9:16" ? "175px" : p.ratio === "1:1" ? "270px" : "430px", maxHeight: "315px", width: "100%" }}>

                {/* Real Video / Iframe / Placeholder */}
                {!url.includes("demo") && getMediaType(url) === "video" ? (
                  <video
                    ref={videoRef}
                    src={url}
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    muted={muted}
                  />
                ) : !url.includes("demo") && getMediaType(url) === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=${muted ? 1 : 0}&controls=0`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    allow="autoplay; encrypted-media"
                  />
                ) : (
                  /* Fake video bg for demo/placeholder */
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900 to-pink-900/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Film size={28} className="text-gray-700 mx-auto mb-2" />
                        <p className="text-gray-600 text-xs">Preview do Vídeo</p>
                        <p className="text-gray-700 text-[11px]">{p.w}×{p.h} · {p.fps}fps</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Caption overlay */}
                {showCaptions && (
                  <div className="absolute bottom-3 left-2 right-2 text-center">
                    <span className="inline-block px-3 py-1.5 rounded-lg font-bold" style={{ background: CAPTION_STYLES[captionStyle].bg, color: CAPTION_STYLES[captionStyle].color, fontFamily: font, fontSize: `${Math.max(8, fontSize * 0.42)}px`, textShadow: CAPTION_STYLES[captionStyle].stroke ? `0 0 10px ${CAPTION_STYLES[captionStyle].color}40,2px 2px 0 rgba(0,0,0,0.9)` : "none", boxShadow: CAPTION_STYLES[captionStyle].shadow }}>{captionText}</span>
                  </div>
                )}
                {zoom > 100 && <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1"><ZoomIn size={9} />{zoom}%</div>}
                {exporting && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Loader size={24} className="text-violet-400 animate-spin mb-2" />
                    <p className="text-white text-xs font-medium">{Math.round(exportProgress)}%</p>
                    <div className="w-24 mt-2"><ProgressBar value={exportProgress} size="sm" animated /></div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <button onClick={() => setCT(Math.max(0, ct - 5))} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"><SkipBack size={15} /></button>
                  <button onClick={() => setCT(clipStart)} className="text-gray-600 hover:text-white text-xs p-1 rounded transition-colors">|◀</button>
                  <button onClick={() => setPlaying(!playing)} className="w-10 h-10 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-violet-500/30 hover:scale-105">
                    {playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                  </button>
                  <button onClick={() => setCT(clipEnd)} className="text-gray-600 hover:text-white text-xs p-1 rounded transition-colors">▶|</button>
                  <button onClick={() => setCT(Math.min(duration, ct + 5))} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"><SkipForward size={15} /></button>
                  <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-800">
                    <button onClick={() => setMuted(!muted)} className="text-gray-500 hover:text-white transition-colors">{muted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
                    <input type="range" min={0} max={100} value={muted ? 0 : vol} onChange={e => { setVol(+e.target.value); setMuted(false); }} className="w-16 h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" />
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-9 text-right font-mono tabular-nums">{formatTime(ct)}</span>
                  <div ref={tlRef} className="flex-1 h-6 relative cursor-pointer group" onClick={handleTlClick}>
                    {/* Track */}
                    <div className="absolute inset-y-0 top-1/2 -translate-y-1/2 h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      {/* Fake waveform */}
                      <div className="absolute inset-0 flex items-center gap-px px-1 opacity-30">
                        {Array.from({ length: 60 }, (_, i) => <div key={i} className="flex-1 bg-gray-500 rounded-sm" style={{ height: `${20 + Math.sin(i * 0.4) * 15 + Math.random() * 20}%` }} />)}
                      </div>
                      {/* Clip range */}
                      <div className="absolute h-full bg-violet-500/20 rounded" style={{ left: `${(clipStart / duration) * 100}%`, width: `${((clipEnd - clipStart) / duration) * 100}%` }} />
                      {/* Progress */}
                      <div className="absolute h-full bg-violet-500/60 rounded" style={{ left: `${(clipStart / duration) * 100}%`, width: `${(((Math.min(ct, clipEnd) - clipStart) / duration) * 100).toFixed(2)}%` }} />
                    </div>
                    {/* In/Out handles */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-violet-400 cursor-ew-resize" style={{ left: `${(clipStart / duration) * 100}%` }}>
                      <div className="absolute top-0 -left-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
                    </div>
                    <div className="absolute top-0 bottom-0 w-0.5 bg-violet-400 cursor-ew-resize" style={{ left: `${(clipEnd / duration) * 100}%` }}>
                      <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
                    </div>
                    {/* Playhead */}
                    <div className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${(ct / duration) * 100}%` }}>
                      <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="w-9 font-mono tabular-nums">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center justify-between mt-1 px-11 text-[11px] text-gray-700">
                  <span>[{formatTime(clipStart)} In</span>
                  <span className="text-violet-500">{formatTime(Math.max(0, clipEnd - clipStart))} selecionado</span>
                  <span>Out {formatTime(clipEnd)}]</span>
                </div>
              </div>
            </div>

            {/* Right - Tools */}
            <div className="w-72 bg-[#060609] border-l border-gray-800 flex flex-col shrink-0">
              <div className="flex border-b border-gray-800">
                {[{ id: "format", icon: Layout, l: "Formato" }, { id: "captions", icon: Type, l: "Texto" }, { id: "audio", icon: Music, l: "Áudio" }, { id: "export", icon: Download, l: "Export" }].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${tab === t.id ? "text-violet-400 border-b-2 border-violet-500" : "text-gray-600 hover:text-gray-300"}`}>
                    <t.icon size={14} />{t.l}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-5">
                {tab === "format" && (<>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Intervalo do Clipe</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800 rounded-lg px-3 py-2"><span className="text-gray-600 text-[11px] block mb-0.5">Início</span><input type="number" value={clipStart} onChange={e => { setClipStart(+e.target.value); setSaved(false); }} className="bg-transparent text-white text-sm w-full outline-none" /></div>
                      <div className="bg-gray-800 rounded-lg px-3 py-2"><span className="text-gray-600 text-[11px] block mb-0.5">Fim</span><input type="number" value={clipEnd} onChange={e => { setClipEnd(+e.target.value); setSaved(false); }} className="bg-transparent text-white text-sm w-full outline-none" /></div>
                    </div>
                    <p className="text-gray-700 text-[11px] mt-1.5 flex items-center gap-1"><Clock size={10} />Duração: {formatTime(Math.max(0, clipEnd - clipStart))}</p>
                  </div>
                  <div><label className="text-gray-400 text-xs font-medium mb-2 block">Zoom ({zoom}%)</label><input type="range" min={100} max={300} value={zoom} onChange={e => setZoom(+e.target.value)} className="w-full h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" /></div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Enquadramento</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 text-violet-400 text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"><Sparkles size={12} />Auto Focus</button>
                      <button className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"><Move size={12} />Manual</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Proporção</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[["9:16", "Vertical"], ["1:1", "Quadrado"], ["16:9", "Horizontal"]].map(([r, l]) => (
                        <button key={r} onClick={() => { setPreset(r === "9:16" ? "tiktok" : r === "1:1" ? "square" : "youtube"); setSaved(false); }} className={`py-2.5 rounded-xl text-xs font-medium transition-all text-center ${p.ratio === r ? "bg-violet-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>{r}<br /><span className="opacity-60 text-[10px]">{l}</span></button>
                      ))}
                    </div>
                  </div>
                </>)}
                {tab === "captions" && (<>
                  <Toggle value={showCaptions} onChange={v => { setShowCaptions(v); setSaved(false); }} label="Legendas ativas" />
                  <div><label className="text-gray-400 text-xs font-medium mb-2 block">Texto</label><textarea value={captionText} onChange={e => { setCaptionText(e.target.value); setSaved(false); }} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none resize-none focus:border-violet-500 transition-colors" /></div>
                  <button onClick={() => { setGenAI(true); setTimeout(() => { setCaptionText("ESSE MOMENTO FOI INACREDITÁVEL 🔥"); setGenAI(false); }, 1500); }} disabled={genAI} className="w-full bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 text-violet-400 text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {genAI ? <><Loader size={13} className="animate-spin" />Gerando...</> : <><Sparkles size={13} />Gerar com IA</>}
                  </button>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Estilo</label>
                    <div className="space-y-1.5">
                      {CAPTION_STYLES.map((s, i) => (
                        <button key={i} onClick={() => { setCaptionStyle(i); setSaved(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${captionStyle === i ? "bg-violet-600/15 border border-violet-500/30" : "bg-gray-800/50 border border-transparent hover:bg-gray-800"}`}>
                          <span className="font-bold text-base" style={{ color: s.color, textShadow: s.stroke ? `0 0 8px ${s.color}60` : "none" }}>Aa</span>
                          <span className="text-gray-300">{s.name}</span>
                          {captionStyle === i && <Check size={12} className="ml-auto text-violet-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-gray-400 text-xs font-medium mb-2 block">Fonte</label><select value={font} onChange={e => { setFont(e.target.value); setSaved(false); }} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-violet-500">{FONTS.map(f => <option key={f}>{f}</option>)}</select></div>
                  <div><label className="text-gray-400 text-xs font-medium mb-2 block">Tamanho ({fontSize}px)</label><input type="range" min={12} max={72} value={fontSize} onChange={e => { setFontSize(+e.target.value); setSaved(false); }} className="w-full h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" /></div>
                </>)}
                {tab === "audio" && (<>
                  <div><label className="text-gray-400 text-xs font-medium mb-2 block">Volume Original ({vol}%)</label><input type="range" min={0} max={100} value={vol} onChange={e => setVol(+e.target.value)} className="w-full h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" /></div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Música de Fundo</label>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 text-xs py-5 rounded-xl transition-colors flex flex-col items-center gap-2"><Music size={18} /><span>Adicionar Trilha Sonora</span><span className="text-gray-600 text-[11px]">MP3, WAV, AAC</span></button>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Efeitos Sonoros</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Swoosh", "Pop", "Ding", "Bass Drop", "Whoosh", "Click"].map(s => <button key={s} className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs py-2 rounded-lg transition-colors">{s}</button>)}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                    <div><p className="text-yellow-400 text-xs font-medium">Aviso de Copyright</p><p className="text-yellow-400/60 text-xs mt-0.5">Músicas podem gerar claims em algumas plataformas.</p></div>
                  </div>
                </>)}
                {tab === "export" && (<>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Plataforma</label>
                    <div className="space-y-1.5">
                      {Object.entries(PRESETS).map(([k, v]) => (
                        <button key={k} onClick={() => { setPreset(k); setSaved(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${preset === k ? "bg-violet-600/20 border border-violet-500/30" : "bg-gray-800/50 border border-transparent hover:bg-gray-800"}`}>
                          <span className="text-base">{v.icon}</span>
                          <div className="text-left flex-1"><p className="text-white text-xs font-medium">{v.label}</p><p className="text-gray-600 text-[11px]">{v.w}×{v.h} · {v.fps}fps</p></div>
                          {preset === k && <Check size={12} className="text-violet-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Qualidade</label>
                    <div className="space-y-1.5">
                      {QUALITY_OPTIONS.map(q => (
                        <button key={q.id} onClick={() => setQuality(q.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${quality === q.id ? "bg-violet-600/20 border border-violet-500/30" : "bg-gray-800/50 border border-transparent hover:bg-gray-800"}`}>
                          <div><p className="text-white text-xs font-medium">{q.label}</p><p className="text-gray-600 text-[11px]">{q.desc}</p></div>
                          <div className="flex items-center gap-1.5">{q.id === "max" && <Badge variant="premium">PRO</Badge>}{quality === q.id && <Check size={11} className="text-violet-400" />}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowExportModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"><Download size={15} />Exportar Clipe</button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"><Layers size={13} />Export em Lote ({clips.length} clipes)</button>
                </>)}
              </div>
            </div>
          </div>

          {exportModal}

          {/* Export progress bar */}
          {exporting && (
            <div className="h-1 bg-gray-900 border-t border-gray-800 shrink-0">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export const ProjectsPage = ({ setPage }) => {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const filtered = useMemo(() => mockProjects.filter(p => (filter === "all" || p.status === filter) && (!search || p.name.toLowerCase().includes(search.toLowerCase()))), [filter, search]);

  const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projetos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{mockProjects.length} projetos · {mockProjects.reduce((a, p) => a + p.clipCount, 0)} clipes no total</p>
        </div>
        <button onClick={() => setPage("editor")} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20"><Plus size={16} />Novo Projeto</button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-3 py-2 flex-1 max-w-xs border border-gray-800 focus-within:border-violet-500/50 transition-colors">
          <Search size={14} className="text-gray-600" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar projetos..." className="bg-transparent text-sm text-white outline-none w-full placeholder-gray-600" />
        </div>
        <div className="flex items-center gap-0.5 bg-gray-800/60 rounded-xl p-1">
          {[["all", "Todos"], ["active", "Ativos"], ["archived", "Arquivados"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === k ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 bg-gray-800/60 rounded-xl p-1">
          <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white"}`}><Grid size={14} /></button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white"}`}><List size={14} /></button>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-xl px-3 py-1.5">
            <span className="text-violet-400 text-xs">{selected.length} selecionados</span>
            <button className="text-red-400 text-xs hover:underline">Deletar</button>
            <button onClick={() => setSelected([])} className="text-gray-500 hover:text-white"><X size={12} /></button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? <EmptyState icon={FolderOpen} title="Nenhum projeto encontrado" description="Tente ajustar seus filtros ou crie um novo projeto" action="Novo Projeto" onAction={() => setPage("editor")} /> : (
        view === "grid" ? (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(pr => (
              <div key={pr.id} className={`bg-gray-900 border rounded-2xl overflow-hidden cursor-pointer transition-all group ${selected.includes(pr.id) ? "border-violet-500 ring-1 ring-violet-500/30" : "border-gray-800 hover:border-violet-500/30"}`}>
                <div onClick={() => setPage("editor")} className="h-28 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-5xl group-hover:scale-[1.02] transition-transform relative">
                  {pr.thumb}
                  <button onClick={e => { e.stopPropagation(); toggleSel(pr.id); }} className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md border transition-all ${selected.includes(pr.id) ? "bg-violet-600 border-violet-500" : "bg-gray-900/60 border-gray-700 opacity-0 group-hover:opacity-100"} flex items-center justify-center`}>
                    {selected.includes(pr.id) && <Check size={10} className="text-white" />}
                  </button>
                </div>
                <div className="p-4" onClick={() => setPage("editor")}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors line-clamp-1">{pr.name}</h3>
                    <Badge variant={pr.status === "active" ? "success" : "default"} size="xs">{pr.status === "active" ? "Ativo" : "Arquivado"}</Badge>
                  </div>
                  <p className="text-gray-600 text-xs truncate mb-2.5">{pr.description}</p>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <span className="flex items-center gap-1"><Film size={10} />{pr.clipCount} clipes</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{formatTime(pr.totalDuration)}</span>
                    <span className="ml-auto">{formatDate(pr.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(pr => (
              <div key={pr.id} onClick={() => setPage("editor")} className={`flex items-center gap-4 bg-gray-900 border rounded-2xl p-4 cursor-pointer transition-all group ${selected.includes(pr.id) ? "border-violet-500" : "border-gray-800 hover:border-violet-500/30"}`}>
                <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0">{pr.thumb}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors truncate">{pr.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{pr.description}</p>
                </div>
                <div className="text-gray-600 text-xs text-right shrink-0">
                  <p>{pr.clipCount} clipes · {formatTime(pr.totalDuration)}</p>
                  <p className="mt-0.5">{formatDate(pr.updatedAt)}</p>
                </div>
                <Badge variant={pr.status === "active" ? "success" : "default"}>{pr.status === "active" ? "Ativo" : "Arquivado"}</Badge>
                <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────
export const AnalyticsPage = () => {
  const maxWeek = Math.max(...mockAnalytics.weeklyExports.map(d => d.count));
  const maxMonth = Math.max(...mockAnalytics.monthlyGrowth.map(m => m.clips));
  const maxHour = Math.max(...mockAnalytics.hourlyExports.map(h => h.c));

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Acompanhe sua produtividade e métricas detalhadas</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          ["Clipes Criados", "247", "+12%", "violet", Film],
          ["Total Exportados", "189", "~45s avg render", "blue", Download],
          ["Horas Economizadas", "~62h", "vs edição manual", "emerald", Clock],
          ["Tempo Médio/Clipe", "2.3 min", "-15% vs mês passado", "orange", Timer],
        ].map(([l, v, d, c, Icon], i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            <p className="text-gray-500 text-xs mb-2">{l}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{v}</p>
            <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><TrendingUp size={11} />{d}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Weekly exports */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Exports por Dia</h2>
          <p className="text-gray-600 text-xs mb-5">Última semana · 171 total</p>
          <div className="flex items-end gap-2 h-36">
            {mockAnalytics.weeklyExports.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-gray-600 text-xs group-hover:text-white transition-colors">{d.count}</span>
                <div className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md transition-all opacity-75 group-hover:opacity-100" style={{ height: `${(d.count / maxWeek) * 100}%` }} />
                <span className="text-gray-600 text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Por Plataforma</h2>
          <p className="text-gray-600 text-xs mb-5">Distribuição de exports por destino</p>
          <div className="space-y-3.5">
            {mockAnalytics.platformBreakdown.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm flex items-center gap-2">{PRESETS[p.platform.toLowerCase()]?.icon || "📊"}{p.platform}</span>
                  <span className="text-gray-400 text-xs">{p.count} <span className="text-gray-600">({p.pct}%)</span></span>
                </div>
                <ProgressBar value={p.pct} color={["violet", "blue", "emerald", "orange", "violet"][i]} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Monthly growth */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Crescimento Mensal</h2>
          <p className="text-gray-600 text-xs mb-5">Clipes criados por mês</p>
          <div className="flex items-end gap-3 h-36">
            {mockAnalytics.monthlyGrowth.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-gray-600 text-xs group-hover:text-white transition-colors">{m.clips}</span>
                <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all opacity-75 group-hover:opacity-100" style={{ height: `${(m.clips / maxMonth) * 100}%` }} />
                <span className="text-gray-600 text-xs">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly pattern */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Padrão por Horário</h2>
          <p className="text-gray-600 text-xs mb-5">Quando você mais exporta</p>
          <div className="flex items-end gap-1.5 h-36">
            {mockAnalytics.hourlyExports.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm transition-all opacity-60 group-hover:opacity-100" style={{ height: `${(h.c / maxHour) * 100}%` }} />
                <span className="text-gray-700 text-[10px]">{h.h}h</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 bg-blue-500/8 border border-blue-500/15 rounded-lg">
            <p className="text-blue-400 text-xs font-medium">Pico às 18h–21h</p>
            <p className="text-gray-600 text-[11px] mt-0.5">35 exports em média no período noturno</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// RENDER QUEUE
// ─────────────────────────────────────────────
export const RenderQueuePage = () => {
  const [queue, setQueue] = useState(mockClips);
  const rendering = queue.filter(c => c.status === "rendering").length;
  const waiting = queue.filter(c => c.status === "ready").length;
  const done = queue.filter(c => c.status === "exported").length;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fila de Renderização</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie seus exports em andamento</p>
        </div>
        <div className="flex items-center gap-2">
          {rendering > 0 && <Badge variant="warning">{rendering} renderizando</Badge>}
          {waiting > 0 && <Badge variant="info">{waiting} na fila</Badge>}
          {done > 0 && <Badge variant="success">{done} concluídos</Badge>}
        </div>
      </div>

      {/* Progress summary */}
      {rendering > 0 && (
        <div className="bg-violet-600/8 border border-violet-500/15 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center"><Cpu size={18} className="text-violet-400" /></div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Renderização em andamento</p>
            <p className="text-gray-500 text-xs mt-0.5">1 de {queue.length} clipes sendo processado · ETA ~2 min</p>
            <div className="mt-2 max-w-sm"><ProgressBar value={65} color="violet" size="sm" animated /></div>
          </div>
          <button className="text-gray-500 hover:text-red-400 text-xs border border-gray-700 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-colors">Pausar</button>
        </div>
      )}

      <div className="space-y-3">
        {queue.map((c, i) => (
          <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-xl shrink-0">{PRESETS[c.platform]?.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium text-sm">{c.name}</p>
                  <Badge variant={c.status === "ready" ? "info" : c.status === "rendering" ? "warning" : "success"} size="xs">
                    {c.status === "ready" ? "Na Fila" : c.status === "rendering" ? "Renderizando" : "Concluído"}
                  </Badge>
                </div>
                <p className="text-gray-600 text-xs">{PRESETS[c.platform]?.label} · {PRESETS[c.platform]?.w}×{PRESETS[c.platform]?.h} · {formatTime(c.end - c.start)} · {c.quality?.toUpperCase()}</p>
                {c.status === "rendering" && (
                  <div className="mt-2 max-w-xs">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1"><span>{c.renderProgress}%</span><span>~{Math.round((100 - c.renderProgress) / 10)}s restantes</span></div>
                    <ProgressBar value={c.renderProgress || 0} color="violet" size="sm" animated />
                  </div>
                )}
                {c.status === "exported" && c.fileSize && <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1"><CheckCircle size={10} />Exportado · {formatBytes(c.fileSize)} · {formatDate(c.exportedAt)}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.status === "exported" && <button className="flex items-center gap-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs transition-colors"><Download size={12} />Download</button>}
                {c.status === "ready" && <button className="flex items-center gap-1.5 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs transition-colors"><Play size={12} />Iniciar</button>}
                <button onClick={() => setQueue(q => q.filter(x => x.id !== c.id))} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
export const SettingsPage = ({ user, setPage }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [prefs, setPrefs] = useState({ autoSave: true, aiCaptions: true, emailNotifs: false, smartFrame: true, darkMode: true, renderNotifs: true });
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "profile", icon: User, label: "Perfil" },
    { id: "preferences", icon: Sliders, label: "Preferências" },
    { id: "billing", icon: CreditCard, label: "Plano & Cobrança" },
    { id: "security", icon: Shield, label: "Segurança" },
    { id: "storage", icon: HardDrive, label: "Armazenamento" },
    { id: "api", icon: Key, label: "API & Integrações" },
  ];

  const setPref = (k, v) => { setPrefs(p => ({ ...p, [k]: v })); setSaved(false); };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="flex-1 overflow-auto p-6">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-6">Configurações</h1>
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-0.5">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === id ? "bg-violet-600/15 text-violet-400 border border-violet-500/20" : "text-gray-400 hover:bg-gray-800/60 hover:text-white"}`}><Icon size={15} />{label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl space-y-4">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-5">Informações do Perfil</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">{user?.name?.[0]}</div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full flex items-center justify-center transition-colors"><Camera size={11} className="text-white" /></button>
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  <button className="text-violet-400 text-xs hover:underline mt-1">Alterar foto</button>
                </div>
              </div>
              <div className="space-y-3">
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Nome completo</label><input defaultValue={user?.name} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">E-mail</label><input defaultValue={user?.email} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Bio</label><textarea rows={3} placeholder="Conte um pouco sobre você..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none focus:border-violet-500 transition-colors placeholder-gray-600" /></div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={handleSave} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">Salvar Alterações</button>
                {saved && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={13} />Salvo com sucesso!</span>}
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (<>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Exportação Padrão</h3>
              <div className="space-y-2">
                {[["Formato", "MP4 (H.264)"], ["Resolução", "1080p HD"], ["FPS", "30 fps"], ["Preset", "TikTok (9:16)"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300 text-sm">{l}</span>
                    <button className="text-gray-400 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">{v}<ChevronDown size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Funcionalidades</h3>
              <div className="space-y-4">
                <Toggle value={prefs.autoSave} onChange={v => setPref("autoSave", v)} label="Auto-salvar projetos" sublabel="Salvar a cada 30 segundos" />
                <Toggle value={prefs.aiCaptions} onChange={v => setPref("aiCaptions", v)} label="Legendas automáticas com IA" sublabel="Geração em português" />
                <Toggle value={prefs.emailNotifs} onChange={v => setPref("emailNotifs", v)} label="Notificações por e-mail" sublabel="Receba alertas de exports" />
                <Toggle value={prefs.smartFrame} onChange={v => setPref("smartFrame", v)} label="Enquadramento inteligente" sublabel="Auto-detectar rostos e objetos" />
                <Toggle value={prefs.renderNotifs} onChange={v => setPref("renderNotifs", v)} label="Notificar quando render completar" />
              </div>
            </div>
          </>)}

          {/* Billing */}
          {activeTab === "billing" && (<>
            <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/30 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1"><Crown size={18} className="text-yellow-400" /><span className="text-white font-semibold text-lg">Plano Profissional</span></div>
                  <p className="text-gray-400 text-sm">Renovação em 15 de Março, 2026</p>
                  <p className="text-gray-500 text-xs mt-1">{user?.exportsThisMonth || 0} exports realizados este mês</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">R$&nbsp;49</span>
                  <span className="text-gray-400 text-sm">/mês</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <div key={plan.id} className={`bg-gray-900 border rounded-2xl p-5 relative transition-all ${plan.popular ? "border-violet-500 shadow-lg shadow-violet-500/10" : "border-gray-800"}`}>
                  {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"><Badge variant={plan.popular ? "violet" : "success"}>{plan.badge}</Badge></div>}
                  <h4 className="text-white font-semibold mb-1">{plan.name}</h4>
                  <p className="text-2xl font-bold text-white mb-4">{plan.price}<span className="text-sm text-gray-500 font-normal">{plan.period}</span></p>
                  <div className="space-y-2 mb-5">{plan.features.map((f, i) => <div key={i} className="flex items-center gap-2 text-xs"><Check size={12} className="text-emerald-400 shrink-0" /><span className="text-gray-400">{f}</span></div>)}</div>
                  <button className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${plan.popular ? "bg-violet-600 hover:bg-violet-500 text-white" : user?.plan === plan.id ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}>{user?.plan === plan.id ? "Plano Atual" : plan.id === "free" ? "Downgrade" : "Upgrade"}</button>
                </div>
              ))}
            </div>
          </>)}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-semibold">Alterar Senha</h3>
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Senha atual</label><input type="password" placeholder="••••••••" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Nova senha</label><input type="password" placeholder="Mínimo 8 caracteres" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Confirmar nova senha</label><input type="password" placeholder="••••••••" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                <button className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Alterar Senha</button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-semibold">Autenticação em 2 Fatores</h3>
                <Toggle value={false} onChange={() => { }} label="Autenticação 2FA" sublabel="Adiciona uma camada extra de segurança" />
                <div className="p-3 bg-blue-500/8 border border-blue-500/15 rounded-xl">
                  <p className="text-blue-400 text-xs font-medium flex items-center gap-1.5"><Info size={12} />Recomendado</p>
                  <p className="text-gray-500 text-xs mt-1">2FA protege sua conta mesmo se sua senha for comprometida.</p>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Sessões Ativas</h3>
                {[["Chrome · macOS", "São Paulo, BR", "Agora"], ["Firefox · Windows", "Rio de Janeiro, BR", "2 horas atrás"]].map(([d, l, t]) => (
                  <div key={d} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                    <div><p className="text-white text-sm">{d}</p><p className="text-gray-500 text-xs">{l} · {t}</p></div>
                    <button className="text-red-400 text-xs hover:underline">Encerrar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage */}
          {activeTab === "storage" && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
              <h3 className="text-white font-semibold">Armazenamento</h3>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">{formatBytes(user?.storageUsed || 0)} utilizados</span><span className="text-gray-500">de {formatBytes(user?.storageLimit || 0)}</span></div>
                <ProgressBar value={user?.storageUsed || 0} max={user?.storageLimit || 1} color="violet" size="lg" />
              </div>
              <div className="space-y-3">
                {[["Projetos", "2.8 GB", 56, "violet"], ["Exports", "1.1 GB", 22, "blue"], ["Cache", "0.3 GB", 6, "orange"]].map(([l, s, pct, c]) => (
                  <div key={l}>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5"><span className="text-gray-300">{l}</span><span>{s}</span></div>
                    <ProgressBar value={pct} color={c} size="sm" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
                <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors">Limpar Cache</button>
                <button className="text-violet-400 text-sm hover:underline">Gerenciar Arquivos</button>
              </div>
            </div>
          )}

          {/* API */}
          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Chave de API</h3>
                <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3 mb-3">
                  <Key size={15} className="text-gray-500" />
                  <code className="text-gray-400 text-sm flex-1 font-mono">sk_live_••••••••••••••••••••••••••••</code>
                  <button className="text-violet-400 text-xs hover:underline px-2">Copiar</button>
                  <button className="text-gray-500 hover:text-white text-xs px-2"><RefreshCw size={13} /></button>
                </div>
                <p className="text-gray-600 text-xs">Use esta chave para integrar com a API do ClipStudio. Nunca compartilhe publicamente.</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Webhooks</h3>
                <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3 mb-3">
                  <Globe size={15} className="text-gray-500" />
                  <input placeholder="https://seu-servidor.com/webhook" className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
                  <button className="text-violet-400 text-xs hover:underline">Salvar</button>
                </div>
                <div className="space-y-2">
                  {[["export.completed", "Acionado quando export termina"], ["render.started", "Acionado quando render inicia"]].map(([k, d]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-t border-gray-800">
                      <div><code className="text-violet-400 text-xs">{k}</code><p className="text-gray-600 text-xs mt-0.5">{d}</p></div>
                      <Toggle value={true} onChange={() => { }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PRICING PAGE
// ─────────────────────────────────────────────
export const PricingPage = ({ setPage }) => {
  const [billing, setBilling] = useState("monthly");
  const discount = billing === "annual" ? 0.8 : 1;

  return (
    <div className="flex-1 overflow-auto p-8 flex flex-col items-center">
      <div className="text-center mb-8 max-w-lg">
        <Badge variant="violet" size="sm">Planos e Preços</Badge>
        <h1 className="text-4xl font-bold text-white mt-3 tracking-tight">Escolha seu Plano</h1>
        <p className="text-gray-400 mt-3 text-lg leading-relaxed">Desbloqueie todo o potencial do ClipStudio e acelere sua produção de conteúdo</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setBilling("monthly")} className={`text-sm font-medium transition-colors ${billing === "monthly" ? "text-white" : "text-gray-500"}`}>Mensal</button>
          <button onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")} className={`w-12 h-6 rounded-full transition-colors relative ${billing === "annual" ? "bg-violet-600" : "bg-gray-700"}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${billing === "annual" ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
          <button onClick={() => setBilling("annual")} className={`text-sm font-medium transition-colors ${billing === "annual" ? "text-white" : "text-gray-500"}`}>Anual</button>
          {billing === "annual" && <Badge variant="success">-20%</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 max-w-4xl w-full">
        {PLANS.map(plan => {
          const price = plan.price === "R$ 0" ? "R$ 0" : billing === "annual" ? `R$ ${Math.round(parseInt(plan.price.replace(/\D/g, "")) * discount)}` : plan.price;
          return (
            <div key={plan.id} className={`bg-gray-900 border rounded-2xl p-6 relative flex flex-col transition-all hover:scale-[1.01] ${plan.popular ? "border-violet-500 shadow-2xl shadow-violet-500/10" : "border-gray-800"}`}>
              {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"><Badge variant={plan.popular ? "violet" : "success"}>{plan.badge}</Badge></div>}
              <div className="mb-5">
                <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                <p className="text-4xl font-bold text-white mt-2 tracking-tight">{price}<span className="text-base text-gray-500 font-normal">/mês</span></p>
                {billing === "annual" && plan.price !== "R$ 0" && <p className="text-gray-600 text-xs mt-1">Cobrança anual</p>}
              </div>
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((f, i) => <div key={i} className="flex items-center gap-2.5"><div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0"><Check size={10} className="text-emerald-400" /></div><span className="text-gray-300 text-sm">{f}</span></div>)}
              </div>
              <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}>{plan.id === "free" ? "Começar Grátis" : "Assinar Agora"}</button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl w-full mt-12">
        <h2 className="text-white font-semibold text-xl text-center mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {[
            ["Posso cancelar a qualquer momento?", "Sim, você pode cancelar sua assinatura a qualquer momento sem multas. Você continuará tendo acesso até o fim do período pago."],
            ["Qual é a diferença entre HD e 4K?", "HD exporta em 1920×1080 com ~45MB por clipe. 4K exporta em 3840×2160 com qualidade máxima, disponível apenas no plano Pro."],
            ["As legendas IA funcionam em português?", "Sim! Nossa IA foi treinada especialmente para português brasileiro, com alta precisão em gírias e termos regionais."],
          ].map(([q, a], i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-white text-sm font-medium mb-2">{q}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setPage("dashboard")} className="mt-8 text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center gap-1"><ChevronLeft size={15} />Voltar ao Dashboard</button>
    </div>
  );
};

// ─────────────────────────────────────────────
// END OF PLATFORM COMPONENTS
// ─────────────────────────────────────────────
