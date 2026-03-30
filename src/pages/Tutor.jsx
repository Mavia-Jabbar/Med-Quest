import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, BrainCircuit, Dna, FlaskConical, Zap, RotateCcw, User } from 'lucide-react';
import { createChatSession, sendMessage } from '@/services/tutorService';
import { useFirebase } from '@/Context/firebase';

const SUBJECTS = [
  { key: 'Biology',   label: 'Biology',   icon: Dna,          color: 'emerald', prompt: 'Biology (Cell Biology, Genetics, Human Physiology, Ecology)' },
  { key: 'Chemistry', label: 'Chemistry', icon: FlaskConical, color: 'blue',    prompt: 'Chemistry (Organic, Inorganic, Physical, Thermodynamics)' },
  { key: 'Physics',   label: 'Physics',   icon: Zap,          color: 'fuchsia', prompt: 'Physics (Mechanics, Electromagnetism, Optics, Modern Physics)' },
];

const SUBJECT_STYLES = {
  emerald: { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/40', active: 'bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-500/30', dot: 'bg-emerald-500' },
  blue:    { pill: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40', active: 'bg-blue-500 text-white border-transparent shadow-lg shadow-blue-500/30', dot: 'bg-blue-500' },
  fuchsia: { pill: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 dark:border-fuchsia-800/40', active: 'bg-fuchsia-500 text-white border-transparent shadow-lg shadow-fuchsia-500/30', dot: 'bg-fuchsia-500' },
};

const STARTER_PROMPTS = {
  Biology:   ["Explain the sliding filament theory", "What is the difference between mitosis and meiosis?", "How does the immune system fight pathogens?"],
  Chemistry: ["Explain SN1 vs SN2 reactions", "What is Le Chatelier's principle?", "Explain hybridization with examples"],
  Physics:   ["What is the Doppler Effect?", "Explain Faraday's Law of Induction", "How does projectile motion work?"],
};

export default function Tutor() {
  const { userData } = useFirebase();
  const studentName = userData?.displayName || userData?.email?.split('@')[0] || 'Student';

  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [messages, setMessages] = useState([]); // { role: 'user'|'ai', text: string }
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // 1. Initialize a fresh Gemini chat session whenever the subject changes
  useEffect(() => {
    const session = createChatSession(studentName, selectedSubject.prompt);
    setChatSession(session);
    setMessages([]); // Clear history on subject switch (AI gets a fresh context)
  }, [selectedSubject, studentName]);

  // 2. Auto-scroll to bottom on every new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 3. Send Message Handler
  const handleSend = async (text) => {
    const messageText = (text || inputText).trim();
    if (!messageText || isLoading || !chatSession) return;

    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setIsLoading(true);

    try {
      const aiText = await sendMessage(chatSession, messageText);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "⚠️ I encountered an error connecting to my AI core. Please check your API key or try again shortly.",
        isError: true,
      }]);
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

  const handleNewChat = () => {
    const session = createChatSession(studentName, selectedSubject.prompt);
    setChatSession(session);
    setMessages([]);
    inputRef.current?.focus();
  };

  const styles = SUBJECT_STYLES[selectedSubject.color];

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-white dark:bg-[#09090b]">

      {/* ── TOP HEADER ────────────────────────────────────── */}
      <header className="shrink-0 border-b border-gray-200 dark:border-white/10 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50/80 dark:bg-black/60 backdrop-blur-md z-10">
        
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">MedIQ AI Tutor</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by Gemini 2.0 Flash · Full session memory</p>
          </div>
        </div>

        {/* Right: Subject Pills + Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {SUBJECTS.map((subj) => {
            const Icon = subj.icon;
            const s = SUBJECT_STYLES[subj.color];
            const isActive = selectedSubject.key === subj.key;
            return (
              <button
                key={subj.key}
                onClick={() => setSelectedSubject(subj)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-all duration-300 ${isActive ? s.active : s.pill}`}
              >
                <Icon size={14} />
                {subj.label}
              </button>
            );
          })}
          <button
            onClick={handleNewChat}
            title="Start new chat"
            className="ml-2 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-black/10 dark:hover:border-white/10"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* ── CHAT CANVAS ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">

        {/* Empty state: Starter Prompts */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <BrainCircuit className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Hello, {studentName}! 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md">
                I'm your personal MDCAT tutor. Ask me anything about {selectedSubject.label}, or pick a starter question below.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-md">
              {STARTER_PROMPTS[selectedSubject.key].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left px-5 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium text-sm"
                >
                  {prompt} →
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message Bubbles */}
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {msg.role === 'ai' ? (
                <div className="shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 mt-1">
                  <BrainCircuit size={18} className="text-white" />
                </div>
              ) : (
                <div className="shrink-0 w-9 h-9 rounded-2xl bg-gray-200 dark:bg-white/10 flex items-center justify-center mt-1">
                  <User size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[80%] md:max-w-[68%] px-5 py-4 rounded-3xl text-sm leading-relaxed font-medium whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-tl-sm'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing / Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 mt-1">
              <BrainCircuit size={18} className="text-white" />
            </div>
            <div className="px-5 py-4 rounded-3xl rounded-tl-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── INPUT BAR ────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-200 dark:border-white/10 p-4 md:p-6 bg-white/80 dark:bg-black/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Auto-grow textarea
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Ask anything about ${selectedSubject.label}...`}
              disabled={isLoading}
              className="w-full px-5 py-4 pr-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm font-medium leading-relaxed disabled:opacity-50"
              style={{ minHeight: '54px', maxHeight: '160px', overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold shadow-md ${
              inputText.trim() && !isLoading
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-110 shadow-black/20'
                : 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 dark:text-gray-400 font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 dark:text-gray-400 font-mono">Shift+Enter</kbd> for new line · Switch subject to refocus context
        </p>
      </div>
    </div>
  );
}
