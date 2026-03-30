import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children, className = "" }) {
  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.99 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -15, scale: 0.99 }
  };

  const pageTransition = {
    type: "tween",
    ease: "circOut",
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full h-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
