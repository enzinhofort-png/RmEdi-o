import React, { useState, useRef, useEffect } from 'react';
import {
    Plus, Keyboard, Bell, Search, X, CheckCircle,
    AlertTriangle, Info, XCircle
} from 'lucide-react';
import { Tooltip } from './ui/Tooltip';
import { Modal } from './ui/Modal';
import { SHORTCUTS } from '../lib/constants';

// Mock notifications (normally would come from a real data hook)
const mockNotifications = [
    { id: 1, type: "success", title: "Export concluído", message: "Highlight #1 exportado com sucesso", time: "5 min atrás", read: false },
    { id: 2, type: "warning", title: "Alerta de copyright", message: "Música detectada no clipe 'Reação épica'", time: "15 min atrás", read: false },
    { id: 3, type: "info", title: "Novo recurso", message: "Legendas automáticas com IA disponíveis!", time: "1h atrás", read: true },
    { id: 4, type: "success", title: "Render completo", message: "3 clipes renderizados no projeto Tutorial", time: "3h atrás", read: true },
];

const KbdKey = ({ keys }) => (
    <div className="flex items-center gap-1">
        {keys.map((k, i) => <kbd key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">{k}</kbd>)}
    </div>
);

export const TopBar = ({ user, setPage }) => {
    const [showNotifs, setShowNotifs] = useState(false);
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
