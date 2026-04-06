import React, { useState } from 'react';
import { BookOpen, FileText, ChevronRight, FolderOpen, Dna, Atom, Magnet, Info, ClipboardList, FileQuestion, ScrollText, Search } from 'lucide-react';
import ScienceLoader from '@/components/ui/ScienceLoader';
import MagneticButton from '@/components/ui/MagneticButton';
import StudySpaceViewer from '@/components/study/StudySpaceViewer';
import { useFirebase } from '@/Context/firebase';
import { trackSubjectProgress } from '@/services/progressService';
import { useMaterialsList } from '@/services/materialService';

// Content type categories with icons + colors
const CONTENT_TYPES = [
  { label: 'Notes',       value: 'notes',       icon: <ScrollText size={14} />,    color: 'bg-blue-600 text-white',    inactive: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/30' },
  { label: 'MCQs',        value: 'mcqs',        icon: <ClipboardList size={14} />, color: 'bg-emerald-600 text-white', inactive: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100' },
  { label: 'Past Papers', value: 'past-papers', icon: <FileQuestion size={14} />, color: 'bg-purple-600 text-white',   inactive: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100' },
  { label: 'Cheat Sheets',value: 'cheat-sheets',icon: <FileText size={14} />,     color: 'bg-orange-500 text-white',  inactive: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 hover:bg-orange-100' },
];

// Map Firestore type strings → filter category
const typeToCategory = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('mcq') || t.includes('quiz') || t.includes('practice test')) return 'mcqs';
  if (t.includes('past') || t.includes('paper')) return 'past-papers';
  if (t.includes('cheat') || t.includes('sheet')) return 'cheat-sheets';
  return 'notes'; // default: PDF Notes, Notes, etc.
};

// Badge colors per type
const badgeStyle = (type = '') => {
  const cat = typeToCategory(type);
  if (cat === 'mcqs')         return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (cat === 'past-papers')  return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
  if (cat === 'cheat-sheets') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
};

export default function StudyMaterials() {
  const { user } = useFirebase();
  const { materialsList, loading } = useMaterialsList();

  const [activeSubject, setActiveSubject] = useState('Biology');
  const [activeTypeFilter, setActiveTypeFilter] = useState('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnits, setExpandedUnits] = useState([]);
  const [activePdf, setActivePdf] = useState(null);

  // Build hierarchical tree from flat Firestore list
  const buildSyllabusTree = () => {
    const defaultStructure = [
      { subject: 'Biology',   icon: <Dna className="w-4 h-4 mr-1.5" />,    units: [] },
      { subject: 'Chemistry', icon: <Atom className="w-4 h-4 mr-1.5" />,   units: [] },
      { subject: 'Physics',   icon: <Magnet className="w-4 h-4 mr-1.5" />, units: [] },
    ];

    materialsList.forEach((mat) => {
      const si = defaultStructure.findIndex(s => s.subject === mat.subject);
      if (si === -1) return;
      let ui = defaultStructure[si].units.findIndex(u => u.title === mat.unitTitle);
      if (ui === -1) {
        defaultStructure[si].units.push({
          id: mat.unitId || mat.unitTitle.replace(/\s+/g, '-').toLowerCase(),
          title: mat.unitTitle,
          description: 'Topics Curated for MDCAT',
          materials: [],
        });
        ui = defaultStructure[si].units.length - 1;
      }
      defaultStructure[si].units[ui].materials.push({
        id: mat.id,
        title: mat.title,
        type: mat.type || 'PDF Notes',
        size: mat.size || '',
        url: mat.url,
        content: mat.content // Crucial for StudySpaceViewer!
      });
    });

    return defaultStructure;
  };

  const syllabusData   = buildSyllabusTree();
  const subjectData    = syllabusData.find(s => s.subject === activeSubject);

  // Apply type & search filter to units → only show units that have matching materials
  const filteredUnits = (subjectData?.units || []).map(unit => ({
    ...unit,
    materials: unit.materials.filter(m => 
      typeToCategory(m.type) === activeTypeFilter &&
      (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
  })).filter(unit => unit.materials.length > 0);

  // Count per type for the active subject
  const countByType = (cat) => {
    const allMats = (subjectData?.units || []).flatMap(u => u.materials);
    return allMats.filter(m => typeToCategory(m.type) === cat).length;
  };

  const handleOpenViewer = (material) => {
    setActivePdf({ ...material, subject: activeSubject });
    if (user?.uid) trackSubjectProgress(user.uid, activeSubject, 2);
  };

  const toggleUnit = (unitId) =>
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    setActiveTypeFilter('notes');
    setExpandedUnits([]);
  };

  return (
    <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8 relative">

      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <BookOpen className="text-primary flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7" /> Syllabus Library
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-xs sm:text-sm font-medium">
          Browse notes, MCQs, past papers and cheat sheets for every MDCAT topic.
        </p>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none animate-in fade-in slide-in-from-bottom-4 duration-700">
        {syllabusData.map((s) => (
          <button
            key={s.subject}
            onClick={() => handleSubjectChange(s.subject)}
            className={`flex items-center px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap text-sm shadow-sm
              ${activeSubject === s.subject
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md scale-[1.02]'
                : 'bg-white/40 dark:bg-black/40 text-gray-500 dark:text-gray-400 border border-white/20 hover:bg-white/70 dark:hover:bg-black/70 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            {s.icon}{s.subject}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={`Search ${activeSubject} ${CONTENT_TYPES.find(c => c.value === activeTypeFilter)?.label || 'materials'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-base focus:outline-none focus:bg-white dark:focus:bg-[#111113] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-gray-900 dark:text-white transition-all duration-300 font-medium shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Content Type Filter Tags */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        {CONTENT_TYPES.map((ct) => {
          const count = countByType(ct.value);
          const isActive = activeTypeFilter === ct.value;
          return (
            <button
              key={ct.value}
              onClick={() => { setActiveTypeFilter(ct.value); setExpandedUnits([]); }}
              disabled={count === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed
                ${isActive ? ct.color + ' shadow-md scale-[1.04]' : ct.inactive}`}
            >
              {ct.icon}
              {ct.label}
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/20' : 'bg-black/5 dark:bg-white/10'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 h-64">
          <ScienceLoader text="Retrieving Syllabuses..." />
        </div>
      ) : filteredUnits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-white/30 dark:bg-black/20 animate-in fade-in">
          <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Info size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            No {activeTypeFilter !== 'all' ? CONTENT_TYPES.find(c => c.value === activeTypeFilter)?.label : activeSubject} content yet
          </h3>
          <p className="text-gray-500 font-medium mt-1.5 text-sm">Upload via the Admin panel to populate this section.</p>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {filteredUnits.map((unit) => {
            const isExpanded = expandedUnits.includes(unit.id);
            return (
              <div key={unit.id} className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md group">

                {/* Accordion Header */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 pr-4 min-w-0">
                    <div className={`p-2 rounded-xl flex-shrink-0 transition-colors hidden sm:flex ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-black/50 text-gray-500'}`}>
                      {isExpanded ? <FolderOpen className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-sm sm:text-base font-bold truncate transition-colors ${isExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {unit.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{unit.materials.length} item{unit.materials.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className={`p-1.5 flex-shrink-0 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-90 bg-gray-100 dark:bg-white/10' : 'text-gray-400'}`}>
                    <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 pb-6 px-4 sm:px-6 border-t border-white/20 dark:border-white/5 pt-6' : 'grid-rows-[0fr] opacity-0 py-0 px-4 sm:px-6'}`}>
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {unit.materials.map((mat, idx) => (
                        <div key={idx} className="flex flex-col p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-black/50 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${badgeStyle(mat.type)}`}>
                              {mat.type}
                            </span>
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-2 leading-snug flex-1">{mat.title}</h4>
                          {mat.size && <span className="text-xs sm:text-sm text-gray-400 font-medium mb-4">{mat.size}</span>}
                          <MagneticButton
                            onClick={() => handleOpenViewer(mat)}
                            className="w-full mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg rounded-xl sm:rounded-2xl font-bold py-2.5 sm:py-3 text-sm sm:text-base"
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

      {/* Study Space App */}
      {activePdf && (
        <StudySpaceViewer
          material={activePdf}
          user={user}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
