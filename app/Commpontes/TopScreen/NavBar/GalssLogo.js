"use client";
import { useState, useEffect } from "react";
import { LiquidGlass } from "@liquidglass/react";
import { motion, AnimatePresence } from "framer-motion";

const GlassLogo = ({ 
  width, 
  className = "", 
  isDark = true, 
  isArabic = false 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. FIXED: Removed spaces from file names (Ensure you rename actual files too!)
  const config = {
    en: {
      src: isDark ? "/logos/glassR-3.png" : "/logos/glassR-2.png",
      glassStyle: "w-[54.2%] h-[89.5%] top-[3.8%] left-[10%] rounded-tl-2xl rounded-bl-[20px]",
    },
    ar: {
      src: isDark ? "/logos/glass-Ar2.png" : "/logos/glass-Ar.png",
      glassStyle: "w-[37.71%] h-[70.34%] top-[10.8886%] left-[30%] rotate-[20deg]", // 2. FIXED: Valid Tailwind arbitrary rotation
    }
  };

  const current = isArabic ? config.ar : config.en;
  const aspectRatioStyle = { aspectRatio: '100 / 101.56' };

  if (!mounted) return <div className={className} style={{ width, ...aspectRatioStyle }} />;

  return (
    <div 
      className={`relative shrink-0 ${className}`} 
      style={{ width: width || undefined, ...aspectRatioStyle }}
    >
      <div className="w-full h-full items-center justify-center flex relative group">
        
        {/* GLASS LAYER CONTAINER */}
        <div 
          className={`
            absolute z-0 overflow-hidden backdrop-blur-md blured
            transition-all duration-300 ease-in-out
            ${current.glassStyle} 
            ${isDark ? "bg-darGray/30 safariBlur" : ""}
          `}
        >
          <LiquidGlass 
            blur={1} 
            contrast={isDark ? 0.85 : 1.9} 
            brightness={isDark ? 1.2 : 1} 
            displacementScale={1.5} 
            elasticity={0.9} 
            saturation={1.15} 
            borderRadius={0}
          />
        </div>
        
        {/* LOGO IMAGE WITH FRAMER MOTION */}
        <AnimatePresence mode="wait"> {/* 3. FIXED: Changed to 'wait' to prevent popLayout positioning collision */}
          <motion.img 
            key={current.src} 
            src={current.src} 
            alt="Glass Logo"
            className="w-full z-10 h-full absolute object-contain pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.32, 0.72, 0, 1] 
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlassLogo;