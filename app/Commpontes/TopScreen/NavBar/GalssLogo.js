"use client";

import { useEffect, useState } from "react";
import { LiquidGlass } from "@liquidglass/react";

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

  const enGlassStyle =
    "w-[54.2%] h-[89.5%] top-[3.8%] left-[10%] rounded-tl-2xl rounded-bl-[20px]";

  const arGlassStyle =
    "w-[37.71%] h-[70.34%] top-[10.8886%] left-[30%] rotate-[20deg]";

  const activeGlassStyle = isArabic ? arGlassStyle : enGlassStyle;

  const showEnDark = mounted && !isArabic && isDark;
  const showEnLight = mounted && !isArabic && !isDark;
  const showArDark = mounted && isArabic && isDark;
  const showArLight = mounted && isArabic && !isDark;

  return (
    <div
      className={`relative shrink-0 isolate overflow-visible ${className}`}
      style={{
        width: width || undefined,
        minWidth: width || undefined,
        aspectRatio: "100 / 101.56",
      }}
    >
      <div className="relative w-full h-full overflow-visible">
        {/* GLASS LAYER */}
        {mounted && (
          <div
            className={`
              absolute z-0 overflow-hidden
              transition-all duration-300 ease-in-out
              ${activeGlassStyle}
              ${isDark ? "bg-black/15" : "bg-white/10"}
            `}
          >
          
          </div>
        )}

        {/* LOGOS: static direct src paths */}
        <img
          src="/Logos/glassR-3.png"
          alt="Logo EN Dark"
          draggable={false}
          className={`
            absolute inset-0 z-10 w-full h-full object-contain pointer-events-none select-none
            ${showEnDark ? "block" : "hidden"}
          `}
        />

        <img
          src="/Logos/glassR-2.png"
          alt="Logo EN Light"
          draggable={false}
          className={`
            absolute inset-0 z-10 w-full h-full object-contain pointer-events-none select-none
            ${showEnLight ? "block" : "hidden"}
          `}
        />

        <img
          src="/Logos/glass-Ar2.png"
          alt="Logo AR Dark"
          draggable={false}
          className={`
            absolute inset-0 z-10 w-full h-full object-contain pointer-events-none select-none
            ${showArDark ? "block" : "hidden"}
          `}
        />

        <img
          src="/Logos/glass-Ar.png"
          alt="Logo AR Light"
          draggable={false}
          className={`
            absolute inset-0 z-10 w-full h-full object-contain pointer-events-none select-none
            ${showArLight ? "block" : "hidden"}
          `}
        />
      </div>
    </div>
  );
};

export default GlassLogo;