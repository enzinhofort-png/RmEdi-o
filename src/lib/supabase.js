// src/lib/supabase.js
// ─────────────────────────────────────────────
// Cliente Supabase centralizado
// Instale: npm install @supabase/supabase-js
// ─────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "⚠️  Variáveis de ambiente Supabase não encontradas.\n" +
    "Crie um arquivo .env na raiz do projeto com:\n" +
    "VITE_SUPABASE_URL=https://xxxx.supabase.co\n" +
    "VITE_SUPABASE_ANON_KEY=eyJ..."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persiste sessão no localStorage automaticamente
    persistSession: true,
    autoRefreshToken: true,
    // Redireciona para a URL configurada após OAuth
    detectSessionInUrl: true,
  },
});

// Helper para extrair mensagem de erro da Supabase
export function getErrorMessage(error) {
  if (!error) return null;
  const map = {
    "Invalid login credentials":           "E-mail ou senha incorretos.",
    "Email not confirmed":                  "Confirme seu e-mail antes de entrar.",
    "User already registered":              "Este e-mail já está cadastrado.",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
    "Email rate limit exceeded":            "Muitas tentativas. Tente novamente em alguns minutos.",
  };
  return map[error.message] || error.message || "Ocorreu um erro inesperado.";
}
