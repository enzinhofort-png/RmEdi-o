import React from 'react';

export const Toggle = ({ value, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between gap-4">
        {label && <div><span className="text-gray-300 text-sm">{label}</span>{sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}</div>}
        <button onClick={() => onChange(!value)} className={`w-10 h-[22px] rounded-full transition-all duration-200 relative shrink-0 ${value ? "bg-violet-600 shadow-lg shadow-violet-600/30" : "bg-gray-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-transform duration-200 shadow ${value ? "translate-x-5" : "translate-x-[3px]"}`} />
        </button>
    </div>
);
