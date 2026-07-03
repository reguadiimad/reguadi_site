"use client";

import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../../redux/languageSlice";
import { setPlayingSound } from "../../../redux/soundSlice";

import SoundWaveIcon from "../SoundWave";
import Monoco from "@monokai/monoco-react";

// Liquid Morphing Configurations (Inverted corner positions per request)
const pathVariants = {
  initial: (isArabic) => ({
    d: isArabic
      ? "M 0 0 L 0 0 C 0 0, 0 0, 0 0 L 0 0 Z"          // Collapsed to Top-Left for Arabic
      : "M 100 0 L 100 0 C 100 0, 100 0, 100 0 L 100 0 Z", // Collapsed to Top-Right for ENG/FR
  }),
  animate: (isArabic) => ({
    d: isArabic
      ? "M 0 0 L 100 0 C 100 100, 100 100, 0 100 L 0 100 Z" // Expands from Top-Left across screen
      : "M 100 0 L 0 0 C 0 100, 0 100, 100 100 L 100 100 Z", // Expands from Top-Right across screen
    transition: {
      type: "spring",
      stiffness: 65,
      damping: 12, // Lower damping gives a gelatinous, liquid wobble on finish
      mass: 1.1,
    },
  }),
  exit: (isArabic) => ({
    d: isArabic
      ? "M 0 0 L 0 0 C 0 0, 0 0, 0 0 L 0 0 Z"          // Retracts back to Top-Left
      : "M 100 0 L 100 0 C 100 0, 100 0, 100 0 L 100 0 Z", // Retracts back to Top-Right
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16,
    },
  }),
};

// Controls the subtle backdrop blur opacity overlay
const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.35, delay: 0.15 } },
};

// Delays child menu buttons until the liquid canvas covers the viewport
const listContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

// Smooth physical entrance for navigation links
// FIXED: Accepts an object containing both dynamic properties to compute correct offsets perfectly
const itemVariants = {
  initial: ({ isArabic }) => ({
    opacity: 0,
    x: isArabic ? -30 : 30, // Entrance direction mirrors the liquid splash flow
    y: -10,
  }),
  animate: ({ isArabic, isSelected }) => ({
    opacity: 1,
    y: 0,
    // Safely moves the active line out of the way right from the beginning
    x: isSelected ? (isArabic ? -48 : 48) : 0, 
    transition: { type: "spring", stiffness: 140, damping: 15 },
  }),
  exit: ({ isArabic }) => ({
    opacity: 0,
    x: isArabic ? -20 : 20,
    transition: { duration: 0.15 },
  }),
};

