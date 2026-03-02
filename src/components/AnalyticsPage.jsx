import React from 'react';
import {
    Film, Download, Clock, Timer, TrendingUp
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { PRESETS } from '../lib/constants';

// Mock data
const mockAnalytics = {
    weeklyExports: [{ day: "Seg", count: 18 }, { day: "Ter", count: 24 }, { day: "Qua", count: 12 }, { day: "Qui", count: 32 }, { day: "Sex", count: 28 }, { day: "Sáb", count: 35 }, { day: "Dom", count: 22 }],
    hourlyExports: [{ h: "00", c: 2 }, { h: "03", c: 1 }, { h: "06", c: 4 }, { h: "09", c: 15 }, { h: "12", c: 22 }, { h: "15", c: 28 }, { h: "18", c: 35 }, { h: "21", c: 18 }],
    platformBreakdown: [{ platform: "TikTok", count: 89, pct: 36 }, { platform: "Reels", count: 67, pct: 27 }, { platform: "Shorts", count: 52, pct: 21 }, { platform: "YouTube", count: 28, pct: 11 }, { platform: "Square", count: 11, pct: 5 }],
    monthlyGrowth: [{ month: "Set", clips: 42 }, { month: "Out", clips: 78 }, { month: "Nov", clips: 120 }, { month: "Dez", clips: 156 }, { month: "Jan", clips: 198 }, { month: "Fev", clips: 247 }],
};

export const AnalyticsPage = () => {
    const maxWeek = Math.max(...mockAnalytics.weeklyExports.map(d => d.count));
    const maxMonth = Math.max(...mockAnalytics.monthlyGrowth.map(m => m.clips));
    const maxHour = Math.max(...mockAnalytics.hourlyExports.map(h => h.c));

    return (
        <div className="flex-1 overflow-auto p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
                <p className="text-gray-500 text-sm mt-0.5">Acompanhe sua produtividade e métricas detalhadas</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    ["Clipes Criados", "247", "+12%", "violet", Film],
                    ["Total Exportados", "189", "~45s avg render", "blue", Download],
                    ["Horas Economizadas", "~62h", "vs edição manual", "emerald", Clock],
                    ["Tempo Médio/Clipe", "2.3 min", "-15% vs mês passado", "orange", Timer],
                ].map(([l, v, d, c, Icon], i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                        <p className="text-gray-500 text-xs mb-2">{l}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{v}</p>
                        <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><TrendingUp size={11} />{d}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-1">Exports por Dia</h2>
                    <p className="text-gray-600 text-xs mb-5">Última semana · 171 total</p>
                    <div className="flex items-end gap-2 h-36">
                        {mockAnalytics.weeklyExports.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <span className="text-gray-600 text-xs group-hover:text-white transition-colors">{d.count}</span>
                                <div className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md transition-all opacity-75 group-hover:opacity-100" style={{ height: `${(d.count / maxWeek) * 100}%` }} />
                                <span className="text-gray-600 text-xs">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-1">Por Plataforma</h2>
                    <p className="text-gray-600 text-xs mb-5">Distribuição de exports por destino</p>
                    <div className="space-y-3.5">
                        {mockAnalytics.platformBreakdown.map((p, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-white text-sm flex items-center gap-2">{PRESETS[p.platform.toLowerCase()]?.icon || "📊"}{p.platform}</span>
                                    <span className="text-gray-400 text-xs">{p.count} <span className="text-gray-600">({p.pct}%)</span></span>
                                </div>
                                <ProgressBar value={p.pct} color={["violet", "blue", "emerald", "orange", "violet"][i]} size="sm" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-1">Crescimento Mensal</h2>
                    <p className="text-gray-600 text-xs mb-5">Clipes criados por mês</p>
                    <div className="flex items-end gap-3 h-36">
                        {mockAnalytics.monthlyGrowth.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <span className="text-gray-600 text-xs group-hover:text-white transition-colors">{m.clips}</span>
                                <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all opacity-75 group-hover:opacity-100" style={{ height: `${(m.clips / maxMonth) * 100}%` }} />
                                <span className="text-gray-600 text-xs">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-1">Padrão por Horário</h2>
                    <p className="text-gray-600 text-xs mb-5">Quando você mais exporta</p>
                    <div className="flex items-end gap-1.5 h-36">
                        {mockAnalytics.hourlyExports.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm transition-all opacity-60 group-hover:opacity-100" style={{ height: `${(h.c / maxHour) * 100}%` }} />
                                <span className="text-gray-700 text-[10px]">{h.h}h</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 p-2.5 bg-blue-500/8 border border-blue-500/15 rounded-lg">
                        <p className="text-blue-400 text-xs font-medium">Pico às 18h–21h</p>
                        <p className="text-gray-600 text-[11px] mt-0.5">35 exports em média no período noturno</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
