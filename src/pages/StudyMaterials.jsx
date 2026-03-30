import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, ChevronRight, FolderOpen, Dna, Atom, Magnet, Info } from 'lucide-react';
import ScienceLoader from '@/components/ui/ScienceLoader';
import MagneticButton from '@/components/ui/MagneticButton';
import { Button } from '@/components/ui/button';
import PDFViewerEngine from '@/components/study/PDFViewerEngine';
import { useFirebase } from '@/Context/firebase';
import { trackSubjectProgress } from '@/services/progressService';
import { useMaterialsList } from '@/services/materialService';

export default function StudyMaterials() {
  const { user } = useFirebase();
  const { materialsList, loading } = useMaterialsList();
  
  const [activeSubject, setActiveSubject] = useState("Biology");
  const [expandedUnits, setExpandedUnits] = useState([]);
  const [activePdf, setActivePdf] = useState(null);

  // Transform raw firestore documents into hierarchical syllabus tree
  const buildSyllabusTree = () => {
    const defaultStructure = [
      { subject: "Biology", icon: <Dna className="w-5 h-5 mr-2" />, units: [] },
      { subject: "Chemistry", icon: <Atom className="w-5 h-5 mr-2" />, units: [] },
      { subject: "Physics", icon: <Magnet className="w-5 h-5 mr-2" />, units: [] }
    ];

    materialsList.forEach((mat) => {
      const subjIndex = defaultStructure.findIndex(s => s.subject === mat.subject);
      if (subjIndex !== -1) {
        let unitIndex = defaultStructure[subjIndex].units.findIndex(u => u.title === mat.unitTitle);
        // Create unit if missing
        if (unitIndex === -1) {
          defaultStructure[subjIndex].units.push({
            id: mat.unitId || mat.unitTitle.replace(/\s+/g, '-').toLowerCase(),
            title: mat.unitTitle,
            description: "Topics Curated for MDCAT",
            materials: []
          });
          unitIndex = defaultStructure[subjIndex].units.length - 1;
        }
        // Push material into unit
        defaultStructure[subjIndex].units[unitIndex].materials.push({
          title: mat.title,
          type: mat.type || "PDF Notes",
          size: mat.size || "Unknown Size",
          url: mat.url
        });
      }
    });

    return defaultStructure;
  };

  const dynamicSyllabusData = buildSyllabusTree();
  const currentSubjectData = dynamicSyllabusData.find(s => s.subject === activeSubject);

  const handleOpenViewer = (material, subject) => {
    setActivePdf({ ...material, subject });
    if (user?.uid) {
      trackSubjectProgress(user.uid, subject, 2);
    }
  };

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  return (
    <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8 relative">
      
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-primary flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8" /> Syllabus Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm font-medium">
            Navigate the complete MDCAT syllabus dynamically loaded from the cloud.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 overflow-x-auto pb-2 scrollbar-none">
        {dynamicSyllabusData.map((sData) => (
          <button
            key={sData.subject}
            onClick={() => setActiveSubject(sData.subject)}
            className={`flex items-center px-6 py-3 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap shadow-sm
              ${activeSubject === sData.subject 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border border-transparent shadow-md transform scale-[1.02]' 
                : 'bg-white/40 dark:bg-black/40 text-gray-500 dark:text-gray-400 border border-white/20 hover:bg-white/70 dark:hover:bg-black/70 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            {sData.icon}
            {sData.subject}
          </button>
        ))}
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center py-20 animate-in fade-in h-64">
           <ScienceLoader text="Retrieving Syllabuses..." />
         </div>
      ) : currentSubjectData?.units.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 animate-in fade-in border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-white/30 dark:bg-black/20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
               <Info size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No {activeSubject} documents yet</h3>
            <p className="text-gray-500 font-medium mt-2">Check back later or deploy via the Admin panel!</p>
         </div>
      ) : (
        /* Accordion Tree */
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {currentSubjectData?.units.map((unit) => {
            const isExpanded = expandedUnits.includes(unit.id);
            return (
              <div key={unit.id} className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md group">
                
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-white/50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-4">
                    <div className={`p-2.5 sm:p-3 rounded-2xl flex-shrink-0 transition-colors hidden sm:flex ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-black/50 text-gray-500'}`}>
                      {isExpanded ? <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6" /> : <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-base sm:text-lg font-bold truncate transition-colors ${isExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                        {unit.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 truncate">{unit.description}</p>
                    </div>
                  </div>
                  <div className={`p-1.5 sm:p-2 flex-shrink-0 rounded-full transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-90 bg-gray-100 dark:bg-white/10' : 'bg-transparent text-gray-400'}`}>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>

                {/* Accordion Content (Materials) */}
                <div 
                  className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 py-4 px-5 border-t border-white/20 dark:border-white/5' : 'grid-rows-[0fr] opacity-0 py-0 px-5 border-t-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                      {unit.materials.map((mat, idx) => (
                        <div key={idx} className="flex flex-col p-4 rounded-2xl bg-white/60 dark:bg-black/50 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                              mat.type.includes('Cheat') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {mat.type}
                            </span>
                            <FileText className="w-4 h-4 text-gray-400" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-md mb-1 leading-snug">{mat.title}</h4>
                          <span className="text-xs text-gray-500 font-medium mb-5">{mat.size}</span>
                          
                          <MagneticButton 
                            onClick={() => handleOpenViewer(mat, currentSubjectData.subject)} 
                            className="w-full mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md rounded-xl font-bold py-2.5"
                          >
                            Open Viewer
                          </MagneticButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PDF Viewer Layer */}
      {activePdf && (
        <PDFViewerEngine 
          url={activePdf.url} 
          title={activePdf.title} 
          onClose={() => setActivePdf(null)} 
        />
      )}
    </div>
  );
}
