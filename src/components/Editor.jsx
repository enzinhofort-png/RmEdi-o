import React, { useState, useRef, useEffect } from 'react';
import {
    Plus, Search, X, Check, Clock, Film, Download,
    SkipBack, SkipForward, Play, Pause, Volume2, VolumeX,
    RotateCcw, Share2, Save, Layers, Move, ZoomIn,
    Sparkles, ChevronLeft, Loader, Layout, Type, Music,
    AlertCircle, AlertTriangle, Copy, Trash2
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { Toggle } from '../ui/Toggle';
import { Tooltip } from '../ui/Tooltip';
import { formatTime, gid } from '../lib/utils';
import {
    PRESETS, FONTS, CAPTION_STYLES, QUALITY_OPTIONS
} from '../lib/constants';
import { useClips } from '../hooks/useData';

// Mock data (clips)
const initialClips = [
    { id: "clp_1", projectId: "prj_1", name: "Highlight #1 - Pentakill", start: 12, end: 45, platform: "tiktok", status: "exported", captions: true, quality: "hd", exportedAt: "2026-02-25T19:00:00", fileSize: 15728640, renderProgress: 100 },
    { id: "clp_2", projectId: "prj_1", name: "Reação épica", start: 120, end: 155, platform: "reels", status: "rendering", captions: true, quality: "hd", exportedAt: null, fileSize: null, renderProgress: 65 },
    { id: "clp_3", projectId: "prj_1", name: "Intro da Live", start: 0, end: 30, platform: "youtube", status: "ready", captions: false, quality: "max", exportedAt: null, fileSize: null, renderProgress: 0 },
];

const getMediaType = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("twitch.tv")) return "twitch";
    return "video";
};

