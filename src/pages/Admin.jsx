import React, { useState } from 'react';
import { uploadMaterial, useMaterialsList, deleteMaterial } from '@/services/materialService';
import { UploadCloud, CheckCircle2, Trash2, FileText, ArrowLeft, ScrollText, ClipboardList, FileQuestion, LayoutList, BookOpen, Atom, Dna, Magnet } from 'lucide-react';
import ScienceLoader from '@/components/ui/ScienceLoader';
import { NavLink } from 'react-router';

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
  const { materialsList, loading: listLoading } = useMaterialsList();
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Biology',
    unitTitle: '',
    category: 'notes',
    type: 'PDF Notes',
    sizeStr: '',
    url: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeCat = CATEGORIES.find(c => c.value === formData.category) || CATEGORIES[0];

  const handleCategoryChange = (catValue) => {
    const cat = CATEGORIES.find(c => c.value === catValue);
    setFormData(prev => ({ ...prev, category: catValue, type: cat.types[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await uploadMaterial({
        title: formData.title,
        subject: formData.subject,
        unitId: formData.unitTitle.replace(/\s+/g, '-').toLowerCase(),
        unitTitle: formData.unitTitle,
        type: formData.type,
        size: formData.sizeStr,
        url: formData.url,
      });
      setSuccess(true);
      setFormData(prev => ({ ...prev, title: '', url: '', sizeStr: '' }));
    } catch {
      alert('Error uploading to Database');
    }
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This removes it from all student accounts.`)) {
      try { await deleteMaterial(id); }
      catch { alert('Error deleting. Check console.'); }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 font-sans">
      <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-[440px_1fr] lg:h-screen lg:overflow-hidden">

        {/* ═══ LEFT: Upload Form ═══ */}
        <div className="w-full h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-2xl">
          <div className="p-6 md:p-8 flex flex-col gap-6">

            {/* Back link */}
            <NavLink
              to="/Dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors w-max"
            >
              <ArrowLeft size={16} /> Dashboard
            </NavLink>

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 shadow-sm">
                <UploadCloud size={22} />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Content Injector</h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Deploy Google Drive documents to all students</p>
              </div>
            </div>

            {/* Success toast */}
            {success && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-2.5 animate-in slide-in-from-top-2 text-sm font-semibold">
                <CheckCircle2 size={18} className="flex-shrink-0" />
                Successfully published!
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Subject */}
              <div>
                <FormLabel>Subject</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {['Biology', 'Chemistry', 'Physics'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, subject: s }))}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        formData.subject === s
                          ? SUBJECT_COLORS[s] + ' border-current scale-[1.02] shadow-sm'
                          : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {s === 'Biology' ? <Dna size={14} /> : s === 'Chemistry' ? <Atom size={14} /> : <Magnet size={14} />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter / Unit */}
              <div>
                <FormLabel>Chapter / Unit Title</FormLabel>
                <InputField
                  required
                  placeholder="e.g. Unit 1: Cell Biology"
                  value={formData.unitTitle}
                  onChange={e => setFormData(prev => ({ ...prev, unitTitle: e.target.value }))}
                />
              </div>

              {/* Title + Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FormLabel>Document Title</FormLabel>
                  <InputField
                    required
                    placeholder="e.g. Cell Notes"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <FormLabel>File Size <span className="normal-case font-normal">(optional)</span></FormLabel>
                  <InputField
                    placeholder="e.g. 3.2 MB"
                    value={formData.sizeStr}
                    onChange={e => setFormData(prev => ({ ...prev, sizeStr: e.target.value }))}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <FormLabel>Category</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value} type="button"
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border-2 font-bold text-xs transition-all duration-200 ${
                        formData.category === cat.value ? cat.activeClass : cat.inactiveClass
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Format */}
              <div>
                <FormLabel>Document Format</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {activeCat.types.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                        formData.type === t
                          ? activeCat.typeActive + ' border-transparent shadow-sm scale-[1.02]'
                          : activeCat.typeInactive + ' border-transparent'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Google Drive URL */}
              <div>
                <FormLabel>Google Drive "View" Link</FormLabel>
                <InputField
                  required type="url"
                  placeholder="https://drive.google.com/file/d/…/view"
                  value={formData.url}
                  onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm tracking-wide hover:scale-[1.01] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : '🚀 Publish to Firebase'}
              </button>
            </form>
          </div>
        </div>

        {/* ═══ RIGHT: Live DB View ═══ */}
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Syllabus</h2>
              <p className="text-gray-400 mt-1 text-sm font-medium">All documents visible to students in real-time.</p>
            </div>
            <span className="px-3 py-1.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm">
              {materialsList.length} files
            </span>
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center h-48">
              <ScienceLoader text="Syncing Firebase..." />
            </div>
          ) : materialsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">Database is empty</h3>
              <p className="text-sm text-gray-400 mt-1">Use the form to publish your first document.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {materialsList.map((mat) => (
                <div
                  key={mat.id}
                  className="group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 flex items-start justify-between gap-3 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center mt-0.5 ${SUBJECT_COLORS[mat.subject] || 'bg-gray-100 text-gray-500'}`}>
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate leading-tight">{mat.title}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{mat.subject} · {mat.unitTitle}</p>
                      <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${TYPE_BADGE(mat.type)}`}>
                        {mat.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(mat.id, mat.title)}
                    className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
