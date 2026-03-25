import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Layers, ChevronRight, AlertCircle, Sparkles, Database,
  Search, Maximize2, ZoomIn, ZoomOut, Loader2
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
  const [focusId, setFocusId] = useState(null);
  const [highlightIds, setHighlightIds] = useState([]);

  const chatRef = useRef(null);
  const lastNodeId = useRef(null);

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
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => { fetchGraph(); }, [fetchGraph]);

  const stats = graphData ? { nodes: graphData.nodes.length, edges: graphData.edges.length } : null;

  // Handle graph focusing when AI returns a result
  const handleAiResponse = useCallback((data) => {
    if (data.focus_id) setFocusId(data.focus_id);
    if (data.path_ids) setHighlightIds(data.path_ids);
  }, []);

  // Handle node clicking (triggering AI)
  const handleNodeInteracted = useCallback((node) => {
    setSelectedNode(node);
    if (node && chatRef.current) {
      if (lastNodeId.current === node.id) return; // Prevent spam
      lastNodeId.current = node.id;
      chatRef.current.triggerQuery(`Dodge AI, summarize the trace for clinical entity: ${node.id}`);
    } else {
      lastNodeId.current = null;
    }
  }, []);


  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">

      {/* ── Side Navigation (Clean) ────────────────────────────────── */}
      <aside className="w-16 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
          <Database size={20} className="text-white" />
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header Bar */}
        <header className="h-16 flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 flex items-center gap-4 z-40">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-300">
            <span>Mapping</span>
            <ChevronRight size={14} className="opacity-30" />
            <span className="text-slate-900">Order to Cash Operations</span>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-slate-300 font-black">Live Nodes</span>
                <span className="text-sm font-black text-slate-900 leading-none">{stats?.nodes || 0}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-slate-300 font-black">Memory Pool</span>
                <span className="text-sm font-black text-slate-900 leading-none">{stats?.edges || 0}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
              <Maximize2 size={12} />
              <span>Fullscreen</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Graph Section */}
          <div className="flex-1 relative overflow-hidden bg-white">

            {/* Floating Control Panel */}
            <div className="absolute top-6 left-6 z-30 flex gap-2">
              <div className="p-1 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-2xl flex items-center gap-1">
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`p-2.5 rounded-xl transition-all ${showOverlay ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
                  title="Toggle Data Overlay"
                >
                  <Layers size={18} />
                </button>
                <div className="w-px h-6 bg-slate-100 mx-1" />
                <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"><ZoomIn size={18} /></button>
                <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"><ZoomOut size={18} /></button>
              </div>
            </div>

            {loading && (
              <div className="absolute inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5 duration-500">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-slate-200 border border-slate-800">
                  <Loader2 size={16} className="animate-spin text-blue-400" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Synchronizing Graph Layer...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-white/20 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-red-50 max-w-sm flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><AlertCircle size={28} /></div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Halted</h3>
                  <button onClick={fetchGraph} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">Re-establish Connection</button>
                </div>
              </div>
            )}

            {graphData && (
              <GraphCanvas
                graphData={graphData}
                onNodeClick={handleNodeInteracted}
                showOverlay={showOverlay}
                focusId={focusId}
                highlightIds={highlightIds}
              />
            )}

            {selectedNode && (
              <NodePopup node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            <Legend />
          </div>

          {/* AI Chat Drawer */}
          <div className={`w-[380px] flex-shrink-0 bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
            <ChatPanel
              ref={chatRef}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              onAiResponse={handleAiResponse}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
