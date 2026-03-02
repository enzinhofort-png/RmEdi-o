import React from 'react';
import {
    Home, Film, FolderOpen, BarChart3, Server, Settings,
    ChevronLeft, ChevronRight, Scissors, Crown, LogOut
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { ProgressBar } from './ui/ProgressBar';
import { formatBytes } from '../lib/utils';

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
