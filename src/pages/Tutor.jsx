import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '@/Context/firebase';
import { subscribeToChatHistory, askAITutor } from '@/services/aiTutorService';
import { BrainCircuit, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import ScienceLoader from '@/components/ui/ScienceLoader';
import MagneticButton from '@/components/ui/MagneticButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Tutor({ hideHeader = false, contextualPrompt = "" }) {
  const { user, userData } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (contextualPrompt) setInput(contextualPrompt);
  }, [contextualPrompt]);
  
  // Real-time listener for Firestore Chat History
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribe = subscribeToChatHistory(user.uid, (history) => {
      setMessages(history);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userQuery = input.trim();
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      console.log("Asking AI Tutor...", { userQuery, historyLength: messages.length });
      await askAITutor(user.uid, userQuery, messages);
      console.log("AI Tutor Responded successfully.");
    } catch (err) {
      console.error("TUTOR ERROR UI CATCH:", err);
      setError(err.message || "Failed to respond. Check API keys.");
      alert(`AI Error: ${err.message || "Unknown error"}`);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptTexts) => {
    setInput(promptTexts);
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] md:h-full flex flex-col bg-white dark:bg-[#09090b] relative animate-in fade-in duration-700">
      
      {/* Tutor Header */}
      {!hideHeader && (
      <header className="h-16 shrink-0 border-b border-black/5 dark:border-white/10 px-3 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-black/50 backdrop-blur-xl z-20">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm flex-shrink-0">
               <BrainCircuit size={20} />
            </div>
            <div>
               <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Gemini Medical Tutor <Sparkles size={14} className="text-yellow-500 fill-yellow-500" /></h1>
               <p className="text-xs sm:text-sm font-medium text-green-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online and Ready</p>
            </div>
         </div>
      </header>
      )}

      {/* Main Chat Feed */}
      <div className="flex-1 overflow-y-auto w-full relative p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/30 dark:from-purple-950/20 dark:to-transparent">
         
         {messages.length === 0 && !isTyping && (
           <div className="h-full w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-700 pb-10 px-2">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-500">
                 <BrainCircuit size={36} />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 text-center">Hello, Dr. {userData?.name || 'Student'}.</h2>
              <p className="text-sm sm:text-lg text-gray-500 font-medium text-center max-w-xl mb-6 sm:mb-12 relative z-10">I am the MedQuest Gemini Advanced Intelligence. I have memorized every medical syllabus. What concept should we break down today?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl">
                {['Explain Meiosis vs Mitosis', 'How do I calculate pH?', "What is Newton's 3rd Law?"].map((q, i) => (
                  <button key={i} onClick={() => handleQuickPrompt(q)} className="p-3 sm:p-4 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group shadow-sm backdrop-blur-md">
                    <Sparkles size={14} className="text-primary mb-2 opacity-50 group-hover:opacity-100" />
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 block">{q}</span>
                  </button>
                ))}
              </div>
           </div>
         )}

         {messages.map((msg, idx) => {
           const isModel = msg.role === 'model';
           return (
             <div key={msg.id || idx} className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-4 duration-500`}>
               <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 md:p-5 text-left ${
                 isModel 
                   ? 'bg-white/90 dark:bg-[#111113]/90 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.8)] text-gray-800 dark:text-gray-200 rounded-tl-sm' 
                   : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl shadow-indigo-500/20 rounded-tr-sm border-0'
               }`}>
                  {isModel && (
                    <div className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border-b border-black/5 dark:border-white/5 pb-3">
                       <Sparkles size={16} className="fill-indigo-600 dark:fill-indigo-400" /> AI Medical Tutor
                    </div>
                  )}
                  {isModel ? (
                    <div className="prose prose-sm md:prose-base dark:prose-invert prose-indigo prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-indigo-500 max-w-none text-left">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed font-semibold text-[15px] md:text-base text-left">
                       {msg.text}
                    </div>
                  )}
               </div>
             </div>
           );
         })}

         {isTyping && (
            <div className="flex w-full justify-start animate-in fade-in">
               <div className="max-w-[85%] rounded-3xl p-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm rounded-tl-sm">
                  <div className="flex items-center gap-4 text-purple-600 font-bold uppercase text-xs tracking-widest">
                     <RefreshCw className="animate-spin" size={16} /> Retrieving Medical Data...
                  </div>
               </div>
            </div>
         )}
         
         <div ref={chatEndRef} />
      </div>

      {/* Input Composer Zone */}
      <div className="shrink-0 p-6 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 z-20">
         <div className="max-w-4xl mx-auto relative">
           
           {error && (
             <div className="absolute bottom-20 left-0 right-0 bg-red-100/90 border-2 border-red-500 dark:bg-red-900/90 text-red-600 dark:text-red-200 px-6 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-2xl z-50">
               <AlertCircle size={24} /> {error}
             </div>
           )}

           <form onSubmit={handleSend} className="relative flex items-center">
             <input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask anything about the MDCAT syllabus..."
               disabled={isTyping}
               className="w-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-500 rounded-full pl-6 pr-16 py-4 outline-none font-medium placeholder:text-gray-400 disabled:opacity-50 transition-colors shadow-inner"
             />
             <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <MagneticButton disabled={!input.trim() || isTyping} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-md shadow-primary/30">
                   <Send size={18} className="ml-0.5" />
                </MagneticButton>
             </div>
           </form>
         </div>
      </div>

    </div>
  );
}