const FullMenuMobile = ({ onToggle, navTexts }) => {
  const languages = [
    { indice: "Eng", value: "English " },
    { indice: "Ar", value: "العربي" },
    { indice: "Fr", value: "Francais" },
  ];

  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [mounted, setMounted] = useState(false);
  const [showDropDownLang, setShowDropDownLang] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuRef = useRef(null);
  const buttonRefs = useRef([]);

  const [marker, setMarker] = useState({ y: 0, ready: false });
  const [markerRotation, setMarkerRotation] = useState(-10);

  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const playingSound = useSelector((state) => state.sound.playingSound);

  const texts = navTexts[language.indice] || navTexts.Eng;
  const isArabic = language.indice === "Ar";

  const updateMarker = useCallback(() => {
    const selectedButton = buttonRefs.current[selectedIndex];
    if (!selectedButton) return;

    // Calculates precise centering offset relative to active button layout
    const y = selectedButton.offsetTop + selectedButton.offsetHeight / 2 - 18;
    setMarker({ y, ready: true });
  }, [selectedIndex]);

  const spinToRandomAngle = useCallback(() => {
    setMarkerRotation((prev) => {
      const randomStop = Math.round(Math.random() * 180);
      const currentTurn = Math.floor(prev / 180);
      return (currentTurn + 1) * 180 + randomStop;
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedIndex > texts.length - 1) {
      setSelectedIndex(0);
    }
  }, [texts.length, selectedIndex]);

  useEffect(() => {
    if (!mounted) return;
    const frame = requestAnimationFrame(updateMarker);
    return () => cancelAnimationFrame(frame);
  }, [mounted, updateMarker, texts.length, language.indice]);

  useEffect(() => {
    if (!mounted) return;

    const resizeObserver = new ResizeObserver(() => {
      updateMarker();
    });

    if (menuRef.current) resizeObserver.observe(menuRef.current);
    buttonRefs.current.forEach((btn) => {
      if (btn) resizeObserver.observe(btn);
    });

    window.addEventListener("resize", updateMarker);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateMarker);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMarker);
    };
  }, [mounted, updateMarker, texts.length]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed left-0 top-0 z-[99999999] h-screen w-screen lg:hidden overflow-hidden">
      
      {/* Morphing Liquid SVG Background Layer - EXPANDED TO 150% AND CENTERED */}
      <motion.div
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute -top-[25%] -left-[25%] w-[150%] h-[150%] backdrop-blur-xl pointer-events-none"
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <motion.path
            custom={isArabic}
            variants={pathVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fill-lightGray/90 dark:fill-darGray"
          />
        </svg>
      </motion.div>

      {/* Interactive Content Container Layer - STAYS 100% UNTOUCHED */}
      <motion.div
        variants={listContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex h-full w-full flex-col items-center overflow-y-auto p-2 pb-20 pointer-events-auto"
      >
        <div
          ref={menuRef}
          dir={isArabic ? "rtl" : "ltr"}
          className={`relative mt-[37%] flex w-[95%] flex-col tiny:mt-[90px] short:mt-[15%] medium:mt-[35%] ${
            isArabic ? "font-arb font-bold" : "font-clashDisplay font-semibold"
          }`}
        >
          {/* Elastic Monoco Indicator Marker */}
          <motion.div
            initial={false}
            animate={{
              y: marker.y,
              opacity: marker.ready ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
              mass: 0.7,
            }}
            className={`pointer-events-none absolute top-0 z-20 ${
              isArabic ? "right-0" : "left-0"
            }`}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: markerRotation,
                // Generates a squish-and-stretch jelly bounce when jumping lines
                scaleY: [1, 1.3, 0.85, 1],
                scaleX: [1, 0.75, 1.15, 1],
              }}
              transition={{
                rotate: { type: "spring", stiffness: 180, damping: 14, mass: 0.8 },
                scaleY: { duration: 0.38, ease: "easeInOut" },
                scaleX: { duration: 0.38, ease: "easeInOut" },
              }}
            >
              <Monoco
                smoothing={1}
                clip={true}
                borderRadius={13}
                className="h-9 w-9 bg-theBlue dark:bg-theOrange shadow-lg"
              />
            </motion.div>
          </motion.div>

          {/* Links Elements */}
          {texts.map((text, i) => {
            const isSelected = selectedIndex === i;

            return (
              <motion.button
                ref={(el) => { buttonRefs.current[i] = el; }}
                type="button"
                key={`${text}-${i}`}
                // FIXED: We pass both values down into the variants orchestration pipeline
                custom={{ isArabic, isSelected }}
                variants={itemVariants}
                // REMOVED: Inline animate object removed so variants execute cleanly on mount & updates
                onClick={() => {
                  setSelectedIndex(i);
                  spinToRandomAngle();
                }}
                className="relative z-10 flex w-full cursor-pointer items-center py-4 text-start text-6xl text-darGray outline-none dark:text-white group"
              >
                <motion.span 
                  className="relative z-10 block"
                  animate={{ opacity: isSelected ? 1 : 0.45 }}
                  whileHover={{ opacity: 1, scale: 1.02, x: isSelected ? 0 : (isArabic ? -8 : 8) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {text}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Floating Action Bars */}
        <div
          className={`fixed bottom-10 z-[99999999] flex items-stretch justify-center gap-2 p-6 pb-10 ${
            isArabic ? "left-0 flex-row-reverse" : "right-0"
          }`}
        >
          <AnimatePresence>
            <motion.div
              key="language-toggle"
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
              onClick={() => setShowDropDownLang((prev) => !prev)}
              className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-4xl border-2 border-darGray px-2 text-base font-bold text-darGray dark:border-lightGray dark:text-lightGray ${language.indice === "Ar" ? "font-arb" : ""}`}
            >
              {language.value}
              <FontAwesomeIcon
                className={`duration-300 ease-in-out ${showDropDownLang ? "rotate-180" : "rotate-0"}`}
                icon={faCaretUp}
              />

              <AnimatePresence>
                {showDropDownLang && (
                  <motion.div
                    key="dropdown"
                    initial={{ y: 30, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -top-[300%] left-0 w-full rounded-2xl border-2 border-darGray p-1 px-2 text-darGray bg-lightGray/90 backdrop-blur-md dark:bg-darGray dark:border-lightGray dark:text-lightGray"
                  >
                    {languages
                      .filter((lang) => lang.indice !== language.indice)
                      .map((lang) => (
                        <p
                          key={lang.indice}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setLanguage(lang));
                            setShowDropDownLang(false);
                            setSelectedIndex(0);
                            spinToRandomAngle();
                          }}
                          className={`clickable py-1 hover:underline ${lang.indice === "Ar" ? "font-arb" : ""}`}
                        >
                          {lang.value}
                        </p>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            <SoundWaveIcon
              key="sound-toggle"
              isMobile={true}
              onToggle={() => dispatch(setPlayingSound(!playingSound))}
              isPlaying={playingSound}
              language={language.value}
            />

            <motion.button
              key="theme-toggle"
              type="button"
              initial={{ y: 20, opacity: 0, scale: 0.9, rotate: -90 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, scale: 0.9, rotate: 90 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
              className="flex cursor-pointer items-center justify-center rounded-4xl bg-lightGray dark:bg-darGray px-3"
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            >
              <img
                className="w-9 border-2 border-transparent invert-0 transition-all duration-300 dark:rotate-180 dark:invert dark:opacity-80"
                src="/Icons/darkModeSwitchIcon.png"
                alt="Switch theme"
              />
            </motion.button>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default FullMenuMobile; 