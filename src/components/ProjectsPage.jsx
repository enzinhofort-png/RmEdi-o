import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Grid, List, X, Check,
    Film, Clock, ChevronRight, FolderOpen
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatTime, formatDate } from '../lib/utils';
import { useProjects } from '../hooks/useData';

// Mock data
const mockProjects = [
    { id: "prj_1", name: "Stream Highlights - Fev 25", description: "Melhores momentos da live de sábado", clipCount: 8, totalDuration: 245, createdAt: "2026-02-25T14:30:00", updatedAt: "2026-02-25T18:45:00", thumb: "🎮", status: "active", sourceUrl: "https://youtube.com/watch?v=abc123" },
    { id: "prj_2", name: "Podcast EP42 - Cortes", description: "Cortes do episódio sobre IA", clipCount: 5, totalDuration: 180, createdAt: "2026-02-23T10:00:00", updatedAt: "2026-02-24T09:15:00", thumb: "🎙️", status: "active", sourceUrl: "https://youtube.com/watch?v=def456" },
    { id: "prj_3", name: "Tutorial React Series", description: "Série de tutoriais React", clipCount: 12, totalDuration: 720, createdAt: "2026-02-20T08:00:00", updatedAt: "2026-02-22T16:30:00", thumb: "📚", status: "active", sourceUrl: "https://youtube.com/watch?v=ghi789" },
    { id: "prj_4", name: "Gaming Montage GTA", description: "Melhores jogadas da semana", clipCount: 15, totalDuration: 540, createdAt: "2026-02-18T20:00:00", updatedAt: "2026-02-19T22:10:00", thumb: "🕹️", status: "archived", sourceUrl: "https://twitch.tv/videos/jkl012" },
    { id: "prj_5", name: "Receitas Rápidas", description: "Cortes do canal de culinária", clipCount: 6, totalDuration: 300, createdAt: "2026-02-15T12:00:00", updatedAt: "2026-02-16T14:00:00", thumb: "🍳", status: "active", sourceUrl: "https://youtube.com/watch?v=mno345" },
    { id: "prj_6", name: "Fitness Challenge", description: "Desafio de 30 dias", clipCount: 30, totalDuration: 900, createdAt: "2026-02-10T06:00:00", updatedAt: "2026-02-28T07:00:00", thumb: "💪", status: "active", sourceUrl: "https://youtube.com/watch?v=pqr678" },
];

export const ProjectsPage = ({ setPage, user, setProjectId }) => {
    const isGuest = user?.id === "guest_user";
    const [view, setView] = useState("grid");
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);

    const {
        projects: realProjects,
        loading,
        deleteProject
    } = useProjects(isGuest ? null : user?.id);

    const displayProjects = useMemo(() => {
        const base = isGuest ? mockProjects : realProjects;
        return base.filter(p =>
            (filter === "all" || p.status === filter) &&
            (!search || p.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [isGuest, realProjects, filter, search]);

    const totalClips = useMemo(() =>
        displayProjects.reduce((a, p) => a + (p.clip_count || p.clipCount || 0), 0)
        , [displayProjects]);

    const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

    return (
        <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Projetos</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{displayProjects.length} projetos · {totalClips} clipes no total</p>
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

            {displayProjects.length === 0 ? <EmptyState icon={FolderOpen} title="Nenhum projeto encontrado" description="Tente ajustar seus filtros ou crie um novo projeto" action="Novo Projeto" onAction={() => setPage("editor")} /> : (
                view === "grid" ? (
                    <div className="grid grid-cols-3 gap-4">
                        {displayProjects.map(pr => (
                            <div key={pr.id} className={`bg-gray-900 border rounded-2xl overflow-hidden cursor-pointer transition-all group ${selected.includes(pr.id) ? "border-violet-500 ring-1 ring-violet-500/30" : "border-gray-800 hover:border-violet-500/30"}`}>
                                <div onClick={() => { setProjectId(pr.id); setPage("editor"); }} className="h-28 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-5xl group-hover:scale-[1.02] transition-transform relative">
                                    {pr.thumb}
                                    <button onClick={e => { e.stopPropagation(); toggleSel(pr.id); }} className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md border transition-all ${selected.includes(pr.id) ? "bg-violet-600 border-violet-500" : "bg-gray-900/60 border-gray-700 opacity-0 group-hover:opacity-100"} flex items-center justify-center`}>
                                        {selected.includes(pr.id) && <Check size={10} className="text-white" />}
                                    </button>
                                </div>
                                <div className="p-4" onClick={() => { setProjectId(pr.id); setPage("editor"); }}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors line-clamp-1">{pr.name}</h3>
                                        <Badge variant={pr.status === "active" ? "success" : "default"} size="xs">{pr.status === "active" ? "Ativo" : "Arquivado"}</Badge>
                                    </div>
                                    <p className="text-gray-600 text-xs truncate mb-2.5">{pr.description}</p>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <span className="flex items-center gap-1"><Film size={10} />{pr.clip_count || pr.clipCount || 0} clipes</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1"><Clock size={10} />{formatTime(pr.total_duration || pr.totalDuration || 0)}</span>
                                        <span className="ml-auto">{formatDate(pr.updated_at || pr.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {displayProjects.map(pr => (
                            <div key={pr.id} onClick={() => { setProjectId(pr.id); setPage("editor"); }} className={`flex items-center gap-4 bg-gray-900 border rounded-2xl p-4 cursor-pointer transition-all group ${selected.includes(pr.id) ? "border-violet-500" : "border-gray-800 hover:border-violet-500/30"}`}>
                                <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0">{pr.thumb}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors truncate">{pr.name}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{pr.description}</p>
                                </div>
                                <div className="text-gray-600 text-xs text-right shrink-0">
                                    <p>{pr.clip_count || pr.clipCount || 0} clipes · {formatTime(pr.total_duration || pr.totalDuration || 0)}</p>
                                    <p className="mt-0.5">{formatDate(pr.updated_at || pr.updatedAt)}</p>
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
