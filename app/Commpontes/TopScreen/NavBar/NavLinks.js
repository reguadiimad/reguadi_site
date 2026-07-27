"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { filter } from "framer-motion/client";
import { blur } from "three/tsl";

export default function NavLinks({ mode1, language, navTexts }) {
  const isArabic = language?.indice === "Ar";
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const texts = navTexts[language?.indice] || navTexts.Eng;

  // Pure Y-axis clip wipe — overflow-hidden handles the hiding seamlessly
  const textWipeVariants = {
    visible: (i) => ({
      y: "0%",
      scale:1,
      filter:"blur(0px)",
      transition: {
        duration: 0.4,
       
        delay: i * 0.055,
        type:"spring",mass:1.2

      },
    }),
    hidden: (i) => ({
      y: "118%",
      scale:0.9,
      filter:"blur(2px)",
 
      
      transition: {
        duration: 0.3,
       
        delay: (texts.length - 1 - i) * 0.055,
        type:"spring",mass:1.2
      },
    }),
  };

  return (
    <motion.div
      layout
      onMouseLeave={() => setHoveredIndex(null)}
      className={`flex-1 lg:flex w-auto items-center mt-2 relative font-semibold z-[100000] ${
        isArabic ? "flex-row-reverse" : ""
      }`}
    >
      <div className="w-full h-full flex relative items-center justify-between">
        {texts.map((text, i) => {
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={text}
              onMouseEnter={() => setHoveredIndex(i)}
              className="relative w-full lg:w-[80px] xl:w-[100px] 2xl:w-[120px] flex items-center justify-center py-3 clickableMenu group"
            >
              {/* Magic Morph Pill */}
              <AnimatePresence>
                {isHovered && !mode1 && (
                  <motion.div
                    layoutId="navHoverPill"
                    layout
                    className="absolute inset-0 hidden lg:block bg-black/5 dark:bg-white/10 border dark:border-[1.5px] dark:border-white/20 border-black/20 rounded-4xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Mask Container */}
              <div className="hidden lg:block overflow-hidden py-1">
                <motion.p
                  custom={i}
                  variants={textWipeVariants}
                  animate={mode1 ? "hidden" : "visible"}
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  /* 
                    Fixed:
                    - Removed `transition-opacity` (prevented CSS/JS fight)
                    - Added `transform-gpu` (prevents browser font-smoothing snap on finish)
                  */
                  className={`relative z-10 opacity-90 group-hover:opacity-100 inline-block transform-gpu ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {text}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
