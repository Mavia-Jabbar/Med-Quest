import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function HoverTiltCard({ children, className = "", tiltStrength = 15 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    // Get card dimensions
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get mouse position relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation (-1 to 1 multiplier) based on mouse percent
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    // Max rotation is tiltStrength
    setRotateX(yPct * -tiltStrength);
    setRotateY(xPct * tiltStrength);

    // Update Apple Glass Glare position
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
      className={`relative transform-gpu ${className}`}
    >
      {/* Target Content */}
      {children}
      
      {/* 3D Glass Glare Lighting Effect */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-50 rounded-inherit transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)`,
          opacity: glarePosition.opacity,
          borderRadius: 'inherit'
        }}
      />
    </motion.div>
  );
}