export const Editor = ({ setPage, user, projectId }) => {
    const isGuest = user?.id === "guest_user";
    const {
        clips: realClips,
        loading: clipsLoading,
        createClip: dbCreateClip,
        updateClip: dbUpdateClip,
        deleteClip: dbDeleteClip
    } = useClips(isGuest ? null : projectId, isGuest ? null : user?.id);

    const [url, setUrl] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [ct, setCT] = useState(0);
    const [duration, setDuration] = useState(0);
    const [vol, setVol] = useState(80);
    const [muted, setMuted] = useState(false);
    const [preset, setPreset] = useState("tiktok");

    // Manage local clips state for immediate UI feedback, 
    // but sync with realClips when they load
    const [clips, setClips] = useState(initialClips);

    useEffect(() => {
        if (!isGuest && realClips.length > 0) {
            setClips(realClips);
            if (!selClip) {
                const first = realClips[0];
                setSelClip(first.id);
                setClipStart(first.start_time || first.start || 0);
                setClipEnd(first.end_time || first.end || 30);
                setPreset(first.platform || "tiktok");
                setCaptionText(first.caption_text || first.captionText || "");
            }
        }
    }, [isGuest, realClips, selClip]);

    const [selClip, setSelClip] = useState(null);
    const [clipStart, setClipStart] = useState(12);
    const [clipEnd, setClipEnd] = useState(45);
    const [showCaptions, setShowCaptions] = useState(true);
    const [captionText, setCaptionText] = useState("Legenda gerada automaticamente");
    const [captionStyle, setCaptionStyle] = useState(0);
    const [font, setFont] = useState("Oswald");
    const [fontSize, setFontSize] = useState(24);
    const [zoom, setZoom] = useState(100);
    const [tab, setTab] = useState("format");
    const [exporting, setExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);
    const [quality, setQuality] = useState("hd");
    const [projectName, setProjName] = useState("Novo Projeto");
    const [saved, setSaved] = useState(true);
    const [saving, setSaving] = useState(false);
    const [genAI, setGenAI] = useState(false);
    const tlRef = useRef(null);
    const videoRef = useRef(null);
    const loadTimeoutRef = useRef(null);

    useEffect(() => () => clearTimeout(loadTimeoutRef.current), []);

    useEffect(() => {
        let iv;
        if (loaded && playing) {
            const v = videoRef.current;
            if (v) {
                v.currentTime = ct;
                v.play().catch(() => { });
                iv = setInterval(() => {
                    setCT(v.currentTime);
                    if (v.currentTime >= clipEnd) {
                        setPlaying(false);
                        v.pause();
                        setCT(clipStart);
                    }
                }, 100);
            } else {
                iv = setInterval(() => {
                    setCT(p => {
                        const next = p + 0.1;
                        if (next >= clipEnd) {
                            setPlaying(false);
                            return clipStart;
                        }
                        return next;
                    });
                }, 100);
            }
        }
        return () => {
            if (iv) clearInterval(iv);
            if (videoRef.current) videoRef.current.pause();
        };
    }, [playing, clipStart, clipEnd, loaded]);

    // Auto-save effect
    useEffect(() => {
        if (isGuest || !selClip || !dbUpdateClip) return;

        const currentClip = clips.find(c => c.id === selClip);
        if (!currentClip) return;

        setSaved(false);
        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                await dbUpdateClip(selClip, {
                    start_time: clipStart,
                    end_time: clipEnd,
                    caption_text: captionText,
                    platform: preset,
                    caption_style: captionStyle,
                    zoom_level: zoom
                });
                setSaved(true);
            } catch (err) {
                console.error("Auto-save failed:", err);
            } finally {
                setSaving(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [clipStart, clipEnd, captionText, preset, captionStyle, zoom, selClip, isGuest]);

    useEffect(() => {
        const fn = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
            if (e.key === "ArrowLeft") setCT(p => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setCT(p => Math.min(duration, p + 5));
            if (e.key === "[") setClipStart(Math.floor(ct));
            if (e.key === "]") setClipEnd(Math.floor(ct));
            if (e.key === "n" || e.key === "N") addClip();
            if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); /* Auto-save handles it */ }
            if ((e.ctrlKey || e.metaKey) && e.key === "e") { e.preventDefault(); setShowExportModal(true); }
        };
        if (loaded) document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [loaded, ct, duration]);

    const handleLoad = () => {
        if (!url.trim()) return;
        setLoading(true);
        loadTimeoutRef.current = setTimeout(() => {
            setLoading(false);
            setLoaded(true);
            if (url.includes("demo") || url === "demo") setDuration(324);
        }, 1200);
    };

    const handleExport = () => {
        setShowExportModal(false); setExporting(true); setExportProgress(0);
        const iv = setInterval(() => {
            setExportProgress(p => {
                if (p >= 100) {
                    clearInterval(iv);
                    setTimeout(() => setExporting(false), 2000);
                    return 100;
                }
                return p + Math.random() * 5 + 2;
            });
        }, 250);
    };

    const addClip = async () => {
        const name = `Clipe #${clips.length + 1}`;
        const start = Math.floor(ct);
        const end = Math.min(Math.floor(ct) + 30, duration || 30);

        if (isGuest) {
            const id = "clp_" + gid();
            const nc = { id, projectId: "prj_1", name, start, end, platform: preset, status: "ready", captions: showCaptions, quality, exportedAt: null, fileSize: null, renderProgress: 0 };
            setClips([...clips, nc]); setSelClip(id); setClipStart(nc.start); setClipEnd(nc.end); setSaved(false);
        } else {
            setSaving(true);
            try {
                const newClip = await dbCreateClip({
                    name,
                    start_time: start,
                    end_time: end,
                    platform: preset,
                    project_id: projectId
                });
                if (newClip) {
                    setSelClip(newClip.id);
                    setClipStart(newClip.start_time);
                    setClipEnd(newClip.end_time);
                }
            } catch (err) {
                console.error("Failed to create clip:", err);
            } finally {
                setSaving(false);
            }
        }
    };

    const dupClip = (id) => {
        const original = clips.find(c => c.id === id);
        if (!original) return;
        const newId = "clp_" + gid();
        setClips([...clips, { ...original, id: newId, name: `${original.name} (cópia)` }]);
        setSelClip(newId);
    };

    const deleteClip = async (id) => {
        if (isGuest) {
            setClips(clips.filter(c => c.id !== id));
            if (selClip === id) setSelClip(clips[0]?.id || null);
        } else {
            setSaving(true);
            try {
                await dbDeleteClip(id);
                if (selClip === id) setSelClip(null);
            } catch (err) {
                console.error("Failed to delete clip:", err);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleTlClick = (e) => {
        if (!tlRef.current) return;
        const rect = tlRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        setCT(pos * duration);
    };

    const p = PRESETS[preset];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#060609]" id="editor-root">
            {!loaded ? (
                <div key="load-screen" className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-xl w-full">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
                                <Film size={34} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Novo Projeto</h1>
                            <p className="text-gray-500">Cole a URL do vídeo ou live para começar a editar</p>
                        </div>
                        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 space-y-4 mb-5">
                            <div className="flex gap-2">
                                <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLoad()} placeholder="Cole a URL..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-colors" />
                                <button onClick={handleLoad} disabled={loading} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2">
                                    {loading ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}Carregar
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {["Games", "Podcast", "Live"].map((title, i) => (
                                <button key={i} onClick={() => { setUrl("demo"); handleLoad(); }} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-violet-500/30 rounded-xl p-4 transition-all text-left">
                                    <p className="text-white text-sm font-medium">{title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div key="editor-content" className="flex-1 flex flex-col overflow-hidden">
                    {/* Editor Toolbar */}
                    <div className="h-11 bg-gray-900/95 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setLoaded(false)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"><ChevronLeft size={15} /></button>
                            <input value={projectName} onChange={e => { setProjName(e.target.value); setSaved(false); }} className="text-white text-sm font-medium bg-transparent outline-none border-b border-transparent hover:border-gray-700 focus:border-violet-500 transition-colors px-1 w-52" />
                            <span className={`text-[11px] flex items-center gap-1 ${saved ? "text-emerald-400" : "text-yellow-400"}`}>
                                {saving ? <><Loader size={10} className="animate-spin" />Salvando...</> : (saved ? <><Check size={10} />Salvo</> : <><AlertCircle size={10} />Não salvo</>)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Tooltip text="Salvar (Ctrl+S)"><button onClick={() => setSaved(true)} className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><Save size={13} />Salvar</button></Tooltip>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><RotateCcw size={13} />Desfazer</button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"><Share2 size={13} />Compartilhar</button>
                            <div className="w-px h-5 bg-gray-800 mx-1" />
                            <Tooltip text="Exportar (Ctrl+E)"><button onClick={() => setShowExportModal(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-1.5 rounded-lg font-semibold transition-all shadow-md shadow-emerald-600/20"><Download size={13} />Exportar</button></Tooltip>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left - Clips List */}
                        <div className="w-52 bg-[#060609] border-r border-gray-800 flex flex-col shrink-0">
                            <div className="px-3 py-2.5 border-b border-gray-800 flex items-center justify-between">
                                <span className="text-white text-xs font-semibold">Clipes <span className="text-gray-600">({clips.length})</span></span>
                                <Tooltip text="Novo clipe (N)"><button onClick={addClip} className="p-1 text-violet-400 hover:bg-gray-800 rounded-lg transition-colors"><Plus size={14} /></button></Tooltip>
                            </div>
                            <div className="flex-1 overflow-auto p-2 space-y-1">
                                {clips.map(c => (
                                    <div key={c.id} onClick={() => { setSelClip(c.id); setClipStart(c.start); setClipEnd(c.end); setCT(c.start); setPreset(c.platform); }} className={`p-2.5 rounded-xl cursor-pointer transition-all group ${selClip === c.id ? "bg-violet-600/15 border border-violet-500/30" : "bg-gray-800/20 border border-transparent hover:bg-gray-800/50"}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-white text-xs font-medium truncate flex-1 mr-1">{c.name}</span>
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={e => { e.stopPropagation(); dupClip(c.id); }} className="p-0.5 text-gray-500 hover:text-white rounded transition-colors"><Copy size={10} /></button>
                                                <button onClick={e => { e.stopPropagation(); deleteClip(c.id); }} className="p-0.5 text-gray-500 hover:text-red-400 rounded transition-colors"><Trash2 size={10} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600 text-[11px] mb-1.5"><Clock size={9} />{formatTime(c.start)} → {formatTime(c.end)}</div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">{PRESETS[c.platform]?.icon}</span>
                                            <Badge variant={c.status === "ready" ? "info" : c.status === "rendering" ? "warning" : "success"} size="xs">{c.status === "ready" ? "Pronto" : c.status === "rendering" ? "Render..." : "Exportado"}</Badge>
                                        </div>
                                        {c.status === "rendering" && <div className="mt-1.5"><ProgressBar value={c.renderProgress || 0} size="xs" animated /></div>}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t border-gray-800">
                                <button onClick={addClip} className="w-full py-2 bg-gray-800/30 hover:bg-gray-800 text-gray-500 hover:text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-dashed border-gray-700"><Plus size={12} />Adicionar Clipe</button>
                            </div>
                        </div>

                        {/* Center - Video Preview */}
                        <div className="flex-1 flex flex-col bg-[#040407] items-center justify-center p-4 min-w-0">
                            <div className="flex items-center gap-1.5 mb-3 flex-wrap justify-center">
                                {Object.entries(PRESETS).map(([k, v]) => (
                                    <button key={k} onClick={() => { setPreset(k); setSaved(false); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${preset === k ? "bg-violet-600 text-white shadow-md shadow-violet-600/20" : "bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                                        <span>{v.icon}</span>{v.label}
                                    </button>
                                ))}
                            </div>

                            <div className={`${p.ratio === "9:16" ? "aspect-[9/16]" : p.ratio === "1:1" ? "aspect-square" : "aspect-video"} bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800/80 shadow-2xl shadow-black/60`}
                                style={{ maxWidth: p.ratio === "9:16" ? "175px" : p.ratio === "1:1" ? "270px" : "430px", maxHeight: "315px", width: "100%" }}>

                                {url !== "demo" && url.trim() !== "" ? (
                                    getMediaType(url) === "video" ? (
                                        <video ref={videoRef} src={url} className="absolute inset-0 w-full h-full object-cover" onLoadedMetadata={(e) => setDuration(e.target.duration)} muted={muted} />
                                    ) : getMediaType(url) === "youtube" ? (
                                        <iframe src={`https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=${muted ? 1 : 0}&controls=0`} className="absolute inset-0 w-full h-full pointer-events-none" allow="autoplay; encrypted-media" />
                                    ) : null
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900 to-pink-900/10">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <Film size={28} className="text-gray-700 mx-auto mb-2" />
                                                <p className="text-gray-600 text-xs">Preview do Vídeo</p>
                                                <p className="text-gray-700 text-[11px]">{p.w}×{p.h} · {p.fps}fps</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showCaptions && (
                                    <div className="absolute bottom-3 left-2 right-2 text-center pointer-events-none">
                                        <span className="inline-block px-3 py-1.5 rounded-lg font-bold" style={{ background: CAPTION_STYLES[captionStyle].bg, color: CAPTION_STYLES[captionStyle].color, fontFamily: font, fontSize: `${Math.max(8, fontSize * 0.42)}px`, textShadow: CAPTION_STYLES[captionStyle].stroke ? `0 0 10px ${CAPTION_STYLES[captionStyle].color}40,2px 2px 0 rgba(0,0,0,0.9)` : "none", boxShadow: CAPTION_STYLES[captionStyle].shadow }}>{captionText}</span>
                                    </div>
                                )}

                                {exporting && (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                                        <Loader size={24} className="text-violet-400 animate-spin mb-2" />
                                        <p className="text-white text-xs font-medium">{Math.round(exportProgress)}%</p>
                                        <div className="w-24 mt-2"><ProgressBar value={exportProgress} size="sm" animated /></div>
                                    </div>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="mt-4 w-full max-w-md">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <button onClick={() => setCT(Math.max(0, ct - 5))} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"><SkipBack size={15} /></button>
                                    <button onClick={() => setCT(clipStart)} className="text-gray-600 hover:text-white text-xs p-1 rounded transition-colors">|◀</button>
                                    <button onClick={() => setPlaying(!playing)} className="w-10 h-10 bg-violet-600/90 hover:bg-violet-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-violet-600/20 hover:scale-105">
                                        {playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                                    </button>
                                    <button onClick={() => setCT(clipEnd)} className="text-gray-600 hover:text-white text-xs p-1 rounded transition-colors">▶|</button>
                                    <button onClick={() => setCT(Math.min(duration, ct + 5))} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"><SkipForward size={15} /></button>
                                    <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-800">
                                        <button onClick={() => setMuted(!muted)} className="text-gray-500 hover:text-white transition-colors">{muted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
                                        <input type="range" min={0} max={100} value={muted ? 0 : vol} onChange={e => { setVol(+e.target.value); setMuted(false); }} className="w-16 h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" />
                                    </div>
                                </div>

                                {/* Main Timeline */}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-9 text-right font-mono tabular-nums">{formatTime(ct)}</span>
                                    <div ref={tlRef} className="flex-1 h-6 relative cursor-pointer group" onClick={handleTlClick}>
                                        <div className="absolute inset-y-0 top-1/2 -translate-y-1/2 h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div className="absolute inset-0 flex items-center gap-px px-1 opacity-20">
                                                {Array.from({ length: 60 }, (_, i) => <div key={i} className="flex-1 bg-gray-500 rounded-sm" style={{ height: `${20 + Math.sin(i * 0.4) * 15 + Math.random() * 20}%` }} />)}
                                            </div>
                                            <div className="absolute h-full bg-violet-500/20 rounded" style={{ left: `${(clipStart / duration) * 100}%`, width: `${((clipEnd - clipStart) / duration) * 100}%` }} />
                                            <div className="absolute h-full bg-violet-500/60 rounded" style={{ left: `${(clipStart / duration) * 100}%`, width: `${(((Math.min(ct, clipEnd) - clipStart) / duration) * 100).toFixed(2)}%` }} />
                                        </div>
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-violet-400 cursor-ew-resize" style={{ left: `${(clipStart / duration) * 100}%` }}>
                                            <div className="absolute top-0 -left-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
                                        </div>
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-violet-400 cursor-ew-resize" style={{ left: `${(clipEnd / duration) * 100}%` }}>
                                            <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
                                        </div>
                                        <div className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${(ct / duration) * 100}%` }}>
                                            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                    <span className="w-9 font-mono tabular-nums">{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Sidebar Tools */}
                        <div className="w-72 bg-[#060609] border-l border-gray-800 flex flex-col shrink-0">
                            <div className="flex border-b border-gray-800">
                                {[{ id: "format", icon: Layout, l: "Formato" }, { id: "captions", icon: Type, l: "Texto" }, { id: "audio", icon: Music, l: "Áudio" }, { id: "export", icon: Download, l: "Export" }].map(t => (
                                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${tab === t.id ? "text-violet-400 border-b-2 border-violet-500" : "text-gray-600 hover:text-gray-300"}`}>
                                        <t.icon size={14} />{t.l}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 overflow-auto p-4 space-y-5">
                                {tab === "format" && (
                                    <>
                                        <div>
                                            <label className="text-gray-400 text-xs font-medium mb-2 block">Intervalo do Clipe</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-gray-800 rounded-lg px-3 py-2"><span className="text-gray-600 text-[11px] block mb-0.5">Início</span><input type="number" value={clipStart} onChange={e => { setClipStart(+e.target.value); setSaved(false); }} className="bg-transparent text-white text-sm w-full outline-none" /></div>
                                                <div className="bg-gray-800 rounded-lg px-3 py-2"><span className="text-gray-600 text-[11px] block mb-0.5">Fim</span><input type="number" value={clipEnd} onChange={e => { setClipEnd(+e.target.value); setSaved(false); }} className="bg-transparent text-white text-sm w-full outline-none" /></div>
                                            </div>
                                        </div>
                                        <div><label className="text-gray-400 text-xs font-medium mb-2 block">Zoom ({zoom}%)</label><input type="range" min={100} max={300} value={zoom} onChange={e => setZoom(+e.target.value)} className="w-full h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" /></div>
                                        <div>
                                            <label className="text-gray-400 text-xs font-medium mb-2 block">Proporção</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[["9:16", "Vertical"], ["1:1", "Quadrado"], ["16:9", "Horizontal"]].map(([r, l]) => (
                                                    <button key={r} onClick={() => { setPreset(r === "9:16" ? "tiktok" : r === "1:1" ? "square" : "youtube"); setSaved(false); }} className={`py-2.5 rounded-xl text-xs font-medium transition-all text-center ${p.ratio === r ? "bg-violet-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>{r}<br /><span className="opacity-60 text-[10px]">{l}</span></button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {tab === "captions" && (
                                    <>
                                        <Toggle value={showCaptions} onChange={v => { setShowCaptions(v); setSaved(false); }} label="Legendas ativas" />
                                        <div><label className="text-gray-400 text-xs font-medium mb-2 block">Texto</label><textarea value={captionText} onChange={e => { setCaptionText(e.target.value); setSaved(false); }} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none resize-none focus:border-violet-500 transition-colors" /></div>
                                        <button onClick={() => { setGenAI(true); setTimeout(() => { setCaptionText("ESSE MOMENTO FOI INACREDITÁVEL 🔥"); setGenAI(false); }, 1500); }} disabled={genAI} className="w-full bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-400 text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                                            {genAI ? <><Loader size={13} className="animate-spin" />Gerando...</> : <><Sparkles size={13} />Gerar com IA</>}
                                        </button>
                                        <div><label className="text-gray-400 text-xs font-medium mb-2 block">Estilo</label>
                                            <div className="space-y-1.5">
                                                {CAPTION_STYLES.map((s, i) => (
                                                    <button key={i} onClick={() => { setCaptionStyle(i); setSaved(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${captionStyle === i ? "bg-violet-600/10 border border-violet-500/30" : "bg-gray-800/40 border border-transparent hover:bg-gray-800"}`}><span className="font-bold text-base" style={{ color: s.color }}>Aa</span><span className="text-xs text-gray-300">{s.name}</span></button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {tab === "audio" && (
                                    <div className="space-y-4">
                                        <div><label className="text-gray-400 text-xs font-medium mb-2 block">Volume ({vol}%)</label><input type="range" min={0} max={100} value={vol} onChange={e => setVol(+e.target.value)} className="w-full h-1 rounded-full appearance-none bg-gray-700 accent-violet-500 cursor-pointer" /></div>
                                        <button className="w-full bg-gray-800/50 hover:bg-gray-800 border border-dashed border-gray-700 py-6 rounded-xl text-gray-500 text-xs flex flex-col items-center gap-2 transition-colors"><Music size={16} />Adicionar trilha</button>
                                    </div>
                                )}
                                {tab === "export" && (
                                    <div className="space-y-4">
                                        <button onClick={() => setShowExportModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"><Download size={16} />Configurar Export</button>
                                        <button className="w-full bg-gray-800 text-gray-400 py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-50"><Layers size={14} />Export em Lote</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Modal open={showExportModal} onClose={() => setShowExportModal(false)} title="Exportar Clipe" size="xl">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-400 text-xs font-medium mb-2 block">Qualidade</label>
                                    <div className="space-y-2">
                                        {QUALITY_OPTIONS.map(q => (
                                            <button key={q.id} onClick={() => setQuality(q.id)} className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${quality === q.id ? "bg-violet-600/10 border border-violet-500/30" : "bg-gray-800 border border-transparent"}`}><p className="text-white text-sm font-medium">{q.label}</p><p className="text-gray-500 text-[10px]">{q.desc}</p></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-800 rounded-xl p-4"><h4 className="text-white text-xs font-bold mb-2">Resumo</h4><div className="space-y-1"><div className="flex justify-between text-[11px]"><span className="text-gray-500">Duração</span><span className="text-white">{formatTime(clipEnd - clipStart)}</span></div><div className="flex justify-between text-[11px]"><span className="text-gray-500">Formato</span><span className="text-white">MP4 / {quality.toUpperCase()}</span></div></div></div>
                                <button onClick={handleExport} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"><Download size={16} />Iniciar Render</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    );
};
