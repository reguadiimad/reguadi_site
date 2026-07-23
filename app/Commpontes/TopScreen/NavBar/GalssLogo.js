"use client";

import { useEffect, useState } from "react";
import { Glass } from "@samasante/liquid-glass";
import { motion, AnimatePresence } from "framer-motion";

const GlassLogo = ({
  width,
  className = "",
  isDark = true,
  isArabic = false,
}) => {
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const config = {
    en: {
      src: isDark
        ? "/logos/glassR-3.png"
        : "/logos/glassR-2.png",

      glassStyle:
        "w-[54.2%] h-[89.5%] top-[3.8%] left-[10%] rounded-tl-2xl rounded-bl-[20px]",
    },

    ar: {
      src: isDark
        ? "/logos/glass-Ar2.png"
        : "/logos/glass-Ar.png",

      glassStyle:
        "w-[37.71%] h-[70.34%] top-[10.8886%] left-[30%] rotate-[20deg]",
    },
  };

  const current = isArabic ? config.ar : config.en;

  const aspectRatioStyle = {
    aspectRatio: "100 / 101.56",
  };

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width,
          ...aspectRatioStyle,
        }}
      />
    );
  }
const PLAYER_OPTICS2 = {
  clipToShape: false,
  softEdge: true,
  strength: isArabic?1.1:1.6,
  depth: isArabic?0.2:0.3,
  curvature: 2,
  bend: 0.6,
  bendWidth: 0.1,
  dispersion: 2,
  specular: 0.1,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 1.9,
  brightness: 0,
  thickness: 0,
};

  return (
    <div
      className={`relative shrink-0 ${className}`} 
      style={{
        width: width || undefined,
        ...aspectRatioStyle,
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full group">
        
        {/* GLASS LAYER */}
        <div
          className={`
            absolute
            z-0
            overflow-hidden
            blured
           ${isArabic?"w-[38%] -mr-[5%] h-[80.5%] rounded-tr-2xl rounded-bl-2xl":" w-[77%] -ml-[5%] h-[90.5%] rounded-tr-2xl"}
            transition-all
            duration-700
            ease-[cubic-bezier(0.25,0.1,0.25,1)]


            ${current.glassStyle}
            ${isDark ? "bg-black/15" : ""}
          `}
        >
          <Glass radius={12} optics={{...PLAYER_OPTICS2}} className="w-full h-full bg-lightGray/5 blured  lg:rounded-[12px]"
          >
            <div className="w-full h-full"></div>
          </Glass>
        </div>

        {/* LOGO IMAGE */}
        <AnimatePresence mode="wait">
          <motion.img
            key={current.src}
            src={current.src}
            alt="Glass Logo"
            className="
              absolute
              z-10
              w-full
              h-full
              object-contain
              pointer-events-none
            "

            initial={{
              opacity: 0,
              filter: "blur(8px)",
              scale: 0.92,
            }}

            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }}

            exit={{
              opacity: 0,
              filter: "blur(8px)",
              scale: 1.05,
            }}

            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1],
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlassLogo;