import React, { useState, useEffect, useRef } from 'react';
import { uploadMaterial, useMaterialsList, deleteMaterial } from '@/services/materialService';
import { UploadCloud, CheckCircle2, Trash2, FileText, ArrowLeft, ScrollText, ClipboardList, FileQuestion, LayoutList, BookOpen, Atom, Dna, Magnet, FolderOpen, Zap } from 'lucide-react';
import ScienceLoader from '@/components/ui/ScienceLoader';
import { NavLink } from 'react-router';
import { convertPdfToMockTest, fetchCustomMockTests, deleteCustomMockTest } from '@/services/aiMockTestService';
import { transcribePdfToMarkdown } from '@/services/aiTranscriptionService';

const CATEGORIES = [
  {
    label: 'Notes',
    value: 'notes',
    icon: <ScrollText size={18} />,
    activeClass: 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20',
    inactiveClass: 'bg-white dark:bg-black/30 text-gray-500 border-gray-200 dark:border-white/10 hover:border-blue-300 hover:text-blue-600',
    types: ['PDF Notes', 'Handwritten Notes', 'Lecture Slides', 'Revision Notes'],
    typeActive: 'bg-blue-600 text-white',
    typeInactive: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30',
  },
  {
    label: 'MCQs',
    value: 'mcqs',
    icon: <ClipboardList size={18} />,
    activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20',
    inactiveClass: 'bg-white dark:bg-black/30 text-gray-500 border-gray-200 dark:border-white/10 hover:border-emerald-300 hover:text-emerald-600',
    types: ['MCQ Bank', 'Topic MCQs', 'Chapter MCQs', 'Practice Test', 'Quiz'],
    typeActive: 'bg-emerald-600 text-white',
    typeInactive: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100',
  },
  {
    label: 'Past Papers',
    value: 'past-papers',
    icon: <FileQuestion size={18} />,
    activeClass: 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20',
    inactiveClass: 'bg-white dark:bg-black/30 text-gray-500 border-gray-200 dark:border-white/10 hover:border-purple-300 hover:text-purple-600',
    types: ['Past Paper', 'Past Paper (Solved)', 'Sample Paper', 'Model Paper'],
    typeActive: 'bg-purple-600 text-white',
    typeInactive: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100',
  },
  {
    label: 'Cheat Sheets',
    value: 'cheat-sheets',
    icon: <LayoutList size={18} />,
    activeClass: 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20',
    inactiveClass: 'bg-white dark:bg-black/30 text-gray-500 border-gray-200 dark:border-white/10 hover:border-orange-300 hover:text-orange-500',
    types: ['Cheat Sheet', 'Summary Sheet', 'Formula Sheet', 'Quick Reference'],
    typeActive: 'bg-orange-500 text-white',
    typeInactive: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100',
  },
];

const SUBJECT_COLORS = {
  Biology:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
  Chemistry: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
  Physics:   'bg-red-100 dark:bg-red-900/30 text-red-600',
};

const TYPE_BADGE = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('mcq') || t.includes('quiz') || t.includes('practice')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (t.includes('past') || t.includes('paper') || t.includes('sample') || t.includes('model')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
  if (t.includes('cheat') || t.includes('sheet') || t.includes('formula') || t.includes('reference')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
};

const FormLabel = ({ children }) => (
  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2">{children}</label>
);

const InputField = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all ${className}`}
    {...props}
  />
);

export default function Admin() {
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'mocktests'

  // ==================== MATERIALS STATE ==================== 
  const { materialsList, loading: listLoading } = useMaterialsList();
  const [formData, setFormData] = useState({
    title: '', subject: 'Biology', unitTitle: '', category: 'notes', type: 'PDF Notes', sizeStr: '', file: null
  });
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsSuccess, setMaterialsSuccess] = useState(false);
  const activeCat = CATEGORIES.find(c => c.value === formData.category) || CATEGORIES[0];

  // ==================== MOCKTEST STATE ====================
  const [mockTests, setMockTests] = useState([]);
  const [mockTestsLoading, setMockTestsLoading] = useState(true);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'mocktests') {
      loadMockTests();
    }
  }, [activeTab]);

  const loadMockTests = async () => {
    setMockTestsLoading(true);
    try {
      const tests = await fetchCustomMockTests();
      setMockTests(tests);
    } catch (e) {
      console.error(e);
    }
    setMockTestsLoading(false);
  };

  // --- MATERIAL HANDLERS ---
  const handleCategoryChange = (catValue) => {
    const cat = CATEGORIES.find(c => c.value === catValue);
    setFormData(prev => ({ ...prev, category: catValue, type: cat.types[0] }));
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a PDF document first.");
      return;
    }
    setMaterialsLoading(true); setMaterialsSuccess(false);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        
        try {
          const markdownContent = await transcribePdfToMarkdown(base64Data);
          
          await uploadMaterial({
            title: formData.title, 
            subject: formData.subject,
            unitId: formData.unitTitle.replace(/\s+/g, '-').toLowerCase(),
            unitTitle: formData.unitTitle, 
            type: formData.type, 
            size: formData.sizeStr, 
            content: markdownContent, // Send textual DB content!
            url: "" // Deprecate the URL field natively
          });

          setMaterialsSuccess(true);
          setFormData(prev => ({ ...prev, title: '', sizeStr: '', file: null }));
          if (document.getElementById('materialFileInput')) document.getElementById('materialFileInput').value = '';
        } catch(e) {
          console.error(e);
          alert('Error transcribing document to Markdown: ' + e.message);
        } finally {
          setMaterialsLoading(false);
        }
      };
      reader.readAsDataURL(formData.file);
    } catch { 
      alert('Error fetching file buffer.'); 
      setMaterialsLoading(false);
    }
  };

  const handleMaterialDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try { await deleteMaterial(id); } catch { alert('Error deleting.'); }
    }
  };

  // --- MOCKTEST HANDLERS ---
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setIsUploadingPdf(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        try {
          await convertPdfToMockTest(base64Data, file.name);
          alert("Successfully converted PDF to global Mock Test!");
          await loadMockTests(); // refresh directly
        } catch (err) {
          alert(`Error generating test: ${err.message}`);
        } finally {
          setIsUploadingPdf(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingPdf(false);
    }
  };

  const handleMockTestDelete = async (id, title) => {
    if (window.confirm(`Delete Custom Mock Test "${title}"? This permanently removes it for all students.`)) {
      try {
        await deleteCustomMockTest(id);
        setMockTests(prev => prev.filter(t => t.docId !== id));
      } catch {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 font-sans">
      <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-[440px_1fr] lg:h-screen lg:overflow-hidden">

        {/* ═══ LEFT PANE: Form + Tabs ═══ */}
        <div className="w-full h-full flex flex-col border-r border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-2xl">
          
          {/* Header & Tabs */}
          <div className="p-6 pb-4 shrink-0 border-b border-gray-200 dark:border-white/10">
            <NavLink to="/Dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors w-max mb-6">
              <ArrowLeft size={16} /> Dashboard
            </NavLink>

            <div className="flex bg-gray-100/80 dark:bg-white/5 p-1.5 rounded-2xl">
              <button onClick={() => setActiveTab('materials')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'materials' ? 'bg-white dark:bg-[#111113] text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>
                <FolderOpen size={16} /> Content
              </button>
              <button onClick={() => setActiveTab('mocktests')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mocktests' ? 'bg-white dark:bg-[#111113] text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>
                <Zap size={16} /> Mock Tests
              </button>
            </div>
          </div>

          {/* Left Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            
            {activeTab === 'materials' && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 shadow-sm">
                    <UploadCloud size={22} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Content Injector</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5 whitespace-nowrap">Upload PDFs to transcode into Study Spaces</p>
                  </div>
                </div>

                {materialsSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-sm font-semibold">
                    <CheckCircle2 size={18} /> Transcribed & Published Successfully!
                  </div>
                )}

                <form onSubmit={handleMaterialSubmit} className="flex flex-col gap-5">
                  <div>
                    <FormLabel>Subject</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {['Biology', 'Chemistry', 'Physics'].map(s => (
                        <button key={s} type="button" onClick={() => setFormData(prev => ({ ...prev, subject: s }))} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${formData.subject === s ? SUBJECT_COLORS[s] + ' border-current scale-[1.02] shadow-sm' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}>
                          {s === 'Biology' ? <Dna size={14} /> : s === 'Chemistry' ? <Atom size={14} /> : <Magnet size={14} />} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><FormLabel>Chapter / Unit Title</FormLabel><InputField required value={formData.unitTitle} onChange={e => setFormData(prev => ({ ...prev, unitTitle: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><FormLabel>Document Title</FormLabel><InputField required value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} /></div>
                    <div><FormLabel>File Size</FormLabel><InputField value={formData.sizeStr} onChange={e => setFormData(prev => ({ ...prev, sizeStr: e.target.value }))} /></div>
                  </div>
                  <div>
                    <FormLabel>Category</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat.value} type="button" onClick={() => handleCategoryChange(cat.value)} className={`flex items-center gap-2 py-3 px-2 rounded-xl border-2 font-bold text-xs ${formData.category === cat.value ? cat.activeClass : cat.inactiveClass}`}>{cat.icon} {cat.label}</button>
                      ))}
                    </div>
                  </div>
                  <div><FormLabel>Format</FormLabel><div className="grid grid-cols-2 gap-2">{activeCat.types.map(t => <button key={t} type="button" onClick={() => setFormData(prev => ({ ...prev, type: t }))} className={`px-3 py-2.5 rounded-xl text-xs font-bold border-2 ${formData.type === t ? activeCat.typeActive : activeCat.typeInactive}`}>{t}</button>)}</div></div>
                  
                  <div>
                    <FormLabel>Upload Raw Document</FormLabel>
                    <div className="flex bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden p-1.5">
                       <input id="materialFileInput" type="file" accept="application/pdf" className="text-sm font-medium ml-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setFormData(prev => ({ ...prev, file: e.target.files[0] }))} />
                    </div>
                  </div>

                  <button type="submit" disabled={materialsLoading} className="w-full py-3.5 mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm hover:scale-[1.01] shadow-lg disabled:opacity-50 inline-flex justify-center items-center gap-2">
                    {materialsLoading ? <ScienceLoader text="Transcribing via AI..." /> : '🚀 Transcribe & Publish Study Space'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'mocktests' && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500 h-full">
                 <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-sm">
                    <Zap size={22} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">AI Test Injector</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Parse PDFs directly into global mock tests</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all p-8 cursor-pointer text-center group" onClick={() => fileInputRef.current?.click()}>
                   {isUploadingPdf ? (
                     <ScienceLoader text="Generating Test..." />
                   ) : (
                     <>
                        <UploadCloud size={48} className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Test PDF</h3>
                        <p className="text-sm font-medium text-gray-500">Gemini AI will automatically scan this file, extract ticked MCQs, and publish it globally to all students instantly.</p>
                     </>
                   )}
                   <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handlePdfUpload} disabled={isUploadingPdf} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ═══ RIGHT PANE: Live DB View ═══ */}
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-transparent">
          
          {activeTab === 'materials' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Materials</h2>
                  <p className="text-gray-400 mt-1 text-sm font-medium">All transcribed Study Spaces served globally.</p>
                </div>
                <span className="px-3 py-1.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 shadow-sm">{materialsList.length} items</span>
              </div>
              
              {listLoading ? <div className="h-48 flex items-center justify-center"><ScienceLoader text="Syncing..." /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {materialsList.map((mat) => (
                    <div key={mat.id} className="group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 flex items-start justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center mt-0.5 ${SUBJECT_COLORS[mat.subject] || 'bg-gray-100 text-gray-500'}`}>
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{mat.title}</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{mat.subject}</p>
                        </div>
                      </div>
                      <button onClick={() => handleMaterialDelete(mat.id, mat.title)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mocktests' && (
             <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active AI Tests</h2>
                  <p className="text-gray-400 mt-1 text-sm font-medium">All PDF-extracted Mock Tests globally available.</p>
                </div>
                <span className="px-3 py-1.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 shadow-sm">{mockTests.length} tests</span>
              </div>

              {mockTestsLoading ? <div className="h-48 flex items-center justify-center"><ScienceLoader text="Loading Library..." /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTests.map((test) => (
                    <div key={test.docId} className="group bg-white dark:bg-[#111113] border border-primary/20 rounded-3xl p-5 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
                       <div className="flex items-start justify-between">
                         <div>
                           <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{test.title}</h4>
                           <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md mt-2">{test.questions?.length || 0} MCQs • {test.durationMinutes} Min</span>
                         </div>
                         <button onClick={() => handleMockTestDelete(test.docId, test.title)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-2 bg-red-50 dark:bg-red-500/10 rounded-xl transition-all">
                           <Trash2 size={16} />
                         </button>
                       </div>
                       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 line-clamp-2">{test.description}</p>
                    </div>
                  ))}
                  {mockTests.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center text-gray-500 font-medium">
                       No AI Mock Tests generated yet. Upload a PDF on the left.
                    </div>
                  )}
                </div>
              )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
