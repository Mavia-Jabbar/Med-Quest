import React from 'react';
import { motion } from 'framer-motion';

// High-End Science-themed animated Loader replacing standard spinners
export default function ScienceLoader({ text = "Loading System Data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-transparent">
      {/* Atom Electron Rings Animation */}
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        
        {/* Core Nucleus Glowing Orb */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,1)] z-10" 
        />
        
        {/* Deep Background Pulse */}
        <motion.div
           animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.4, 0.1] }}
           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           className="absolute w-12 h-12 bg-indigo-500/20 rounded-full blur-lg"
        />

        {/* Orbital Ring 1 - Cyan */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 border-[1.5px] border-cyan-500/40 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          style={{ transform: "rotateX(75deg) rotateY(0deg)", transformStyle: "preserve-3d" }}
        >
          {/* Electron */}
          <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 -mt-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
        </motion.div>

        {/* Orbital Ring 2 - Indigo */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 border-[1.5px] border-indigo-500/40 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          style={{ transform: "rotateX(75deg) rotateY(60deg)", transformStyle: "preserve-3d" }}
        >
           <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 -mt-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
        </motion.div>

        {/* Orbital Ring 3 - Fuchsia */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute inset-0 border-[1.5px] border-fuchsia-500/40 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.1)]"
          style={{ transform: "rotateX(75deg) rotateY(120deg)", transformStyle: "preserve-3d" }}
        >
           <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 -mt-1.5 bg-fuchsia-400 rounded-full shadow-[0_0_10px_#e879f9]" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p 
        animate={{ opacity: [0.6, 1, 0.6], textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(99,102,241,0.4)", "0px 0px 0px rgba(0,0,0,0)"] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-primary font-black tracking-[0.2em] uppercase text-xs"
      >
        {text}
      </motion.p>
    </div>
  );
}
