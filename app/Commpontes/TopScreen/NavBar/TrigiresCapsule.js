// TriggersActionCapsule.jsx — full rewrite, framer-motion, low-end optimized
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Monoco from "@monokai/monoco-react";

import { setLanguage } from "../../../redux/languageSlice";
import { setPlayingSound, triggerSoundModeChange } from "../../../redux/soundSlice";
import { setThemeIsChanged, setTheTheme } from "../../../redux/themeSlice";
import SoundWaveIcon from "../SoundWave";



export default function TriggersActionCapsule({ mode1,isArabic }) {
  const languages = [
    { indice: "Eng", value: "English" },
    { indice: "Ar", value: "العربية" },
    { indice: "Fr", value: "Français" },
  ];

  const [selectedLang, setSelectedLang]         = useState(null);

  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const language           = useSelector((s) => s.language);
  const playingSound       = useSelector((s) => s.sound.playingSound);
  const isSoundModeChanged = useSelector((s) => s.sound.isSoundModeChanged);
  const isThemeChanged     = useSelector((s) => s.theme.isChanged);
  const dispatch           = useDispatch();
  const prevPlayingSound   = useRef(playingSound);




  // ── Effects (unchanged logic) ─────────────────────────────────────────────
  useEffect(() => {
    if (selectedLang) { dispatch(setLanguage(selectedLang)); setSelectedLang(null); }
  }, [selectedLang, dispatch]);

  useEffect(() => {
    dispatch(setTheTheme(currentTheme));
    dispatch(setThemeIsChanged(true));
    const t = setTimeout(() => dispatch(setThemeIsChanged(false)), 10000);
    return () => clearTimeout(t);
  }, [currentTheme, dispatch]);

  useEffect(() => {
    if (prevPlayingSound.current !== playingSound) dispatch(triggerSoundModeChange());
    prevPlayingSound.current = playingSound;
  }, [playingSound, dispatch]);

  useEffect(() => {
    if (isThemeChanged) dispatch(setThemeIsChanged(false));
  }, [isSoundModeChanged, isThemeChanged, dispatch]);


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div

      style={{ pointerEvents: mode1 ? "none" : "auto", willChange: "opacity" }}
      className={`hidden lg:flex hover:scale-[1.015] h-full items-center justify-center  bg-lightGray dark:bg-darGray px-1.5 py-0 lg:px-1 lg:pl-[5.5px] gap-2 lg:gap-1 xl:gap-2 rounded-4xl border dark:border-[2.5px] border-black/20 shadow-2xs dark:border-white/30  ${isArabic?"ml-1.5":"mr-1.5"} `}>
      <motion.div>
        <LanguageToggle isArabic={isArabic} languages={languages} setSelectedLang={setSelectedLang} language={language} />
      </motion.div>
      {/* ── Sound ── */}
      <motion.div>
        <SoundWaveIcon onToggle={() => dispatch(setPlayingSound(!playingSound))} isPlaying={playingSound} language={language.indice} mode1={mode1}/>
      </motion.div>

      

      <motion.button layout className="p-1 rounded-4xl bg-lightGray dark:bg-darGray transition-all duration-200 hover:shadow-xl hover:scale-[1.03]" onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}>
        <img src="/Icons/darkModeSwitchIcon.png" alt="Switch theme"  className="w-8 transition-all duration-300 invert-0 dark:invert dark:rotate-180 dark:opacity-80"/>
      </motion.button>

    </div>
  );
}







const dropDownVariants = {
  open: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    pointerEvents: "auto",
    clipPath: [
      "polygon(20% 0%, 80% 0%, 80% 0%, 20% 0%)",
      "polygon(0%  0%, 100% 0%, 115% 60%, -15% 60%)",
      "polygon(0%  0%, 100% 0%, 100% 100%, 0% 100%)",
    ],
    transition: {
      opacity: { duration: 0.12, ease: "easeOut" },
      scaleY: { type: "spring", mass: 1.1 },
      y: { type: "spring" },
      clipPath: { duration: 0.42, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }
    }
  },
  closed: {
    opacity: 0,
    scaleY: 0,
    y: -20,
    pointerEvents: "none",
    clipPath: [
      "polygon(0%  0%, 100% 0%, 100% 100%, 0% 100%)",
      "polygon(0%  0%, 100% 0%, 78%  40%, 22%  40%)",
      "polygon(20% 0%, 80%  0%, 80%  0%,  20%  0%)",
    ],
    transition: {
      delay: 0.15, // Delays the parent closing so children exit first
      opacity: { duration: 0.15, ease: "easeIn", delay: 0.3 },
      scaleY: { type: "spring", stiffness: 320, damping: 26, delay: 0.2 },
      y: { type: "spring", delay: 0.2 },
      clipPath: { duration: 0.3, ease: [0.7, 0, 0.84, 0], times: [0, 0.5, 1], delay: 0.2 }
    }
  }
};

// ── 2. Define child list item variants ──
const itemVariants = {
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.18 + i * 0.06,
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  }),
  closed: (i) => ({
    opacity: 0,
    x: -50,
    transition: {  x: { type: "spring",delay: 0.1-(0.1*i) }, opacity: { duration: 0.25, ease: "easeIn" } }
  })
};

const LanguageToggle = ({ languages, setSelectedLang, language,isArabic }) => {
  const [showDropDownLang, setShowDropDownLang] = useState(false);

  return (
    <motion.div
      className="relative z-50"
      // Click on the outer container toggles the menu
      onClick={() => setShowDropDownLang((v) => !v)}
    >
      <div  className={`font-bold clickableMenu  cursor-pointer text-center px-3 py-1 rounded-4xl bg-lightGray hover:bg-darGray/30 dark:bg-darGray dark:hover:bg-lightGray/50 dark:text-lightGray text-darGray flex items-center justify-center transition-all duration-100`}>
        <span>{language.indice}</span>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`ml-2 transition-transform duration-200 ${
            showDropDownLang ? "rotate-180" : ""
          }`}
        />
      </div>

      <motion.div
        className="absolute top-[170%] left-0 z-50 origin-top"
        style={{ willChange: "transform, opacity, clip-path" }}
        
        // ── 3. Apply variants here ──
        initial="closed"
        animate={showDropDownLang ? "open" : "closed"}
        variants={dropDownVariants}
      >
        <Monoco
          borderRadius={24}
          smoothing={1}
          clip
          className="
            min-w-[120px] p-[18px] shadow-xl
            bg-lightGray dark:bg-darGray
            dark:text-lightGray text-darGray/80
          "
        >
          {/* Prevent clicks inside the dropdown gap from instantly closing the menu */}
          <div
            className="flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {languages
              .filter((l) => l.indice !== language.indice)
              .map((lang, i) => (
                <motion.p
                  key={lang.indice}
                  custom={i} // Pass the index to the variant for stagger math
                  initial="closed"
                  animate={showDropDownLang ? "open" : "closed"}
                  variants={itemVariants}
                  onClick={(e) => {
                    e.stopPropagation(); // Stops event from hitting the outer toggle
                    setSelectedLang(lang);
                    setShowDropDownLang(false);
                  }}
                  className={`
                    clickableMenu cursor-pointer font-semibold
                    px-2 py-1 rounded-[10px]
                    hover:bg-darGray/20 dark:hover:bg-lightGray/40
                    ${lang.indice === "Ar" ? "font-arb" : ""}
                  `}
                >
                  {lang.value}
                  <span className="text-sm pl-2">({lang.indice})</span>
                </motion.p>
              ))}
          </div>
        </Monoco>
      </motion.div>
    </motion.div>
  );
};

