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

  const config = {
    en: {
      src: isDark ? "/logos/glassR 3.png" : "/logos/glassR 2.png",
      glassStyle: "w-[54.2%] h-[89.5%] top-[3.8%] left-[10%] rounded-tl-2xl rounded-bl-[20px]",
    },
    ar: {
      src: isDark ? "/logos/glass Ar2.png" : "/logos/glass Ar.png",
      glassStyle: "w-[37.71%] h-[70.34%] top-[10.8886%] left-[30%] rotate-20",
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
        
        {/* 1. GLASS LAYER CONTAINER
           Added 'transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]' 
           This ensures the glass shape morphs, moves, and rotates smoothly 
           instead of snapping when switching languages.
        */}
        <div 
          className={`
            absolute z-0 overflow-hidden 
            transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${current.glassStyle} 
            ${isDark ? "bg-black/15" : ""}
          `}
        >
          <LiquidGlass 
              blur={isDark ? 1.1 : 1} 
              contrast={isDark ? 0.7 : 1.9} 
              brightness={isDark ? 1.2 : 1} 
              displacementScale={1.5} 
              elasticity={0.9} 
              saturation={1.15} 
              borderRadius={0}
            />
        </div>
        
        {/* 2. LOGO IMAGE WITH FRAMER MOTION
           AnimatePresence allows us to animate the image LEAVING the DOM.
           We use a "blur-fade" effect typical of Apple interfaces.
        */}
        <AnimatePresence mode="popLayout">
          <motion.img 
            // The key is crucial: when src changes, React sees a "new" element
            key={current.src} 
            src={current.src} 
            alt="Glass Logo"
            className="w-full z-10 h-full absolute object-contain pointer-events-none"
            
            // Initial state (entering)
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            
            // Active state (visible)
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            
            // Exit state (leaving)
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            
            // Smooth spring transition
            transition={{ 
              duration: 0.6, 
              ease: [0.32, 0.72, 0, 1] // Apple-style easing
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlassLogo;