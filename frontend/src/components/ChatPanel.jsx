import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Send, Bot, Sparkles, User, ChevronRight, MessageSquare, Terminal } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 mb-6 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-none px-5 py-3.5">
                <div className="flex gap-1.5 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
            </div>
        </div>
    );
}

function Message({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''} animate-fadeIn`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isUser ? 'bg-white border border-slate-200 text-slate-400' : 'bg-slate-900 text-white shadow-slate-200'
                }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`max-w-[85%] text-[14px] px-5 py-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap transition-all ${isUser
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 rounded-tr-none font-medium'
                : 'bg-white border border-slate-100 shadow-sm text-slate-700 rounded-tl-none'
                }`}>
                {msg.content}
            </div>
        </div>
    );
}

const ChatPanel = forwardRef(({ onToggle, onAiResponse }, ref) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Connected to Supply Chain Intelligence Layer.\n\nI can perform deep-trace analysis on the current graph. Type a query or select a node to begin.',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useImperativeHandle(ref, () => ({
        triggerQuery: (q) => {
            if (!loading) initiateMessage(q);
        }
    }));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const initiateMessage = async (query) => {
        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
            if (onAiResponse) onAiResponse(data);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ System Interface Interrupted: ${err.message}.`,
            }]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        const query = input.trim();
        if (!query || loading) return;
        setInput('');
        initiateMessage(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white transition-all overflow-hidden">
            <header className="px-6 pt-8 pb-6 flex-shrink-0 border-b border-slate-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
                            <Sparkles size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black tracking-tight text-slate-900 uppercase">Dodge AI</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Intelligence Engine</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-600 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="flex gap-1">
                    {['Traceability', 'Anomaly', 'Impact'].map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 bg-[#FAFBFF]/30 text-slate-800">
                <div className="flex items-center gap-3 mb-8 opacity-40">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication Serial Established</span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {messages.map((msg, i) => (msg.content && <Message key={i} msg={msg} />))}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 bg-white border-t border-slate-100">
                <div className="relative group mb-3">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Input query string..."
                        rows={1}
                        className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none shadow-sm"
                        style={{ maxHeight: 150 }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transform active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-slate-200"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <Terminal size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">v2.4.0-Stable</span>
                    </div>
                </div>
            </footer>
        </div>
    );
});

export default ChatPanel;
