import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.98,
    filter: "blur(8px)"
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] // Apple-style spring ease
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="flex-1 flex flex-col w-full h-full relative"
    >
      {children}
    </motion.div>
  );
}
