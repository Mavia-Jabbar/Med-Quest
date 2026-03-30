import React from 'react';
import { motion } from 'framer-motion';

// Science-themed animated Loader replacing standard spinners
export default function ScienceLoader({ text = "Calculating Data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Atom Electron Rings Animation */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Core Nucleus */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(79,70,229,0.8)] z-10" 
        />
        
        {/* Orbital Ring 1 */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 border-2 border-primary/30 rounded-full"
          style={{ transform: "rotateX(70deg) rotateY(0deg)" }}
        >
          {/* Electron */}
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
        </motion.div>

        {/* Orbital Ring 2 */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 border-2 border-indigo-500/30 rounded-full"
          style={{ transform: "rotateX(70deg) rotateY(60deg)" }}
        >
           <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
        </motion.div>

        {/* Orbital Ring 3 */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute inset-0 border-2 border-purple-500/30 rounded-full"
          style={{ transform: "rotateX(70deg) rotateY(120deg)" }}
        >
           <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
        </motion.div>
      </div>

      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-primary font-bold tracking-widest uppercase text-sm"
      >
        {text}
      </motion.p>
    </div>
  );
}
