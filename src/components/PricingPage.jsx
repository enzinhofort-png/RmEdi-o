import React, { useState } from 'react';
import { Badge } from './ui/Badge';
import { Check } from 'lucide-react';
import { PLANS } from '../lib/constants';

export const PricingPage = ({ setPage }) => {
    const [billing, setBilling] = useState("monthly");
    // const discount = billing === "annual" ? 0.8 : 1; // Not used in the simple version but can be integrated

    return (
        <div className="flex-1 overflow-auto p-12 flex flex-col items-center">
            <div className="text-center mb-12 max-w-lg">
                <Badge variant="violet" size="sm">Planos e Preços</Badge>
                <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">Escolha seu Plano</h1>
                <p className="text-gray-400 mt-4 text-lg leading-relaxed">Desbloqueie todo o potencial do ClipStudio e acelere sua produção de conteúdo</p>

                {/* Billing toggle */}
                <div className="flex items-center gap-4 mt-8 bg-gray-900 p-1 rounded-2xl border border-gray-800 inline-flex">
                    <button onClick={() => setBilling("monthly")} className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${billing === "monthly" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Mensal</button>
                    <button onClick={() => setBilling("annual")} className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${billing === "annual" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Anual <span className="text-[10px] ml-1 opacity-70">-20%</span></button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-6xl w-full">
                {PLANS.map((plan) => (
                    <div key={plan.id} className={`bg-gray-900 border rounded-3xl p-8 relative flex flex-col transition-all duration-300 hover:scale-[1.02] ${plan.popular ? "border-violet-500 ring-1 ring-violet-500/20 shadow-2xl shadow-violet-500/10" : "border-gray-800"}`}>
                        {plan.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Badge variant={plan.popular ? "violet" : "success"} size="sm">{plan.badge}</Badge>
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>
                        </div>
                        <div className="space-y-4 mb-8 flex-1">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Check size={12} className="text-emerald-500" />
                                    </div>
                                    <span className="text-gray-400 text-sm">{f}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setPage("dashboard")} className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${plan.popular ? "bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-600/20" : "bg-gray-800 hover:bg-gray-700 text-white"}`}>
                            {plan.id === "free" ? "Começar Agora" : "Selecionar Plano"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 max-w-4xl w-full flex items-center justify-between">
                <div>
                    <h4 className="text-white font-bold text-lg mb-1">Precisa de um plano customizado?</h4>
                    <p className="text-gray-500 text-sm">Entre em contato para soluções empresariais em larga escala.</p>
                </div>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all">Falar com Vendas</button>
            </div>
        </div>
    );
};
