import React, { useRef, useState, useEffect } from 'react';
import {
    Film, Download, HardDrive, Server, Plus, ChevronRight, Loader
} from 'lucide-react';
import { Stat } from './ui/Stat';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { formatBytes, formatTime, formatDate } from '../lib/utils';
import { PRESETS } from '../lib/constants';
import { useDashboard, useProjects, useExports, useStorage } from '../hooks/useData';

// Mock data
const mockProjects = [
    { id: "prj_1", name: "Stream Highlights - Fev 25", description: "Melhores momentos da live de sábado", clipCount: 8, totalDuration: 245, createdAt: "2026-02-25T14:30:00", updatedAt: "2026-02-25T18:45:00", thumb: "🎮", status: "active" },
    { id: "prj_2", name: "Podcast EP42 - Cortes", description: "Cortes do episódio sobre IA", clipCount: 5, totalDuration: 180, createdAt: "2026-02-23T10:00:00", updatedAt: "2026-02-24T09:15:00", thumb: "🎙️", status: "active" },
    { id: "prj_3", name: "Tutorial React Series", description: "Série de tutoriais React", clipCount: 12, totalDuration: 720, createdAt: "2026-02-20T08:00:00", updatedAt: "2026-02-22T16:30:00", thumb: "📚", status: "active" },
];

const mockClips = [
    { id: "clp_1", name: "Highlight #1 - Pentakill", start: 12, end: 45, platform: "tiktok", status: "exported", renderProgress: 100 },
    { id: "clp_2", name: "Reação épica", start: 120, end: 155, platform: "reels", status: "rendering", renderProgress: 65 },
    { id: "clp_3", name: "Intro da Live", start: 0, end: 30, platform: "youtube", status: "ready", renderProgress: 0 },
];

const mockAnalytics = {
    weeklyExports: [{ day: "Seg", count: 18 }, { day: "Ter", count: 24 }, { day: "Qua", count: 12 }, { day: "Qui", count: 32 }, { day: "Sex", count: 28 }, { day: "Sáb", count: 35 }, { day: "Dom", count: 22 }],
};

