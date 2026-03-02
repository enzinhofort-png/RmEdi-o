import React from 'react';
import {
    Download, Play, Trash2, Cpu, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { formatTime, formatBytes, formatDate } from '../lib/utils';
import { PRESETS } from '../lib/constants';
import { useExports } from '../hooks/useData';

export const RenderQueuePage = ({ user }) => {
    const { exports, loading, deleteExport } = useExports(user?.id);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-600" size={32} />
        </div>
    );

    const rendering = exports.filter(e => e.status === "processing" || e.status === "pending").length;
    const done = exports.filter(e => e.status === "done").length;
    const errorCount = exports.filter(e => e.status === "error").length;

    return (
        <div className="flex-1 overflow-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Fila de Renderização</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Gerencie seus exports em andamento</p>
                </div>
                <div className="flex items-center gap-2">
                    {rendering > 0 && <Badge variant="warning">{rendering} processando</Badge>}
                    {done > 0 && <Badge variant="success">{done} concluídos</Badge>}
                    {errorCount > 0 && <Badge variant="error">{errorCount} erros</Badge>}
                </div>
            </div>

            {exports.length === 0 && (
                <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Cpu className="text-gray-600" size={24} />
                    </div>
                    <h3 className="text-white font-medium">Nenhum export na fila</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                        Seus clipes exportados aparecerão aqui para download.
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {exports.map((e) => {
                    const clip = e.clips || {};
                    const isRendering = e.status === "processing" || e.status === "pending";

                    return (
                        <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-xl shrink-0">
                                    {PRESETS[e.platform]?.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white font-medium text-sm truncate">{clip.name || "Sem nome"}</p>
                                        <Badge variant={
                                            e.status === "pending" ? "info" :
                                                e.status === "processing" ? "warning" :
                                                    e.status === "done" ? "success" : "error"
                                        } size="xs">
                                            {e.status === "pending" ? "Aguardando" :
                                                e.status === "processing" ? "Renderizando" :
                                                    e.status === "done" ? "Concluído" : "Erro"}
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 text-xs">
                                        {PRESETS[e.platform]?.label} · {PRESETS[e.platform]?.w}×{PRESETS[e.platform]?.h} · {formatTime(clip.end_time - clip.start_time)} · {e.quality?.toUpperCase()}
                                    </p>

                                    {isRendering && (
                                        <div className="mt-2 max-w-xs">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>{clip.render_progress || 0}%</span>
                                                <span>Processando...</span>
                                            </div>
                                            <ProgressBar value={clip.render_progress || 0} color="violet" size="sm" animated />
                                        </div>
                                    )}

                                    {e.status === "done" && (
                                        <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                                            <CheckCircle size={10} />
                                            Exportado · {formatBytes(e.file_size || 0)} · {formatDate(e.completed_at || e.created_at)}
                                        </p>
                                    )}

                                    {e.status === "error" && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={10} />
                                            {e.error_msg || "Erro desconhecido na renderização"}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {e.status === "done" && e.file_url && (
                                        <a
                                            href={e.file_url}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs transition-colors"
                                        >
                                            <Download size={12} />Download
                                        </a>
                                    )}
                                    <button
                                        onClick={() => deleteExport(e.id)}
                                        className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
