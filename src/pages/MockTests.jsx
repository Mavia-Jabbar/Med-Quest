import React, { useState, useEffect } from 'react';
import { MOCK_TESTS } from '@/data/mockTestsData';
import { updateSubjectMastery } from '@/services/progressService';
import { useFirebase } from '@/Context/firebase';
import { BrainCircuit, Clock, ChevronRight, ChevronLeft, Flag, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function MockTests() {
  const { userData } = useFirebase();
  
  // View States: 'menu' | 'active' | 'results'
  const [view, setView] = useState('menu');
  const [activeTest, setActiveTest] = useState(null);
  
  // Active Test States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  
  // Results State
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });

  // 1. TIMER LOGIC
  useEffect(() => {
    let timer;
    if (view === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteTest(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  // Format Timer "MM:SS"
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 2. ACTIONS
  const handleStartTest = (subjectKey) => {
    const test = MOCK_TESTS[subjectKey];
    setActiveTest({ ...test, subjectKey });
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(test.durationMinutes * 60);
    setView('active');
  };

  const handleSelectAnswer = (optIndex) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIndex }));
  };

  const handleCompleteTest = async () => {
    // Calculate final grade
    let correctCount = 0;
    const totalCount = activeTest.questions.length;
    
    activeTest.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const rawPercentage = Math.round((correctCount / totalCount) * 100);
    setScore({ correct: correctCount, total: totalCount, percentage: rawPercentage });
    
    // Upload Telemetry to Firestore dynamically
    if (userData?.uid && activeTest?.subjectKey) {
      await updateSubjectMastery(userData.uid, activeTest.subjectKey, rawPercentage);
    }
    
    setView('results');
  };

  // 3. RENDERERS
  
  if (view === 'menu') {
    return (
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Assessment Engine</h1>
            <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto font-medium">Select a highly-calibrated MDCAT subject test. Your time is restricted and your score will instantly update your Dashboard Mastery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(MOCK_TESTS).map((subjectKey) => {
              const test = MOCK_TESTS[subjectKey];
              const isBio = subjectKey === 'Biology';
              const isChem = subjectKey === 'Chemistry';
              
              return (
                <div key={subjectKey} className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => handleStartTest(subjectKey)}>
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-lg ${isBio ? 'bg-emerald-500 text-white' : isChem ? 'bg-blue-500 text-white' : 'bg-fuchsia-500 text-white'} group-hover:scale-110 transition-transform`}>
                     <Award size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{subjectKey} MDCAT</h3>
                  <p className="text-sm text-gray-500 font-medium mb-6 flex-1">{test.description}</p>
                  
                  <div className="flex items-center justify-between text-sm font-bold border-t border-black/5 dark:border-white/5 pt-4">
                     <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Clock size={16} /> {test.durationMinutes} Min</span>
                     <span className="text-primary">{test.questions.length} MCQs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'active') {
    const q = activeTest.questions[currentQuestionIdx];
    const isAnswered = answers[currentQuestionIdx] !== undefined;

    return (
      <div className="flex-1 w-full flex flex-col h-full bg-white dark:bg-[#09090b] animate-in slide-in-from-bottom-8 duration-700">
        {/* Exam Header */}
        <header className="min-h-14 border-b border-gray-200 dark:border-white/10 px-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 bg-gray-50 dark:bg-black/50 backdrop-blur-md z-10 w-full gap-2 py-3 sm:py-0">
           <div>
             <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{activeTest.title}</h2>
             <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wide uppercase">Question {currentQuestionIdx + 1} of {activeTest.questions.length}</p>
           </div>
           
           <div className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full font-bold tracking-widest text-base sm:text-lg shadow-sm border self-end sm:self-auto ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-500/30' : 'bg-white dark:bg-white/10 text-gray-800 dark:text-white border-black/5 dark:border-white/5'}`}>
             <Clock className={timeLeft < 300 ? "animate-pulse" : ""} size={18} />
             {formatTime(timeLeft)}
           </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
           
           {/* LEFT Pane: MCQ Canvas */}
           <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 relative">
             <div className="max-w-3xl mx-auto">
               
               {/* The Question */}
               <h3 className="text-lg sm:text-2xl md:text-3xl font-medium leading-tight text-gray-900 dark:text-white mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-black/5 dark:border-white/5">
                 {q.text}
               </h3>

               {/* The Options */}
               <div className="space-y-3">
                 {q.options.map((optionText, idx) => {
                   const isSelected = answers[currentQuestionIdx] === idx;
                   return (
                     <button 
                       key={idx}
                       onClick={() => handleSelectAnswer(idx)}
                       className={`w-full text-left p-3 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 sm:gap-5 ${
                         isSelected 
                          ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(79,70,229,0.15)] scale-[1.01]' 
                          : 'border-transparent bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:border-black/5 dark:hover:border-white/10'
                       }`}
                     >
                       <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white dark:bg-black text-gray-500 shadow-sm border border-black/5 dark:border-white/10'}`}>
                         {String.fromCharCode(65 + idx)}
                       </div>
                       <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-gray-900 dark:text-white' : ''}`}>{optionText}</span>
                     </button>
                   );
                 })}
               </div>

             </div>
           </div>

           {/* RIGHT Pane: Navigation Menu */}
           <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50 p-6 flex flex-col justify-between shrink-0">
             
             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Exam Navigation</h4>
               <div className="grid grid-cols-5 gap-3">
                 {activeTest.questions.map((_, i) => (
                   <button 
                     key={i} 
                     onClick={() => setCurrentQuestionIdx(i)}
                     className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                       currentQuestionIdx === i ? 'ring-2 ring-primary bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 
                       answers[i] !== undefined ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-500/30' : 
                       'bg-white dark:bg-white/5 text-gray-500 border border-black/5 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                     }`}
                   >
                     {i + 1}
                   </button>
                 ))}
               </div>
             </div>

             <div className="mt-10 space-y-4">
               <div className="flex gap-4">
                 <button 
                   disabled={currentQuestionIdx === 0}
                   onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                   className="flex-1 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                 >
                   <ChevronLeft size={20} /> Prev
                 </button>
                 <button 
                   disabled={currentQuestionIdx === activeTest.questions.length - 1}
                   onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                   className="flex-1 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                 >
                   Next <ChevronRight size={20} />
                 </button>
               </div>
               
               <MagneticButton onClick={handleCompleteTest} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20 rounded-2xl font-black tracking-widest hover:scale-[1.02]">
                  SUBMIT EXAM
               </MagneticButton>
             </div>

           </div>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center overflow-y-auto p-6 relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-black dark:to-blue-950/20">
        <div className="w-full max-w-2xl bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] p-10 md:p-16 text-center animate-in zoom-in-50 duration-700 fade-in slide-in-from-bottom-20">
           
           <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-8 shadow-2xl mb-8 ${score.percentage >= 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-800/40' : score.percentage >= 50 ? 'bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/30 dark:border-orange-800/40' : 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/30 dark:border-red-800/40'}`}>
              <span className="text-4xl font-black">{score.percentage}%</span>
           </div>

           <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Exam Completed!</h2>
           <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-10">You scored <strong>{score.correct}</strong> out of <strong>{score.total}</strong> on the {activeTest.title} assessment. Your global Gamification Mastery has been permanently locked into the Cloud.</p>

           <div className="grid grid-cols-2 gap-4">
             <button onClick={() => setView('menu')} className="py-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-2xl font-bold text-gray-700 dark:text-gray-200 transition-colors">
                Return to Menu
             </button>
             <button onClick={() => window.location.href = '/Dashboard'} className="py-4 bg-gray-900 dark:bg-white hover:scale-105 transition-transform text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl">
                View Dashboard Mastery
             </button>
           </div>
        </div>
      </div>
    );
  }

  return null;
}
