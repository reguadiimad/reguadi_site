"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navTexts = {
  Eng: ["About", "Work", "Blog", "Resume"],
  Ar: ["حولي", "أعمالي", "مدونة", "ملفي"],
  Fr: ["À propos", "Travail", "Blog", "CV"],
};

export default function NavLinks({ mode1, language }) {
  const isArabic = language?.indice === "Ar";
  // Default to null so the pill doesn't sit on the first item unprompted
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const texts = navTexts[language?.indice] || navTexts.Eng;

  // Capsule variants — strictly transforms and opacity for zero reflow
  const capsuleVariants = {
    visible: { opacity: 1, y: 0, scale: 1 },
    hidden: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <motion.div
      layout
      onMouseLeave={() => setHoveredIndex(null)}
      className={`flex-1 lg:flex w-auto items-center mt-2 relative font-semibold z-[100000] ${
        isArabic && "flex-row-reverse"
      }`}
    >
      <div className="w-full h-full flex relative items-center justify-between">
        {texts.map((text, i) => {
          const isHovered = hoveredIndex === i;

          return (
            <motion.div
              key={text}
              // Added "group" here so text hover state syncs with the container
              className="relative w-full lg:w-[80px] xl:w-[100px] 2xl:w-[120px] flex items-center justify-center py-3 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(i)}
              variants={capsuleVariants}
              animate={mode1 ? "hidden" : "visible"}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: i * 0.04,
              }}
            >
              {/* Magic Morph Pill using layoutId */}
              <AnimatePresence>
                {isHovered && !mode1 && (
                  <motion.div
                    layoutId="navHoverPill"
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

              {/* Text Link */}
              <motion.p
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative z-10 opacity-90 transition-opacity duration-200 group-hover:opacity-100 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {text}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}