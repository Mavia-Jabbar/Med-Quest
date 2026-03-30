import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '@/services/tutorService';
import { BrainCircuit, Send, Trash2, Dna, FlaskConical, Zap, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = [
  { label: 'Biology', icon: Dna, color: 'emerald' },
  { label: 'Chemistry', icon: FlaskConical, color: 'blue' },
  { label: 'Physics', icon: Zap, color: 'fuchsia' },
  { label: 'English', icon: BookOpen, color: 'amber' },
];

const QUICK_PROMPTS = [
  "Explain the sliding filament theory",
  "What is Gibbs Free Energy?",
  "Derive equations of motion",
  "Difference between mitosis and meiosis",
];

// Simple inline markdown renderer for bold, bullet points
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-xs">$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
        <BrainCircuit size={16} className="text-white" />
      </div>
      <div className="bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Tutor() {
  const [activeSubject, setActiveSubject] = useState('Biology');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textOverride) => {
    const text = textOverride || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiText = await sendMessageToAI(updatedMessages, activeSubject);
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    setMessages([]);
    setError(null);
  };

  const subjectData = SUBJECTS.find(s => s.label === activeSubject);
  const colorMap = {
    emerald: { btn: 'bg-emerald-500 text-white shadow-emerald-500/30', ring: 'ring-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    blue:    { btn: 'bg-blue-500 text-white shadow-blue-500/30', ring: 'ring-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    fuchsia: { btn: 'bg-fuchsia-500 text-white shadow-fuchsia-500/30', ring: 'ring-fuchsia-500', badge: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' },
    amber:   { btn: 'bg-amber-500 text-white shadow-amber-500/30', ring: 'ring-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  };
  const currentColor = colorMap[subjectData?.color] || colorMap.blue;

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-gray-50/50 dark:bg-[#09090b]">
      
      {/* ─── Header ─── */}
      <div className="shrink-0 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-2xl px-6 py-4 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-5xl mx-auto w-full">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">MedAI Tutor</h1>
              <p className="text-xs text-gray-500 font-medium">Powered by Google Gemini</p>
            </div>
          </div>

          {/* Subject Selector Pills */}
          <div className="flex gap-2 flex-wrap">
            {SUBJECTS.map(({ label, icon: Icon, color }) => {
              const isActive = activeSubject === label;
              return (
                <button
                  key={label}
                  onClick={() => handleSubjectChange(label)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-300 border ${
                    isActive
                      ? `${colorMap[color].btn} shadow-lg border-transparent`
                      : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Clear Button */}
          {messages.length > 0 && (
            <button onClick={handleClearChat} className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ─── Chat Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-6 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full space-y-6">

          {/* Empty State */}
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col items-center justify-center py-16 text-center gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                <Sparkles size={36} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ask MedAI Anything</h2>
                <p className="text-gray-500 font-medium max-w-sm">Currently focused on <strong className={currentColor.badge.includes('emerald') ? 'text-emerald-600' : 'text-indigo-600'}>{activeSubject}</strong>. Switch subjects using the pills above.</p>
              </div>

              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-4 py-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    {prompt} →
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message Bubbles */}
          <AnimatePresence>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
                      <BrainCircuit size={16} className="text-white" />
                    </div>
                  )}
                  
                  {/* Bubble */}
                  <div className={`max-w-[80%] px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed font-medium ${ 
                    isUser 
                      ? 'bg-primary text-white rounded-br-sm shadow-indigo-500/20'
                      : 'bg-white/90 dark:bg-white/10 text-gray-800 dark:text-gray-100 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-bl-sm'
                  }`}>
                    {isUser 
                      ? msg.text 
                      : <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                    }
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* API Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ─── Input Bar ─── */}
      <div className="shrink-0 border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-2xl p-4 md:p-6">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex gap-3 items-end bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.4)] transition-shadow duration-300">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${activeSubject}... (Enter to send)`}
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 font-medium leading-relaxed max-h-32 self-center"
              style={{ fieldSizing: 'content' }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="w-9 h-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">MedAI can make mistakes. Always verify critical medical facts.</p>
        </div>
      </div>
    </div>
  );
}
