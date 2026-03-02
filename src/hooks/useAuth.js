// src/hooks/useAuth.js
// ─────────────────────────────────────────────
// Hook centralizado de autenticação
// Gerencia: login, registro, OAuth, logout,
// recuperação de senha, sessão persistida
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { supabase, getErrorMessage } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);     // auth.User do Supabase
  const [profile, setProfile] = useState(null);     // linha em public.profiles
  const [loading, setLoading] = useState(true);     // carregando sessão inicial
  const [error, setError] = useState(null);

  // ── Carrega o perfil completo da tabela profiles ──
  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao carregar profile:", error);
      return null;
    }
    return data;
  }, []);

  // ── Inicialização & Sincronização de Sessão ──
  useEffect(() => {
    let mounted = true;
    let authListener = null;

    const initAuth = async () => {
      // Supabase v2: onAuthStateChange dispara INITIAL_SESSION imediatamente
      // se houver uma sessão persistida. Não precisamos de getSession separado.
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          if (session?.user) {
            setUser(session.user);
            const p = await loadProfile(session.user.id);
            if (mounted) {
              setProfile(p);
              setLoading(false);
            }
          } else {
            // Se não houver sessão do Supabase, tenta o modo Demo
            const savedDemo = localStorage.getItem("clipstudio_demo_user");
            if (savedDemo) {
              try {
                const p = JSON.parse(savedDemo);
                setUser({ id: p.id, email: p.email });
                setProfile(p);
              } catch (e) {
                localStorage.removeItem("clipstudio_demo_user");
                setUser(null);
                setProfile(null);
              }
            } else {
              setUser(null);
              setProfile(null);
            }
            setLoading(false);
          }

          if (event === "SIGNED_IN") setError(null);
        }
      );

      authListener = data.subscription;
    };

    initAuth();

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, [loadProfile]);

  // ── Login com e-mail e senha ──
  const signIn = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Registro com e-mail, senha e nome ──
  const signUp = useCallback(async ({ email, password, name }) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          // URL para redirecionar após confirmação de e-mail
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Login com Google ──
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) setError(getErrorMessage(error));
  }, []);

  // ── Login com GitHub ──
  const signInWithGitHub = useCallback(async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(getErrorMessage(error));
  }, []);

  // ── Recuperação de senha ──
  const resetPassword = useCallback(async ({ email }) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Nova senha (após clicar no link do e-mail) ──
  const updatePassword = useCallback(async ({ newPassword }) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(getErrorMessage(error));
      return { success: false };
    }
    return { success: true };
  }, []);

  // ── Logout ──
  const signOut = useCallback(async () => {
    localStorage.removeItem("clipstudio_demo_user");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  // ── Login de Teste (Bypass) ──
  const signInAsGuest = useCallback(() => {
    const guestProfile = {
      id: "guest_user",
      name: "Usuário de Teste",
      email: "teste@clipstudio.com",
      plan: "pro",
      storage_used: 4.2 * 1073741824,
      storage_limit: 50 * 1073741824,
      exports_month: 47,
      created_at: new Date().toISOString()
    };
    localStorage.setItem("clipstudio_demo_user", JSON.stringify(guestProfile));
    setUser({ id: "guest_user", email: "teste@clipstudio.com" });
    setProfile(guestProfile);
    return { success: true };
  }, []);

  // ── Atualizar perfil (nome, avatar, etc.) ──
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) {
      setError(getErrorMessage(error));
      return { success: false };
    }
    // Recarrega profile local
    const fresh = await loadProfile(user.id);
    setProfile(fresh);
    return { success: true };
  }, [user, loadProfile]);

  return {
    user,
    profile,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
    signOut,
    updateProfile,
    signInAsGuest,
  };
}
