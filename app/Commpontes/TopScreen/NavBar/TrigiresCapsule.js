// TriggersActionCapsule.jsx — full rewrite, framer-motion, low-end optimized
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Monoco from "@monokai/monoco-react";

import { setLanguage } from "../../../redux/languageSlice";
import { setPlayingSound, triggerSoundModeChange } from "../../../redux/soundSlice";
import { setThemeIsChanged, setTheTheme } from "../../../redux/themeSlice";
import SoundWaveIcon from "../SoundWave";

// ── Spring configs ────────────────────────────────────────────────────────────
// "merge"  → capsule squishes INTO the contact button (mode1 turns on)
// "emerge" → capsule pops OUT from the contact button (mode1 turns off)
const MERGE = { type: "spring", stiffness: 260, damping: 22, mass: 1.2 };
const EMERGE = { type: "spring", stiffness: 180, damping: 14, mass: 1.6 }; // bouncier on the way back

// Capsule variants — only transform + opacity (GPU composited, zero reflow)
const capsuleVariants = {
  visible: {
    opacity: 1,
    x: 0,
    scaleX: 1,
    scaleY: 1,
    transition: {
      opacity: { duration: 0.14, ease: "easeOut" },
      x:       EMERGE,
      scaleX:  EMERGE,
      scaleY:  EMERGE,
    },
  },
  hidden: {
    opacity: 0,
    x: 168,      // slides right into contact pill — adjust if gap differs
    scaleX: 0.8, // squishes to contact-pill width
    scaleY: 0.5,
    transition: {
      opacity: { duration: 0.12, ease: "easeIn", delay: 0.1 }, // fade after merge peak
      x:       MERGE,
      scaleX:  MERGE,
      scaleY:  MERGE,
    },
  },
};



export default function TriggersActionCapsule({ mode1 }) {
  const languages = [
    { indice: "Eng", value: "English" },
    { indice: "Ar", value: "العربية" },
    { indice: "Fr", value: "Français" },
  ];

  const [showDropDownLang, setShowDropDownLang] = useState(false);
  const [selectedLang, setSelectedLang]         = useState(null);

  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const language         = useSelector((s) => s.language);
  const playingSound     = useSelector((s) => s.sound.playingSound);
  const isSoundModeChanged = useSelector((s) => s.sound.isSoundModeChanged);
  const isThemeChanged   = useSelector((s) => s.theme.isChanged);
  const dispatch         = useDispatch();
  const prevPlayingSound = useRef(playingSound);

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
  const isArabic = language.indice === "Ar";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={capsuleVariants}
      layout
      transition={{type: "spring",mass:0.5,ease:"CircleOut"}}
      key={isArabic}
      animate={mode1 ? "hidden" : "visible"}
      initial={false}          // skip mount animation
      style={{
        transformOrigin: "right center", // squish aim: toward the contact pill →
        willChange: "transform, opacity",
        pointerEvents: mode1 ? "none" : "auto",
      }}
      className={` hidden lg:flex hover:scale-[1.015] items-center justify-center bg-lightGray dark:bg-darGray px-1.5 py-0 lg:px-1 lg:pl-[5.5px] gap-2 lg:gap-1 xl:gap-2  rounded-4xl border dark:border-[2.5px] border-black/20 shadow-2xs dark:border-white/30 ${isArabic?"ml-1.5":"mr-1.5"} `}>
      {/* ── Language ── */}
      <div className="relative z-50" onClick={() => setShowDropDownLang((v) => !v)}>
        <div className="
          font-bold clickableMenu cursor-pointer text-center
          px-3 py-1 rounded-4xl
          bg-lightGray hover:bg-darGray/30
          dark:bg-darGray dark:hover:bg-lightGray/50
          dark:text-lightGray text-darGray
          flex items-center justify-center transition-all duration-100
        ">
          <span>{language.indice}</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`ml-2 transition-transform duration-200 ${showDropDownLang ? "rotate-180" : ""}`}
          />
        </div>

       <AnimatePresence mode="wait">
  {showDropDownLang && (
    <motion.div
      key="lang-dropdown"
      className="absolute top-[160%] left-0 z-50 origin-top"
      style={{ willChange: "transform, opacity, clip-path" }}

      // ── OPEN: emerges from the button like pulled from a point ──
      initial={{
        opacity: 0,
        scaleY: 0,
        clipPath: "polygon(20% 0%, 80% 0%, 80% 0%, 20% 0%)",
      }}
      animate={{
        opacity: 1,
        scaleY: 1,
        clipPath: [
          // 1. starts as a thin strip at the top (where the button is)
          "polygon(20% 0%, 80% 0%, 80% 0%, 20% 0%)",
          // 2. sides bow outward — the "genie body" bulging out
          "polygon(0%  0%, 100% 0%, 115% 60%, -15% 60%)",
          // 3. settles into a clean rectangle
          "polygon(0%  0%, 100% 0%, 100% 100%, 0% 100%)",
        ],
        transition: {
          opacity: { duration: 0.12, ease: "easeOut" },
          scaleY: {
            type: "spring",
            stiffness: 260,
            damping: 18,
            mass: 0.8,
          },
          clipPath: {
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1], // expo-out — fast start, elegant settle
            times: [0, 0.45, 1],
          },
        },
      }}

      // ── EXIT: gets sucked back into the button ──
      exit={{
        opacity: 0,
        scaleY: 0,
        clipPath: [
          // 1. full rect
          "polygon(0%  0%, 100% 0%, 100% 100%, 0% 100%)",
          // 2. waist forms — pinching inward
          "polygon(0%  0%, 100% 0%, 78%  40%, 22%  40%)",
          // 3. fully collapsed back to the strip
          "polygon(20% 0%, 80%  0%, 80%  0%,  20%  0%)",
        ],
        transition: {
          opacity: { duration: 0.15, ease: "easeIn", delay: 0.05 },
          scaleY: {
            type: "spring",
            stiffness: 320,
            damping: 26,
            mass: 0.7,
          },
          clipPath: {
            duration: 0.3,
            ease: [0.7, 0, 0.84, 0], // expo-in — slow then snaps
            times: [0, 0.5, 1],
          },
        },
      }}
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
        <div className="flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
          {languages
            .filter((l) => l.indice !== language.indice)
            .map((lang, i) => (
              <motion.p
                key={lang.indice}
                // staggered reveal so items don't all pop at once
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.18 + i * 0.06,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                onClick={(e) => {
                  e.stopPropagation();
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
  )}
</AnimatePresence>
      </div>

      {/* ── Sound ── */}
      <SoundWaveIcon
        onToggle={() => dispatch(setPlayingSound(!playingSound))}
        isPlaying={playingSound}
        language={language.indice}
      />

      {/* ── Theme ── */}
      <button
        className="
          cursor-pointer p-1 rounded-4xl
          bg-lightGray dark:bg-darGray
          transition-all duration-200
          hover:shadow-xl hover:scale-[1.03]
        "
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      >
        <img
          src="/Icons/darkModeSwitchIcon.png"
          alt="Switch theme"
          className="w-8 transition-all duration-300 invert-0 dark:invert dark:rotate-180 dark:opacity-80"
        />
      </button>
    </motion.div>
  );
}