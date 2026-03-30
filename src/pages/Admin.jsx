import React, { useState } from 'react';
import { uploadMaterial, useMaterialsList, deleteMaterial } from '@/services/materialService';
import { UploadCloud, CheckCircle2, Trash2, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';

export default function Admin() {
  const { materialsList, loading: listLoading } = useMaterialsList();
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

  // UPLOAD HANDLER
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
        url: formData.url
      });
      setSuccess(true);
      setFormData({...formData, title: "", url: ""}); 
    } catch (err) {
      alert("Error uploading to Database");
    }
    setLoading(false);
  };

  // DELETE HANDLER
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to completely erase "${title}"? This will vanish from all student accounts.`)) {
      try {
        await deleteMaterial(id);
      } catch (err) {
        alert("Error deleting file. Check console.");
      }
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-[450px_1fr] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black overflow-hidden font-sans">
      
      {/* ⚠️ LEFT PANEL: Injector Form */}
      <div className="h-full overflow-y-auto p-8 lg:p-10 border-r border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/60 backdrop-blur-3xl flex flex-col relative z-20 shadow-xl shadow-black/5">
        
        <NavLink to="/Dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-10 w-max">
           <ArrowLeft size={16} /> Return to Dashboard
        </NavLink>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl">
            <UploadCloud size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Content Injector</h1>
            <p className="text-sm text-gray-500 font-medium">Auto-deploy Google Drive links.</p>
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
              className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
              <input 
                required
                placeholder="Fluid Mosaic"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
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
              placeholder="https://drive.google.com/file/d/XYZ123/view"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-black/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Deploying Code..." : "Publish to Firebase"}
          </button>
        </form>
      </div>

      {/* ⚠️ RIGHT PANEL: Live Database View */}
      <div className="h-full overflow-y-auto p-8 lg:p-12 relative z-10">
        
        <div className="flex items-center justify-between mb-8">
           <div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Active Syllabus</h2>
             <p className="text-gray-500 mt-2 font-medium">Real-time view of all documents visible to students natively.</p>
           </div>
           <div className="px-4 py-2 bg-white/50 dark:bg-black/40 rounded-full border border-black/5 dark:border-white/5 shadow-sm text-sm font-bold text-gray-600 dark:text-gray-300">
              {materialsList.length} Files Hosted
           </div>
        </div>

        {listLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
               <p className="text-gray-500 font-medium">Synchronizing with Google Cloud...</p>
            </div>
        ) : materialsList.length === 0 ? (
            <div className="w-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-white/30 dark:bg-black/20">
               <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Database is Empty</h3>
               <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm max-w-xs text-center">Use the injector panel to securely deploy your first Google Drive document.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materialsList.map((mat) => (
                <div key={mat.id} className="bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow group">
                   <div className="flex gap-4">
                      <div className={`p-3 rounded-xl mt-1 flex-shrink-0 ${mat.subject === 'Biology' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : mat.subject === 'Chemistry' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                         <FileText size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{mat.title}</h4>
                         <p className="text-xs text-gray-500 font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2">
                           <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span> 
                           {mat.subject}
                           <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span> 
                           {mat.unitTitle}
                         </p>
                         <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-3 opacity-80">{mat.type}</p>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => handleDelete(mat.id, mat.title)}
                     className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110 flex-shrink-0"
                     title="Permanently Delete"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
              ))}
            </div>
        )}
      </div>

    </div>
  )
}
