import React from 'react';

export const Tooltip = ({ children, text, side = "top" }) => (
    <div className="relative group">
        {children}
        {text && (
            <div className={`absolute ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"} left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 z-50 shadow-lg`}>
                {text}
            </div>
        )}
    </div>
);
