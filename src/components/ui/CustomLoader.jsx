import React from 'react';
import { motion } from 'framer-motion';

export default function CustomLoader({ text = "Synthesizing Data..." }) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center pointer-events-none">
        {/* Core Atom Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        
        {/* Nucleus */}
        <div className="w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-10"></div>
        
        {/* Orbit 1 */}
        <motion.div 
          animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[3px] border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent rounded-full opacity-60"
        />
        
        {/* Orbit 2 */}
        <motion.div 
          animate={{ rotateX: -360, rotateZ: 360 }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-[2px] border-b-cyan-400 border-t-transparent border-r-transparent border-l-transparent rounded-full opacity-80"
        />
        
        {/* Orbit 3 */}
        <motion.div 
          animate={{ rotateX: 180, rotateY: 360, rotateZ: -360 }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 border-[1px] border-l-purple-500 border-t-transparent border-r-purple-500 border-b-transparent rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] opacity-40"
        />
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">
        {text}
      </p>
    </div>
  );
}
