import React, { useState } from 'react';
import {
    Download, Play, Trash2, Cpu, CheckCircle
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { formatTime, formatBytes, formatDate } from '../lib/utils';
import { PRESETS } from '../lib/constants';

// Mock data
const mockClips = [
    { id: "clp_1", name: "Highlight #1 - Pentakill", start: 12, end: 45, platform: "tiktok", status: "exported", quality: "hd", exportedAt: "2026-02-25T19:00:00", fileSize: 15728640, renderProgress: 100 },
    { id: "clp_2", name: "Reação épica", start: 120, end: 155, platform: "reels", status: "rendering", quality: "hd", exportedAt: null, fileSize: null, renderProgress: 65 },
    { id: "clp_3", name: "Intro da Live", start: 0, end: 30, platform: "youtube", status: "ready", quality: "max", exportedAt: null, fileSize: null, renderProgress: 0 },
];

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
                {queue.map((c) => (
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
