// NavBar.jsx
"use client";

import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import GlassLogo from "./GalssLogo";
import NavLinks from "./NavLinks";
import TriggersActionCapsule from "./TrigiresCapsule";
import {AnimatePresence, delay, motion } from "framer-motion";
import Monoco from "@monokai/monoco-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import AppleXButton from "./PhoneMenuToggle";
import FullMenuMobile from "./FullMenuMobile";
import { useState } from "react";

export default function NavBar({ mode1, toggleMode }) {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";
  const isDark = currentTheme === "dark";
  const [fullMenuOpen, setFullMenuOpen] = useState(false);
  const navTexts = {
  Eng: ["About", "Work", "Blog", "Resume"],
  Ar: ["حولي", "أعمالي", "مدونة", "ملفي"],
  Fr: ["À propos", "Travail", "Blog", "CV"],
};

  return (
    <div className={`w-[96%] pl-2 md:pl-0 lg:w-[80%] xl:w-[72%] transition-colors ease-in-out duration-300  rounded-4xl py-5 lg:mt-9 flex items-center fixed top-0 z-[999999998] text-sm md:text-lg xl:text-xl ${isArabic && "flex-row-reverse font-arb"}`}>
      <div className={`w-[14%] md:w-[12%] z-[100000] ${isArabic ? "flex flex-row-reverse" : ""}`}>
        <GlassLogo isArabic={isArabic} isDark={isDark} className="w-14 md:w-16 lg:w-[72px]"/>
      </div>

      <NavLinks mode1={mode1} language={language} navTexts={navTexts} />

      <div className="flex-1" />
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id="goo-nav" x="-30%" y="-60%" width="160%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9" result="goo"/>
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <motion.div  initial={false} className={`flex  h-14   ${isArabic && "flex-row-reverse gap-5"}`} style={{ filter: "url(#goo-nav)"}}>

        <motion.div className={`${isArabic&&""}`} initial={false} animate={{ x:mode1?(isArabic?-50:50):0, marginRight: !mode1 ? '14px' : '-160px' ,opacity: !mode1 ? 1 : 0 ,width:mode1?"100px":"auto"}} transition={{delay:!mode1&&0.25,type:"spring",mass:1.15,opacity:{delay:!mode1?0.3:0},width:{duration:mode1?0.2:0,ease:"circInOut"}}}>
          <TriggersActionCapsule mode1={mode1} isArabic={isArabic} />
        </motion.div>

        <ContactBtn mode1={mode1} toggleMode={toggleMode} isArabic={isArabic} />

        <motion.div  initial={false}
        animate={{marginLeft:mode1?'20px':'-57px',scale:mode1?1:0.4,x:mode1?0:(isArabic?55:-55), opacity: mode1 ? 1 : 0,}}
        transition={{marginLeft:{type:"spring",mass:mode1?1.2:1.5,delay:mode1&&0.25},x:{duration:mode1?0.5:1.5,delay:mode1&&0.25},scale:{duration:mode1?0.05:0.8,delay:mode1?0.35:1.05}}}
        className="bg-black text-white dark:bg-white dark:text-black hidden lg:flex items-center justify-center px-4 rounded-full">
          <FontAwesomeIcon icon={faEllipsisH} />
        </motion.div>

      </motion.div>

      <div className={`relative z-[1000000000] flex  shrink-0 items-center gap-2 pointer-events-auto lg:hidden ${isArabic && "flex-row-reverse"}`}>
          <Monoco className="bg-black text-white dark:bg-white dark:text-black px-3 py-2 sm:px-5 sm:py-3 font-bold text-base sm:text-lg rounded-[15px]" smoothing={1} clip={true} borderRadius={15}>
            {isArabic ? "اتصل بي" : "Contact"}
          </Monoco>
          <AppleXButton onToggle={() => setFullMenuOpen(!fullMenuOpen)} isOpend={fullMenuOpen} />
      </div>

    <div className="block lg:hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {fullMenuOpen && (
          <FullMenuMobile onToggle={() => setFullMenuOpen(false)} navTexts={navTexts} />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}





const ContactBtn = ({ mode1, toggleMode, isArabic}) => (
  <Monoco
    smoothing={1}
    clip={true}
    className="bg-black rounded-[14px] hidden  lg:rounded-[18px] clickableMenu lg:flex items-center justify-center hover:scale-105 hover:shadow-xl ease-in-out duration-100 z-[100000] hover:opacity-80 font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] shadow-sm dark:bg-white text-center  px-4 py-2 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-white dark:text-black transition-colors"
  >
    <motion.button
      key={mode1}
      layout
      layoutId="contactBtn"
      onClick={toggleMode}
      initial={{ opacity: 1, scale: 1, x: 25 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
     
      className="text-white dark:text-black transition-colors"
      transition={{ type: "spring",mass: 1.13 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isArabic ? "اتصل بي" : "Contact"}
    </motion.button>
  </Monoco>
);
