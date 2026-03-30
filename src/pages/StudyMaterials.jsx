import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudyMaterials() {
  const materials = [
    { title: "Cell Biology & Organelles", type: "PDF Notes", subject: "Biology", size: "2.4 MB" },
    { title: "Organic Chemistry Mechanisms", type: "Cheat Sheet", subject: "Chemistry", size: "1.1 MB" },
    { title: "Kinematics & Dynamics Formulae", type: "Cheat Sheet", subject: "Physics", size: "840 KB" },
    { title: "Human Physiology Full Overview", type: "PDF Notes", subject: "Biology", size: "4.2 MB" },
    { title: "Atomic Structure & Bonding", type: "PDF Notes", subject: "Chemistry", size: "3.5 MB" },
    { title: "Thermodynamics Core Concepts", type: "Cheat Sheet", subject: "Physics", size: "1.5 MB" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <BookOpen className="text-primary" /> Study Materials
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
          Access high-yield PDFs, notes, and cheat sheets for your MDCAT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {materials.map((item, idx) => (
          <Card key={idx} className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block ${
                  item.subject === 'Biology' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  item.subject === 'Chemistry' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {item.subject}
                </span>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mt-1 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 font-medium mt-1">{item.type} • {item.size}</CardDescription>
              </div>
              <div className="p-2 bg-black/5 dark:bg-white/10 rounded-xl text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full bg-white/50 border-white/20 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 transition-all font-semibold rounded-xl text-gray-700 dark:text-gray-200">
                  Open Viewer
                </Button>
                <Button variant="ghost" className="px-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
                  <Download size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
