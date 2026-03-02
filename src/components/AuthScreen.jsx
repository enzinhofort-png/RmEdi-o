// src/components/AuthScreen.jsx
// ─────────────────────────────────────────────
// Tela de autenticação conectada ao Supabase
// Substitui o AuthScreen do clipstudio-platform.jsx
// ─────────────────────────────────────────────

import { useState } from "react";
import {
  Scissors, Mail, Lock, UserPlus, LogIn, Loader, Globe,
  Eye, EyeOff, Check, AlertCircle, CheckCircle, ChevronLeft,
  Sparkles, Zap, Layers, Cloud,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function AuthScreen() {
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, signInAsGuest, resetPassword, error, setError, loading } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register" | "recovery"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [registerDone, setRegisterDone] = useState(false);

  const displayError = localError || error;

  const validate = () => {
    if (!email) { setLocalError("Informe seu e-mail."); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError("E-mail inválido."); return false; }
    if (mode !== "recovery" && !password) { setLocalError("Informe sua senha."); return false; }
    if (mode === "register" && password.length < 6) { setLocalError("Senha deve ter pelo menos 6 caracteres."); return false; }
    if (mode === "register" && !name.trim()) { setLocalError("Informe seu nome."); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setLocalError("");
    setError(null);
    if (!validate()) return;

    if (mode === "recovery") {
      const r = await resetPassword({ email });
      if (r.success) setRecoverySent(true);
      return;
    }
    if (mode === "login") {
      await signIn({ email, password });
      return;
    }
    if (mode === "register") {
      await signUp({ email, password, name });
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setLocalError("");
    setError(null);
    setRecoverySent(false);
  };

  // ── Recuperação enviada ──
  if (recoverySent) return (
    <Wrapper>
      <PanelRight>
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">E-mail enviado!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Verifique sua caixa de entrada para redefinir sua senha.
          </p>
          <button onClick={() => switchMode("login")} className="text-violet-400 text-sm hover:underline">
            ← Voltar ao login
          </button>
        </div>
      </PanelRight>
    </Wrapper>
  );

  // ── Recuperação de senha ──
  if (mode === "recovery") return (
    <Wrapper>
      <PanelRight>
        <button onClick={() => switchMode("login")} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft size={15} />Voltar
        </button>
        <h2 className="text-2xl font-bold text-white mb-1">Recuperar senha</h2>
        <p className="text-gray-400 text-sm mb-6">Enviaremos as instruções para seu e-mail.</p>
        <ErrorBox msg={displayError} />
        <Input icon={<Mail size={15} />} type="email" placeholder="Seu e-mail" value={email} onChange={setEmail} onEnter={handleSubmit} />
        <SubmitBtn loading={loading} onClick={handleSubmit} label="Enviar link de recuperação" />
      </PanelRight>
    </Wrapper>
  );

  // ── Login / Registro ──
  return (
    <Wrapper>
      <PanelRight>
        <h2 className="text-2xl font-bold text-white mb-1">
          {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {mode === "login" ? "Entre na sua conta para continuar" : "Comece a criar clipes profissionais"}
        </p>

        <ErrorBox msg={displayError} />

        <div className="space-y-3">
          {mode === "register" && (
            <Input placeholder="Seu nome completo" value={name} onChange={setName} onEnter={handleSubmit} />
          )}
          <Input icon={<Mail size={15} />} type="email" placeholder="Seu e-mail" value={email} onChange={setEmail} onEnter={handleSubmit} />
          <div className="relative">
            <Input
              icon={<Lock size={15} />}
              type={showPass ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={setPassword}
              onEnter={handleSubmit}
              suffix={
                <button type="button" onClick={() => setShowPass(s => !s)} className="text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>
        </div>

        {mode === "login" && (
          <button onClick={() => switchMode("recovery")} className="text-violet-400 text-xs mt-2 block hover:underline">
            Esqueceu a senha?
          </button>
        )}

        <SubmitBtn
          loading={loading}
          onClick={handleSubmit}
          label={mode === "login" ? "Entrar" : "Criar Conta"}
          icon={mode === "register" ? <UserPlus size={15} /> : null}
        />

        <Divider />

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          <OAuthBtn onClick={signInWithGoogle} label="Google" icon={<span className="font-bold text-base" style={{ fontFamily: "serif" }}>G</span>} />
          <OAuthBtn onClick={signInWithGitHub} label="GitHub" icon={<Globe size={14} />} />
        </div>

        <button
          onClick={signInAsGuest}
          className="w-full mt-4 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-400 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={15} /> Entrar como Convidado (Teste)
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
          <button onClick={() => switchMode(mode === "login" ? "register" : "login")} className="text-violet-400 hover:underline font-medium">
            {mode === "login" ? "Criar conta grátis" : "Fazer login"}
          </button>
        </p>
      </PanelRight>
    </Wrapper>
  );
}

// ── Sub-componentes internos ──────────────────

function Wrapper({ children }) {
  return (
    <div className="h-screen w-screen bg-gray-950 flex overflow-hidden">
      <PanelLeft />
      {children}
    </div>
  );
}

function PanelLeft() {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0f0520] via-[#12063a] to-[#0a0a1a]">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-pink-600/15 blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="relative z-10 flex flex-col justify-center p-16 max-w-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30"><Scissors size={20} className="text-white" /></div>
          <span className="text-2xl font-bold text-white tracking-tight">ClipStudio</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/20">PRO</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
          Crie clipes<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">profissionais</span><br />
          em minutos
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">A plataforma mais rápida para clipadores. Exporte para TikTok, Reels, Shorts e YouTube com IA.</p>
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
      </div>
    </div>
  );
}

function PanelRight({ children }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

function Input({ icon, type = "text", placeholder, value, onChange, onEnter, suffix }) {
  return (
    <div className="relative flex items-center">
      {icon && <span className="absolute left-4 text-gray-500">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
        className={`w-full bg-gray-800/80 border border-gray-700 rounded-xl py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600 ${icon ? "pl-11" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}`}
      />
      {suffix && <span className="absolute right-4">{suffix}</span>}
    </div>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-red-400 text-sm">
      <AlertCircle size={15} className="shrink-0" />{msg}
    </div>
  );
}

function SubmitBtn({ loading, onClick, label, icon }) {
  return (
    <button onClick={onClick} disabled={loading} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-all mt-5 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
      {loading ? <><Loader size={15} className="animate-spin" />Processando...</> : <>{icon}{label}</>}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-800" />
      <span className="text-gray-600 text-xs">ou continue com</span>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

function OAuthBtn({ onClick, label, icon }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-2.5 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm transition-colors border border-gray-700">
      {icon}{label}
    </button>
  );
}
