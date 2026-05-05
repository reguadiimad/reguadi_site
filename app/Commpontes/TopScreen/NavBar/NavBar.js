// NavBar.jsx
"use client";

import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import GlassLogo from "./GalssLogo";
import IPadCursor from "../../GlobalComponotes/IPadCursor";
import NavLinks from "./NavLinks";
import TriggersActionCapsule from "./TrigiresCapsule";
import RightSection from "./RightSection";
import { motion } from "framer-motion";

export default function NavBar({ mode1, toggleMode }) {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";
  const isDark = currentTheme === "dark";

  return (
    <div className={`w-[96%] pl-2 md:pl-0 lg:w-[80%] xl:w-[72%] transition-colors ease-in-out duration-300 rounded-4xl py-5 lg:mt-9 flex items-center fixed top-0 z-[999999998] text-sm md:text-lg xl:text-xl ${isArabic && "flex-row-reverse font-arb"}`}>

      <div className={`w-[14%] md:w-[12%] z-[100000] ${isArabic && "flex flex-row-reverse"}`}>
        <div className="w-full h-full relative">
          <GlassLogo isArabic={isArabic} isDark={isDark} className="w-[51px] sm:w-14 md:w-16 lg:w-18" />
        </div>
      </div>

      <NavLinks mode1={mode1} language={language} />

      <div className="flex-1" />

      {/* ── Gooey merge zone ─────────────────────────────── */}
      {/* SVG filter: blur edges → boost contrast → atop restores real pixel colors */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id="goo-nav" x="-30%" y="-60%" width="160%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -9"
              result="goo"
            />
            {/* atop: use goo's alpha as mask, but paint original source pixels = text stays crisp */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <motion.div layout transition={{ type: "spring" }}
        className={`flex gap-2 items-stretch ${isArabic && "flex-row-reverse"}`}
        style={{ filter: "url(#goo-nav)" }}
      >
        <TriggersActionCapsule mode1={mode1} />
        <RightSection mode1={mode1} toggleMode={toggleMode} />
      </motion.div>

      <IPadCursor />
    </div>
  );
}