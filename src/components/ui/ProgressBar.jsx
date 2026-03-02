import React from 'react';
import { formatBytes } from '../../lib/utils';

export const ProgressBar = ({ value, max = 100, color = "violet", size = "md", showLabel = false, animated = false }) => {
    const pct = Math.min(100, (value / max) * 100);
    const colors = {
        violet: "from-violet-500 to-purple-500",
        emerald: "from-emerald-500 to-green-500",
        blue: "from-blue-500 to-cyan-500",
        orange: "from-orange-500 to-red-500",
        gray: "from-gray-500 to-gray-400"
    };
    const heights = { xs: "h-0.5", sm: "h-1", md: "h-2", lg: "h-3" };

    return (
        <div className="w-full">
            <div className={`w-full ${heights[size]} bg-gray-800 rounded-full overflow-hidden`}>
                <div className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700 ${animated ? "relative overflow-hidden" : ""}`} style={{ width: `${pct}%` }}>
                    {animated && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />}
                </div>
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{Math.round(pct)}%</span>
                    <span>{formatBytes(value)} / {formatBytes(max)}</span>
                </div>
            )}
        </div>
    );
};
