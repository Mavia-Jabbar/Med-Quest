import React, { useState } from 'react';
import { BookOpen, FileText, ChevronDown, ChevronRight, FolderOpen, Dna, Atom, Magnet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewerEngine from '@/components/study/PDFViewerEngine';
import { useFirebase } from '@/Context/firebase';
import { trackSubjectProgress } from '@/services/progressService';

const syllabusData = [
  {
    subject: "Biology",
    icon: <Dna className="w-5 h-5 mr-2" />,
    color: "emerald",
    units: [
      {
        id: "bio-unit-1",
        title: "Unit 1: Cell Biology",
        description: "Organelles, fluid mosaic, cellular transport",
        materials: [
          { title: "Fluid Mosaic Model", type: "Cheat Sheet", size: "1.2 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
          { title: "Cellular Respiration In-Depth", type: "PDF Notes", size: "3.4 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]
      },
      {
        id: "bio-unit-2",
        title: "Unit 2: Biochemistry",
        description: "Carbohydrates, lipids, proteins, and enzymes",
        materials: [
          { title: "Enzyme Kinetics Masterclass", type: "Cheat Sheet", size: "800 KB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]
      }
    ]
  },
  {
    subject: "Chemistry",
    icon: <Atom className="w-5 h-5 mr-2" />,
    color: "blue",
    units: [
      {
        id: "chem-unit-1",
        title: "Unit 1: Atomic Structure",
        description: "Bohr's model, quantum numbers, orbitals",
        materials: [
          { title: "Quantum Numbers Mastery", type: "PDF Notes", size: "2.1 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]
      },
      {
        id: "chem-unit-2",
        title: "Unit 2: Gases and Liquids",
        description: "Ideal gas law, kinetic molecular theory",
        materials: [
          { title: "Gas Laws Formulas", type: "Cheat Sheet", size: "500 KB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]
      }
    ]
  },
  {
    subject: "Physics",
    icon: <Magnet className="w-5 h-5 mr-2" />,
    color: "red",
    units: [
      {
        id: "phys-unit-1",
        title: "Unit 1: Force & Motion",
        description: "Newton's laws, projectiles, friction",
        materials: [
          { title: "Kinematics Formula Sheet", type: "Cheat Sheet", size: "1.0 MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]
      }
    ]
  }
];

export default function StudyMaterials() {
  const { user } = useFirebase();
  const [activeSubject, setActiveSubject] = useState("Biology");
  const [expandedUnits, setExpandedUnits] = useState(["bio-unit-1"]);
  const [activePdf, setActivePdf] = useState(null);

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

  const currentSubjectData = syllabusData.find(s => s.subject === activeSubject);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
      
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-primary" /> Syllabus Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
            Navigate the complete MDCAT syllabus. Tap a chapter to reveal PDF notes and cheat sheets.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 overflow-x-auto pb-2 scrollbar-none">
        {syllabusData.map((sData) => (
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

      {/* Accordion Tree */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {currentSubjectData?.units.map((unit) => {
          const isExpanded = expandedUnits.includes(unit.id);
          return (
            <div key={unit.id} className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md group">
              
              {/* Accordion Header */}
              <button 
                onClick={() => toggleUnit(unit.id)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/50 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl flex-shrink-0 transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-black/50 text-gray-500'}`}>
                    {isExpanded ? <FolderOpen className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                      {unit.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{unit.description}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-90 bg-gray-100 dark:bg-white/10' : 'bg-transparent text-gray-400'}`}>
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              </button>

              {/* Accordion Content (Materials) */}
              <div 
                className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 py-4 px-5 border-t border-white/20 dark:border-white/5' : 'grid-rows-[0fr] opacity-0'}`}
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
                        <span className="text-xs text-gray-500 font-medium mb-5">{mat.size} PDF</span>
                        
                        {/* Download button removed entirely! */}
                        <Button 
                          onClick={() => handleOpenViewer(mat, currentSubjectData.subject)} 
                          className="w-full mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] shadow-md border-none rounded-xl font-bold transition-transform"
                        >
                          Open Viewer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

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
