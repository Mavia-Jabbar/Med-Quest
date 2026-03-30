import React, { useState } from 'react';
import { uploadMaterial } from '@/services/materialService';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const [formData, setFormData] = useState({
    title: "",
    subject: "Biology",
    unitTitle: "",
    type: "PDF Notes",
    sizeStr: "2.5 MB",
    url: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await uploadMaterial({
        title: formData.title,
        subject: formData.subject,
        unitId: formData.unitTitle.replace(/\s+/g, '-').toLowerCase(), // "Unit 1: Cell" -> "unit-1:-cell"
        unitTitle: formData.unitTitle,
        type: formData.type,
        size: formData.sizeStr,
        url: formData.url
      });
      setSuccess(true);
      // Reset only title and url so you can upload Unit 2 stuff rapidly
      setFormData({...formData, title: "", url: ""}); 
    } catch (err) {
      alert("Error uploading to Database");
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-lg bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40 dark:border-white/10 animate-in zoom-in-95 duration-700">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl">
            <UploadCloud size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Content Injector</h1>
            <p className="text-sm text-gray-500 font-medium">Auto-deploy Google Drive links to all students.</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-semibold text-sm">Successfully published to database!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
            >
              <option>Biology</option>
              <option>Chemistry</option>
              <option>Physics</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chapter / Unit Title</label>
            <input 
              required
              placeholder="e.g. Unit 1: Cell Biology"
              value={formData.unitTitle}
              onChange={(e) => setFormData({...formData, unitTitle: e.target.value})}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Material Title</label>
              <input 
                required
                placeholder="e.g. Fluid Mosaic Sheet"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Material Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option>PDF Notes</option>
                <option>Cheat Sheet</option>
                <option>Practice Test</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Google Drive "View" Link</label>
            <input 
              required
              type="url"
              placeholder="https://drive.google.com/file/d/XYZ123/view?usp=sharing"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">Link <strong className="text-red-400">must</strong> be set to "Anyone with the link can view".</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Deploying Code..." : "Publish to Student Syllabuses"}
          </button>
        </form>

      </div>
    </div>
  )
}
