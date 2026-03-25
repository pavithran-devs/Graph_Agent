import React from 'react';
import { X, ExternalLink, Activity, Info, Link as LinkIcon, Database, Terminal } from 'lucide-react';
import { styleOf, groupOf } from '../lib/graphUtils';

export default function NodePopup({ node, onClose }) {
    if (!node) return null;

    const style = styleOf(node.id);
    const group = groupOf(node.id);

    const fields = [
        { label: 'Entity Source', value: node.id, icon: LinkIcon },
        { label: 'Classification', value: group, icon: Info },
        { label: 'CompanyCode', value: '1000 (Mock)', icon: Database },
        { label: 'FiscalYear', value: '2024', icon: Activity },
        { label: 'AccountingDoc', value: '51000' + (node.id.split('_').pop() || '01'), icon: Terminal },
        { label: 'Amount/Curr', value: '450.00 USD', icon: Activity },
        { label: 'Posting Date', value: '2024-03-24', icon: Activity },
    ];


    const parts = node.id.split('_');
    const entityNum = parts[parts.length - 1];

    return (
        <div className="absolute z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 w-80 pointer-events-auto animate-fadeIn overflow-hidden"
            style={{ top: 80, right: 16 }}>

            {/* Header Color Accent */}
            <div className="h-1.5 w-full" style={{ backgroundColor: style.bg }} />

            <div className="p-5">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 block">Entity Details</span>
                        <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-none">{group}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-slate-900 transition-colors p-1 hover:bg-slate-50 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    {fields.map((f, i) => (
                        <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100 transition-hover hover:border-slate-200">
                            <div className="flex items-center gap-2">
                                <f.icon size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{f.label}</span>
                            </div>
                            <span className="text-xs font-mono font-black text-slate-700 break-all select-all">{String(f.value)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <button
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100"
                        onClick={() => alert(`Expanding trace for ${node.id}...`)}
                    >
                        <ExternalLink size={14} />
                        <span>Trace Full Path</span>
                    </button>
                    <button
                        className="w-full py-2 bg-white text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 hover:border-slate-300 transition-all"
                        onClick={onClose}
                    >
                        Dismiss
                    </button>
                </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-50 bg-[#FBFBFF] flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Indexed by Dodge AI
                </span>
            </div>
        </div>
    );
}
