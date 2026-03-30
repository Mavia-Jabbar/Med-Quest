import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className = "", onClick }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Apply pull force (15% magnetic pull strength)
    const pullDistanceX = (clientX - centerX) * 0.15;
    const pullDistanceY = (clientY - centerY) * 0.15;

    setPosition({ x: pullDistanceX, y: pullDistanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 }); // Snap back
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.button>
  );
}
