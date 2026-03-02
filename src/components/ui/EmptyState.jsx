import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyState = ({ icon: Icon, title, description, action, onAction }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 border border-gray-700">
            <Icon size={30} className="text-gray-600" />
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs leading-relaxed">{description}</p>
        {action && (
            <button onClick={onAction} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-violet-600/20">
                <Plus size={16} />{action}
            </button>
        )}
    </div>
);
