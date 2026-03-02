export const PRESETS = {
  tiktok: { label: "TikTok", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "📱", color: "#FF0050" },
  reels: { label: "Reels", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "📸", color: "#E1306C" },
  shorts: { label: "Shorts", ratio: "9:16", w: 1080, h: 1920, fps: 30, bitrate: "8M", icon: "▶️", color: "#FF0000" },
  youtube: { label: "YouTube", ratio: "16:9", w: 1920, h: 1080, fps: 60, bitrate: "16M", icon: "🎬", color: "#FF0000" },
  square: { label: "Square", ratio: "1:1", w: 1080, h: 1080, fps: 30, bitrate: "8M", icon: "⬜", color: "#667eea" },
};

export const FONTS = ["Montserrat", "Oswald", "Bebas Neue", "Poppins", "Roboto Condensed", "Impact", "Inter", "Arial Black"];

export const CAPTION_STYLES = [
  { id: "neon", name: "Neon Glow", bg: "transparent", color: "#00ff88", stroke: true, shadow: "0 0 20px #00ff8860" },
  { id: "classic", name: "Clássico Branco", bg: "rgba(0,0,0,0.75)", color: "#ffffff", stroke: false, shadow: "none" },
  { id: "yellow", name: "Amarelo Bold", bg: "transparent", color: "#ffd700", stroke: true, shadow: "0 0 20px #ffd70060" },
  { id: "minimal", name: "Minimalista", bg: "rgba(255,255,255,0.92)", color: "#111111", stroke: false, shadow: "none" },
  { id: "fire", name: "Vermelho Fogo", bg: "transparent", color: "#ff4444", stroke: true, shadow: "0 0 20px #ff444460" },
  { id: "gradient", name: "Gradiente", bg: "linear-gradient(135deg,#667eea,#764ba2)", color: "#ffffff", stroke: false, shadow: "none" },
];

export const PLANS = [
  { id: "free", name: "Gratuito", price: "R$ 0", period: "/mês", badge: "", features: ["5 exports/mês", "720p máximo", "1 GB armazenamento", "Marca d'água", "Suporte básico"], color: "gray", popular: false },
  { id: "pro", name: "Profissional", price: "R$ 49", period: "/mês", badge: "Mais popular", features: ["Exports ilimitados", "1080p + 4K", "50 GB armazenamento", "Sem marca d'água", "Legendas IA", "Analytics avançado", "Suporte prioritário"], color: "violet", popular: true },
  { id: "team", name: "Equipe", price: "R$ 149", period: "/mês", badge: "Melhor custo-benefício", features: ["Tudo do Pro", "Até 10 membros", "200 GB compartilhado", "API completa", "Workspace colaborativo", "Painel de gerentes", "SLA garantido"], color: "emerald", popular: false },
];

export const QUALITY_OPTIONS = [
  { id: "draft", label: "Rascunho", desc: "480p · Ultra-rápido", resolution: "854×480", size: "~8 MB", color: "gray" },
  { id: "hd", label: "HD", desc: "1080p · Recomendado", resolution: "1920×1080", size: "~45 MB", color: "violet" },
  { id: "max", label: "4K Max", desc: "2160p · Premium", resolution: "3840×2160", size: "~120 MB", color: "emerald" },
];

export const SHORTCUTS = [
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
