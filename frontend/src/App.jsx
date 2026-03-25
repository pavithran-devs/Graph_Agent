import React, { useState, useEffect, useCallback } from 'react';
import {
  Minimize2, Layers, ChevronRight, AlertCircle, Loader2,
  Search, Info, Database, Activity, Sparkles, Map,
  Maximize2, Share2, Settings, ZoomIn, ZoomOut
} from 'lucide-react';
import GraphCanvas from './components/GraphCanvas.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import NodePopup from './components/NodePopup.jsx';
import Legend from './components/Legend.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/graph-data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGraphData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth transition
    }
  }, []);

  useEffect(() => { fetchGraph(); }, [fetchGraph]);

  const stats = graphData
    ? { nodes: graphData.nodes.length, edges: graphData.edges.length }
    : null;

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">

      {/* ── Side Navigation (Slim) ────────────────────────────────── */}
      <aside className="w-16 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8 z-50">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
          <Database size={20} className="text-white" />
        </div>
        <nav className="flex flex-col gap-6">
          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-900 shadow-sm transition-all"><Map size={20} /></button>
          <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"><Activity size={20} /></button>
          <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"><Info size={20} /></button>
        </nav>
        <button className="mt-auto p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
          <Settings size={20} />
        </button>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">

        {/* Header Bar */}
        <header className="h-16 flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-200 px-6 flex items-center gap-4 z-40">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>Systems</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-bold tracking-tight">Supply Chain Graph</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Node Count</span>
                <span className="text-xs font-black text-slate-900">{stats?.nodes || 0}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Flow Density</span>
                <span className="text-xs font-black text-slate-900">{stats?.edges || 0}</span>
              </div>
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"><Search size={18} /></button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
              <Share2 size={14} />
              <span>Export View</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Graph Section */}
          <div className="flex-1 relative overflow-hidden">

            {/* Floating Control Panel */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
              <div className="p-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl flex flex-col gap-1">
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`p-2.5 rounded-xl transition-all ${showOverlay ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  title="Toggle Labels"
                >
                  <Layers size={18} />
                </button>
                <div className="w-full h-px bg-slate-100 my-1" />
                <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"><ZoomIn size={18} /></button>
                <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"><ZoomOut size={18} /></button>
                <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"><Maximize2 size={18} /></button>
              </div>
            </div>

            {/* Status Pulse */}
            <div className="absolute bottom-6 left-6 z-30 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-3 animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Graph Live · Realtime Analysis</span>
            </div>

            {/* Loading / Error States */}
            {loading && (
              <div className="absolute inset-0 z-40 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center gap-4 transition-all animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center animate-spin">
                  <Sparkles size={24} className="text-white" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Neutralizing Data Layer</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-white/20 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-red-50 max-w-sm flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><AlertCircle size={28} /></div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Connection Severed</h3>
                  <p className="text-sm text-slate-400 font-medium">{error}</p>
                  <button onClick={fetchGraph} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">Establish Link</button>
                </div>
              </div>
            )}

            {/* The Actual Graph Component */}
            {graphData && !error && (
              <GraphCanvas
                graphData={graphData}
                onNodeClick={setSelectedNode}
                showOverlay={showOverlay}
              />
            )}

            {/* Popups & Overlays */}
            {selectedNode && (
              <NodePopup node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            <Legend />
          </div>

          {/* AI Chat Drawer (Pinned Right) */}
          <div className={`w-[380px] flex-shrink-0 bg-white border-l border-slate-200 shadow-2xl transition-all duration-500 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
            <ChatPanel onToggle={() => setSidebarOpen(!sidebarOpen)} />
          </div>

        </div>
      </main>
    </div>
  );
}
