import React from 'react';

export const Stat = ({ label, value, change, icon: Icon, gradient, onClick }) => (
    <div onClick={onClick} className={`bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-200 ${onClick ? "cursor-pointer hover:scale-[1.01]" : ""}`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
            <Icon size={18} className="text-white" />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <div className="flex items-center justify-between mt-1">
            <span className="text-gray-500 text-xs">{label}</span>
            {change && <span className="text-emerald-400 text-xs font-medium">{change}</span>}
        </div>
    </div>
);
