import React, { useState } from 'react';
import {
    User, Sliders, CreditCard, Shield, HardDrive, Key,
    Camera, CheckCircle, ChevronDown, Info, Crown, Check, RefreshCw, Globe
} from 'lucide-react';
import { Toggle } from './ui/Toggle';
import { ProgressBar } from './ui/ProgressBar';
import { Badge } from './ui/Badge';
import { formatBytes } from '../lib/utils';
import { PLANS } from '../lib/constants';

export const SettingsPage = ({ user, setPage, updateProfile }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [prefs, setPrefs] = useState({ autoSave: true, aiCaptions: true, emailNotifs: false, smartFrame: true, darkMode: true, renderNotifs: true });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile state initialized from props
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [bio, setBio] = useState(user?.bio || "");

    const tabs = [
        { id: "profile", icon: User, label: "Perfil" },
        { id: "preferences", icon: Sliders, label: "Preferências" },
        { id: "billing", icon: CreditCard, label: "Plano & Cobrança" },
        { id: "security", icon: Shield, label: "Segurança" },
        { id: "storage", icon: HardDrive, label: "Armazenamento" },
        { id: "api", icon: Key, label: "API & Integrações" },
    ];

    const setPref = (k, v) => { setPrefs(p => ({ ...p, [k]: v })); setSaved(false); };

    const handleSave = async () => {
        if (!user || user.id === "guest_user") {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            return;
        }

        setSaving(true);
        try {
            const success = await updateProfile?.({
                name,
                email, // Note: email might be read-only in some Supabase configs if linked to auth.users
                bio
            });
            if (success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Erro ao salvar perfil:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto p-6">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-6">Configurações</h1>
            <div className="flex gap-6">
                <div className="w-48 shrink-0 space-y-0.5">
                    {tabs.map(({ id, icon: Icon, label }) => (
                        <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === id ? "bg-violet-600/15 text-violet-400 border border-violet-500/20" : "text-gray-400 hover:bg-gray-800/60 hover:text-white"}`}><Icon size={15} />{label}</button>
                    ))}
                </div>

                <div className="flex-1 max-w-2xl space-y-4">
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
                                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Nome completo</label><input value={name} onChange={e => { setName(e.target.value); setSaved(false); }} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                                <div><label className="text-gray-400 text-xs mb-1 block font-medium">E-mail</label><input value={email} onChange={e => { setEmail(e.target.value); setSaved(false); }} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-violet-500 transition-colors" /></div>
                                <div><label className="text-gray-400 text-xs mb-1 block font-medium">Bio</label><textarea rows={3} value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }} placeholder="Conte um pouco sobre você..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none focus:border-violet-500 transition-colors placeholder-gray-600" /></div>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
                                    {saving && <RefreshCw size={13} className="animate-spin" />}
                                    {saving ? "Salvando..." : "Salvar Alterações"}
                                </button>
                                {saved && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={13} />Salvo com sucesso!</span>}
                            </div>
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <>
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
                        </>
                    )}

                    {activeTab === "billing" && (
                        <>
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
                        </>
                    )}

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
                        </div>
                    )}

                    {activeTab === "storage" && (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
                            <h3 className="text-white font-semibold">Armazenamento</h3>
                            <div>
                                <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">{formatBytes(user?.storageUsed || 0)} utilizados</span><span className="text-gray-500">de {formatBytes(user?.storageLimit || 0)}</span></div>
                                <ProgressBar value={user?.storageUsed || 0} max={user?.storageLimit || 1} color="violet" size="lg" />
                            </div>
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
                                <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors">Limpar Cache</button>
                                <button className="text-violet-400 text-sm hover:underline">Gerenciar Arquivos</button>
                            </div>
                        </div>
                    )}

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
                            </div>
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                                <h3 className="text-white font-semibold mb-4">Webhooks</h3>
                                <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3 mb-3">
                                    <Globe size={15} className="text-gray-500" />
                                    <input placeholder="https://seu-servidor.com/webhook" className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
                                    <button className="text-violet-400 text-xs hover:underline">Salvar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
