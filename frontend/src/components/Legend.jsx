import React from 'react';
import { GROUP_STYLES } from '../lib/graphUtils';

const LEGEND_ITEMS = [
    'Customer', 'Order', 'Delivery', 'Billing',
    'Product', 'Address'
];

export default function Legend() {
    return (
        <div className="absolute top-6 right-6 z-30 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl px-4 py-3 min-w-[140px] animate-fadeIn">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-3">Classification</p>
            <div className="flex flex-col gap-2.5">
                {LEGEND_ITEMS.map(g => (
                    <div key={g} className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-bold text-slate-600">{g}</span>
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                            style={{ background: GROUP_STYLES[g]?.bg ?? '#94a3b8' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
