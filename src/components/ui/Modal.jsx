import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ open, onClose, title, children, size = "md", noPad = false }) => {
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    if (!open) return null;

    const s = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl"
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`bg-gray-900 rounded-2xl border border-gray-700/80 shadow-2xl w-full ${s[size]} max-h-[90vh] flex flex-col`} style={{ animation: "scale-in 0.15s ease-out" }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold text-base">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800">
                        <X size={16} />
                    </button>
                </div>
                <div className={`flex-1 overflow-auto ${noPad ? "" : "p-5"}`}>{children}</div>
            </div>
        </div>
    );
};
