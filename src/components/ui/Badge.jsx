import React from 'react';

export const Badge = ({ children, variant = "default", size = "sm" }) => {
    const v = {
        default: "bg-gray-700 text-gray-300",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
        error: "bg-red-500/20 text-red-400 border border-red-500/20",
        info: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
        violet: "bg-violet-500/20 text-violet-400 border border-violet-500/20",
        premium: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/20",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v[variant]} ${size === "xs" ? "px-1.5 py-px text-[10px]" : ""}`}>{children}</span>;
};