export const Dashboard = ({ setPage, user, setProjectId }) => {
    const isGuest = user?.id === "guest_user";
    const fileInputRef = useRef(null);

    // Hooks
    const { data: dashData, loading: dashLoading } = useDashboard();
    const { projects: realProjects, loading: projectsLoading, createProject } = useProjects(isGuest ? null : user?.id);
    const { exports: realExports, loading: exportsLoading } = useExports(isGuest ? null : user?.id);
    const { uploadFile, uploading: storageUploading } = useStorage(user?.id);

    const displayProjects = isGuest ? mockProjects : (realProjects || []).slice(0, 5);
    const displayQueue = isGuest ? mockClips.filter(c => c.status !== "exported") : (realExports || []).filter(e => e.status !== "done").slice(0, 3);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || isGuest) return;

        try {
            const fileName = `video_${Date.now()}_${file.name}`;
            const res = await uploadFile('exports', file, fileName);

            if (res.success) {
                await createProject({
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    description: "Upload realizado via dashboard",
                    sourceUrl: res.url,
                    thumb: "📽️"
                });
                alert("Vídeo enviado e projeto criado com sucesso!");
            } else {
                alert("Erro no upload: " + res.error);
            }
        } catch (err) {
            console.error(err);
            alert("Erro inesperado no upload.");
        }
    };

    const stats = [
        {
            label: "Total de Clipes",
            value: isGuest ? "247" : (dashData?.total_clips || "0"),
            change: isGuest ? "+12% esta semana" : "",
            icon: Film,
            gradient: "from-violet-500 to-purple-600"
        },
        {
            label: "Exports Hoje",
            value: isGuest ? "18" : (dashData?.exports_today || "0"),
            change: isGuest ? "+5 vs ontem" : "",
            icon: Download,
            gradient: "from-blue-500 to-cyan-600"
        },
        {
            label: "Armazenamento",
            value: formatBytes(user?.storageUsed || 0),
            change: `/ ${formatBytes(user?.storageLimit || 0)}`,
            icon: HardDrive,
            gradient: "from-emerald-500 to-green-600"
        },
        {
            label: "Fila de Render",
            value: isGuest ? "3" : (dashData?.rendering_count || "0"),
            change: isGuest ? "em processamento" : "",
            icon: Server,
            gradient: "from-orange-500 to-red-500"
        },
    ];

    const maxExport = Math.max(...mockAnalytics.weeklyExports.map(d => d.count));

    return (
        <div className="flex-1 overflow-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Olá, {user?.name?.split(" ")[0] || "Criador"}! 👋</h1>
                    <p className="text-gray-500 mt-1">Aqui está seu resumo de hoje · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />
                    <button
                        onClick={() => isGuest ? alert("Disponível apenas para contas reais") : fileInputRef.current?.click()}
                        disabled={storageUploading}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-gray-700"
                    >
                        {storageUploading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                        {storageUploading ? "Enviando..." : "Upload de Vídeo"}
                    </button>
                    <button onClick={() => setPage("editor")} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 hover:scale-[1.02]">
                        <Plus size={16} />Novo Projeto
                    </button>
                </div>
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
                        {displayProjects.map(p => (
                            <div key={p.id} onClick={() => { setProjectId(p.id); setPage("editor"); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/60 cursor-pointer transition-all group">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl shrink-0">{p.thumb}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium group-hover:text-violet-400 transition-colors truncate">{p.name}</p>
                                    <p className="text-gray-500 text-xs">{p.clip_count || p.clipCount || 0} clipes · {formatDate(p.updated_at || p.updatedAt)}</p>
                                </div>
                                <Badge variant={p.status === "active" ? "success" : "default"} size="xs">{p.status === "active" ? "Ativo" : "Arquivado"}</Badge>
                                <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                            </div>
                        ))}
                        {displayProjects.length === 0 && !projectsLoading && (
                            <div className="py-8 text-center text-gray-600 text-sm italic">Nenhum projeto encontrado.</div>
                        )}
                    </div>
                </div>

                {/* Render Queue widget */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold flex items-center gap-2">Fila de Render<span className="w-5 h-5 bg-orange-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">{isGuest ? "3" : (dashData?.rendering_count || "0")}</span></h2>
                        <button onClick={() => setPage("render-queue")} className="text-violet-400 text-xs hover:underline">Ver fila</button>
                    </div>
                    <div className="space-y-2.5 flex-1">
                        {displayQueue.map(item => {
                            const isReal = !isGuest;
                            const name = isReal ? item.clips?.name : item.name;
                            const status = isReal ? item.status : item.status;
                            const progress = isReal ? item.clips?.render_progress : item.renderProgress;
                            const platform = isReal ? item.platform : item.platform;
                            const start = isReal ? (item.clips?.start_time || 0) : item.start;
                            const end = isReal ? (item.clips?.end_time || 30) : item.end;

                            return (
                                <div key={item.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-white text-xs font-medium truncate flex-1">{name || "Sem nome"}</span>
                                        <Badge variant={status === "pending" || status === "ready" ? "info" : "warning"} size="xs">
                                            {status === "pending" || status === "ready" ? "Na fila" : "Renderizando"}
                                        </Badge>
                                    </div>
                                    {(status === "processing" || status === "rendering") && <ProgressBar value={progress || 0} color="violet" size="sm" animated />}
                                    <p className="text-gray-600 text-[11px] mt-1.5">{PRESETS[platform]?.icon} {PRESETS[platform]?.label} · {formatTime(end - start)}</p>
                                </div>
                            );
                        })}
                        {displayQueue.length === 0 && !exportsLoading && (
                            <div className="py-8 text-center text-gray-600 text-xs italic">Nenhum item processando.</div>
                        )}
                    </div>
                    <button onClick={() => setPage("render-queue")} className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-lg transition-colors">Gerenciar Fila</button>
                </div>
            </div>

            {/* Export chart */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-semibold">Exports da Semana</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Visão geral da atividade</p>
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
