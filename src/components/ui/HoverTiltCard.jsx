import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function HoverTiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to rotation ranges (tilt intensity limit: 8 degrees)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  // Lighting effect moving across card surface
  const lightX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);
  const lightingStyle = isHovered 
    ? { backgroundImage: `radial-gradient(circle at ${lightX.get()}% ${lightY.get()}%, rgba(255,255,255,0.1) 0%, transparent 60%)` } 
    : {};

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Normalize coordinates between -0.5 and 0.5 based on card center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        zIndex: isHovered ? 10 : 1,
      }}
      className={`relative w-full h-full preserve-3d transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {/* Visual content layer */}
      <div className="w-full h-full relative z-10">
         {children}
      </div>

      {/* Dynamic Glass Glare (Specular Highlight) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-300 mix-blend-overlay"
        style={{
          opacity: isHovered ? 1 : 0,
          background: isHovered 
            ? `radial-gradient(circle at ${lightX.get()}% ${lightY.get()}%, rgba(255,255,255,0.2) 0%, transparent 50%)` 
            : 'none'
        }}
      />
    </motion.div>
  );
}
