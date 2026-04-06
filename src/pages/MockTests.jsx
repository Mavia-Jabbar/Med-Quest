import React, { useState, useEffect } from 'react';
import { updateSubjectMastery } from '@/services/progressService';
import { useFirebase } from '@/Context/firebase';
import { BrainCircuit, Clock, ChevronRight, ChevronLeft, Award, FileText, CheckCircle2, XCircle } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import ScienceLoader from '@/components/ui/ScienceLoader';
import { fetchCustomMockTests } from '@/services/aiMockTestService';

export default function MockTests() {
  const { userData } = useFirebase();
  
  // View States: 'menu' | 'active' | 'results'
  const [view, setView] = useState('menu');
  const [activeTest, setActiveTest] = useState(null);
  
  // Tests State
  const [allTests, setAllTests] = useState({});
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  
  // Active Test States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Results State
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });

  // Load Global Custom Tests from Firebase ONLY
  useEffect(() => {
    const loadTests = async () => {
      try {
        const customTests = await fetchCustomMockTests();
        const testsObj = {};
        customTests.forEach((test) => {
           testsObj[`Custom_${test.docId}`] = test;
        });
        setAllTests(testsObj);
      } catch (err) {
        console.error("Failed to load global tests", err);
      } finally {
         setIsLoadingTests(false);
      }
    };
    loadTests();
  }, []);

  // TIMER LOGIC
  useEffect(() => {
    let timer;
    if (view === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteTest(); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ACTIONS
  const handleStartTest = (subjectKey) => {
    const test = allTests[subjectKey];
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
      if (!activeTest.subjectKey.startsWith("Custom_")) {
        await updateSubjectMastery(userData.uid, activeTest.subjectKey, rawPercentage);
      }
    }
    setView('results');
  };

  // RENDERERS
  
  if (view === 'menu') {
    if (isLoadingTests) {
      return (
        <div className="flex-1 w-full h-full flex items-center justify-center">
           <ScienceLoader text="Loading Active Engine..." />
        </div>
      );
    }

    return (
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Assessment Engine</h1>
            <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto font-medium">Select an MDCAT subject test below to begin your timed assessment.</p>
          </div>

          {Object.keys(allTests).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl text-center">
               <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Tests Available</h3>
               <p className="text-gray-500 font-medium">Please wait for the platform Administrators to deploy a PDF test matrix.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Object.keys(allTests).map((subjectKey) => {
                const test = allTests[subjectKey];
                
                return (
                  <div key={subjectKey} className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer relative overflow-hidden" onClick={() => handleStartTest(subjectKey)}>
                    <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-md text-primary text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-bl-2xl border-l border-b border-primary/20">GLOBAL PUBLISHED</div>
                    <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-lg bg-primary text-white group-hover:scale-110 transition-transform">
                       <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 truncate">{test.title || subjectKey}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6 flex-1 line-clamp-2">{test.description}</p>
                    
                    <div className="flex items-center justify-between text-sm font-bold border-t border-black/5 dark:border-white/5 pt-4">
                       <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Clock size={16} /> {test.durationMinutes} Min</span>
                       <span className="text-primary">{test.questions?.length || 0} MCQs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'active') {
    const q = activeTest.questions[currentQuestionIdx];
    const isAnswered = answers[currentQuestionIdx] !== undefined;

    return (
      <div className="flex-1 w-full flex flex-col h-full bg-white dark:bg-[#09090b] animate-in slide-in-from-bottom-8 duration-700">
        <header className="min-h-14 lg:min-h-16 border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-black/50 backdrop-blur-md z-10 w-full py-3 lg:py-0">
           <div>
             <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{activeTest.title}</h2>
             <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wide uppercase">Question {currentQuestionIdx + 1} of {activeTest.questions.length}</p>
           </div>
           
           <div className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full font-bold tracking-widest text-base sm:text-lg shadow-sm border self-end sm:self-auto ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-500/30' : 'bg-white dark:bg-white/10 text-gray-800 dark:text-white border-black/5 dark:border-white/5'}`}>
             <Clock className={timeLeft < 300 ? "animate-pulse" : ""} size={18} />
             {formatTime(timeLeft)}
           </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative">
           <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 pb-32 lg:pb-10 relative">
             <div className="max-w-3xl mx-auto">
               <h3 className="text-lg sm:text-2xl md:text-3xl font-medium leading-tight text-gray-900 dark:text-white mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-black/5 dark:border-white/5 whitespace-pre-wrap">
                 {q.text}
               </h3>

               <div className="space-y-4">
                 {q.options.map((optionText, idx) => {
                   const isSelected = answers[currentQuestionIdx] === idx;
                   return (
                     <button 
                       key={idx}
                       onClick={() => handleSelectAnswer(idx)}
                       className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex items-center gap-4 sm:gap-5 ${
                         isSelected 
                          ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(79,70,229,0.15)] scale-[1.01]' 
                          : 'border-transparent bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:border-black/5 dark:hover:border-white/10 mb-2 sm:mb-0'
                       }`}
                     >
                       <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-colors ${isSelected ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-black text-gray-500 shadow-sm border border-black/5 dark:border-white/10'}`}>
                         {String.fromCharCode(65 + idx)}
                       </div>
                       <span className={`text-base sm:text-lg font-medium leading-relaxed ${isSelected ? 'text-gray-900 dark:text-white' : ''}`}>{optionText}</span>
                     </button>
                   );
                 })}
               </div>
             </div>
           </div>

           {/* Mobile Floating Actions */}
           <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 flex gap-3">
             <button 
               disabled={currentQuestionIdx === 0}
               onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
               className="flex-1 h-14 bg-gray-100 dark:bg-white/10 rounded-2xl font-bold text-gray-700 dark:text-gray-200 disabled:opacity-30 flex items-center justify-center"
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               disabled={currentQuestionIdx === activeTest.questions.length - 1}
               onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
               className="flex-[2] h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:hidden"
             >
               Next Question <ChevronRight size={20} />
             </button>
             {currentQuestionIdx === activeTest.questions.length - 1 && (
               <button onClick={handleCompleteTest} className="flex-[2] h-14 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-500/30 flex items-center justify-center">
                 SUBMIT
               </button>
             )}
           </div>

           {/* Desktop Sidebar Navigation */}
           <div className="hidden lg:flex w-80 border-l border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50 p-6 flex-col justify-between shrink-0 h-full">
             <div className="overflow-y-auto max-h-[60vh] pr-2">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 sticky top-0 bg-gray-50 dark:bg-[#111113] py-2 z-10">Exam Navigation</h4>
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

             <div className="mt-8 space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
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
      <div className="flex-1 w-full h-full flex flex-col bg-white dark:bg-[#09090b] overflow-y-auto relative animate-in slide-in-from-bottom-8 duration-700 pb-20">
        
        {/* Results Header */}
        <div className="w-full bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/20 dark:to-emerald-950/20 border-b border-gray-200 dark:border-white/10 p-10 md:p-14 text-center">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-8 shadow-2xl mb-8 transition-transform hover:scale-105 ${score.percentage >= 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-800/40' : score.percentage >= 50 ? 'bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/30 dark:border-orange-800/40' : 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/30 dark:border-red-800/40'}`}>
              <span className="text-4xl font-black">{score.percentage}%</span>
           </div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Diagnostics Complete!</h2>
           <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-xl mx-auto">You scored <strong>{score.correct}</strong> out of <strong>{score.total}</strong> on the {activeTest.title}. Review your exact mistakes below.</p>
           
           <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
             <button onClick={() => setView('menu')} className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-105 transition-transform rounded-2xl font-bold shadow-xl">
                Exit Engine
             </button>
           </div>
        </div>

        {/* Review Payload Mapping */}
        <div className="max-w-4xl mx-auto w-full p-6 md:p-10 space-y-12">
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4 mb-4">
               <h3 className="text-xl font-black text-gray-900 dark:text-white">Exam Review</h3>
               <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-500 tracking-wider">PAPER TRACE</span>
            </div>

            {activeTest.questions.map((q, qIndex) => {
               const userAnswer = answers[qIndex];
               const isMissed = userAnswer !== q.correctAnswer;
               
               return (
                 <div key={qIndex} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
                   
                   <div className="flex items-start gap-4 mb-6">
                      <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full font-black text-white shadow-md ${!isMissed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {qIndex + 1}
                      </div>
                      <h4 className="text-lg md:text-xl font-semibold leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
                        {q.text}
                      </h4>
                   </div>

                   <div className="space-y-3 pl-12">
                      {q.options.map((optText, optIdx) => {
                         const isChosen = userAnswer === optIdx;
                         const isCorrect = q.correctAnswer === optIdx;
                         
                         // Compute Dynamic Styling
                         let styleClass = "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400";
                         let icon = null;

                         if (isCorrect) {
                           styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20 ring-offset-2 dark:ring-offset-[#09090b]";
                           icon = <CheckCircle2 size={20} className="text-emerald-500" />;
                         } else if (isChosen && !isCorrect) {
                           styleClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 shadow-sm";
                           icon = <XCircle size={20} className="text-red-500" />;
                         }

                         return (
                           <div key={optIdx} className={`w-full p-4 rounded-xl border-2 flex items-center justify-between gap-4 transition-all ${styleClass}`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${isCorrect ? 'bg-emerald-500 text-white' : isChosen ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-black text-gray-400'}`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="text-sm md:text-base font-medium">{optText}</span>
                              </div>
                              {icon}
                           </div>
                         );
                      })}
                   </div>

                   {/* AI Generated Explanation Block if parsed */}
                   {q.explanation && (
                     <div className="mt-6 ml-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-500/30">
                       <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                         <strong className="text-blue-900 dark:text-blue-100 uppercase tracking-widest text-[10px] block mb-1.5">AI Inference</strong>
                         {q.explanation}
                       </p>
                     </div>
                   )}
                 </div>
               );
            })}
        </div>
      </div>
    );
  }

  return null;
}
