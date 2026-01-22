"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import FullMenuMobile from "./FullMenuMobile";
import { setLanguage } from "../../redux/languageSlice";
import { setPlayingSound, triggerSoundModeChange } from "../../redux/soundSlice";
import { setThemeIsChanged, setTheTheme } from "../../redux/themeSlice";
import SoundWaveIcon from "./SoundWave";
import GlassLogo from "./GalssLogo";
import IPadCursor from "../GlobalComponotes/IPadCursor";

const languages = [
  { indice: "Eng", value: "English " },
  { indice: "Ar", value: "العربي" },
  { indice: "Fr", value: "Francais" },
];

const navTexts = {
  Eng: ["About", "Work", "Blog", "Resume"],
  Ar: ["حولي", "أعمالي", "مدونة", "ملفي"],
  Fr: ["À propos", "Travail", "Blog", "CV"],
};

export default function NavBar({ mode1, toggleMode }) {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const language = useSelector((state) => state.language);
  const IsThemeChanged = useSelector((state) => state.theme.isChanged);
  const playingSound = useSelector((state) => state.sound.playingSound);
  const isSoundModeChanged = useSelector((state) => state.sound.isSoundModeChanged);

  const dispatch = useDispatch();

  const [showDropDownLang, setShowDropDownLang] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [showMorph, setShowMorph] = useState(false);
  const [hoveredMorph, setHoveredMorph] = useState(0);

  const isArabic = language.indice === "Ar";
  const texts = navTexts[language.indice] || navTexts.Eng;

  const xDirection = isArabic ? 1 : -1;
  const morphStyle = {
    [isArabic ? "marginRight" : "marginLeft"]: `${hoveredMorph * 25}%`,
  };
  const burgerBarClasses =
    "absolute block h-1 w-8 rounded-full bg-darGray dark:bg-lightGray transition-all duration-300 ease-in-out";

  useEffect(() => {
    dispatch(setTheTheme(currentTheme));
    dispatch(setThemeIsChanged(true));

    const timer = setTimeout(() => {
      dispatch(setThemeIsChanged(false));
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentTheme, dispatch]);

  const isDark = currentTheme === "dark";

  const prevPlayingSound = useRef(playingSound);
  useEffect(() => {
    if (prevPlayingSound.current !== playingSound) {
      dispatch(triggerSoundModeChange());
    }
    prevPlayingSound.current = playingSound;
  }, [playingSound, dispatch]);

  useEffect(() => {
    if (IsThemeChanged) {
      dispatch(setThemeIsChanged(false));
    }
  }, [isSoundModeChanged]);

  return (
    <div
      className={`w-[96%] pl-2 md:pl-0 lg:w-[80%] xl:w-[72%] transition-colors ease-in-out duration-300 rounded-4xl py-5 lg:mt-9 flex items-center fixed top-0 z-[999999998] text-sm md:text-lg xl:text-xl ${
        isArabic && "flex-row-reverse font-arb"
      }`}
    >
      {/* --- LOGO SECTION --- */}
      <div className={`w-[14%] md:w-[12%] z-[100000] ${isArabic && "flex flex-row-reverse"}`}>
        <div className="w-full h-full relative">
          <GlassLogo isArabic={isArabic} isDark={isDark} className="w-[51px] sm:w-14 md:w-16 lg:w-18" />
        </div>
      </div>

      {/* --- CENTER NAV (LINKS) --- */}
      {/* Added layout prop here so the container size animates smoothly */}
      <motion.div
        layout
        onMouseEnter={() => setShowMorph(true)}
        onMouseLeave={() => setShowMorph(false)}
        className={`flex-1 lg:flex w-auto items-center mt-2 relative font-semibold z-[100000] ${
          isArabic && "flex-row-reverse"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {!mode1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex relative items-center"
            >
              <div dir={isArabic ? "rtl" : "ltr"} className="w-full h-full absolute top-0 left-0 -z-0">
                <div
                  style={morphStyle}
                  className={`w-[25%] ${
                    mode1 ? "hidden " : "hidden lg:block"
                  } spdy bg-black/5 dark:bg-white/10 border dark:border-[1.5px] dark:border-white/20 border-black/20 rounded-4xl h-full transition-opacity duration-300 ${
                    showMorph ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
              </div>

              {texts.map((text, i) => (
                <motion.p
                  onMouseEnter={() => setHoveredMorph(i)}
                  key={text}
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={`hidden hover:text-shadow-xl links text-center lg:w-[80px] transform hover:font-bold transition-all py-3 z-10 xl:w-[100px] 2xl:w-[120px] clickableMenu border border-transparent rounded-4xl lg:flex items-center justify-center ease-in-out duration-200 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex-1"></div>

      {/* --- RIGHT ACTIONS SECTION --- */}
      <LayoutGroup>
        <motion.div layout className={`flex gap-2 items-stretch ${isArabic && "flex-row-reverse"}`}>
          
          <AnimatePresence mode="popLayout" initial={false}>
            {!mode1 && (
              <motion.div
                key="settings-container" // Unique Key
                // REMOVED layoutId="spacerBox" -> causing the glitch
                layout // keep layout so it slides smoothly
                className="px-1 lg:px-2 gap-2 lg:gap-1 xl:gap-2 hover:scale-105 transition-transform rounded-4xl transition-colors ease-in-out duration-200 border dark:border-[2.5px] border-black/20 shadow-2xs dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 lg:flex items-center justify-center hidden"
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              >
                {/* Language Dropdown */}
                <div className="relative z-50" onClick={() => setShowDropDownLang(!showDropDownLang)}>
                  <motion.div
                    className={`font-bold clickableMenu hover:shadow-xl hover:scale-[1.08] text-center px-3 py-1 rounded-4xl ease-in-out duration-100 flex items-center justify-center cursor-pointer ${
                      mode1
                        ? ""
                        : "bg-lightGray hover:bg-darGray/30 dark:bg-darGray dark:hover:bg-lightGray/50 dark:text-lightGray text-darGray"
                    } backdrop-blur-2xl`}
                  >
                    <div>{language.indice}</div>
                    <FontAwesomeIcon
                      className={`ml-2 ease-in-out duration-200 ${showDropDownLang && "rotate-180 -mb-0.5"}`}
                      icon={faCaretDown}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {showDropDownLang && (
                      <motion.div
                        initial={{ y: -10, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -10, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.2 }}
                        className="absolute shadow-xl clickbaleMenu top-[140%] gap-4 p-[10px] rounded-[20px] bg-lightGray dark:bg-darGray dark:text-lightGray text-darGray/80 backdrop-blur-2xl text-left flex flex-col left-0 min-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
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
                              }}
                              className={` flex items-baseline w-full clickableMenu hover:bg-darGray/20 font-semibold dark:hover:bg-lightGray/40 rounded-[10px] px-2 py-1 ${
                                lang.indice === "Ar" && "font-arb"
                              }`}
                            >
                              {lang.value} <span className="text-sm pl-2">({lang.indice})</span>
                            </p>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <SoundWaveIcon
                  onToggle={() => dispatch(setPlayingSound(!playingSound))}
                  isPlaying={playingSound}
                  language={language.indice}
                />

                <button
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 p-1 bg-lightGray dark:bg-darGray rounded-4xl flex items-center justify-center"
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                >
                  <img
                    className="w-8 transition-all duration-300 invert-0 dark:invert dark:rotate-180 dark:opacity-80"
                    src="/Icons/darkModeSwitchIcon.png"
                    alt="Switch theme"
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Button - kept layoutId so it "knows" where it is relative to siblings */}
          <motion.button
            layout
            layoutId="contactBtn"
            onClick={toggleMode}
            className="bg-black clickableMenu hover:scale-105 hover:shadow-xl ease-in-out duration-100 border-2 z-[100000] border-black dark:bg-white hover:opacity-80 font-bold shadow-sm text-center px-4 py-2 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-4xl text-white dark:text-black"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isArabic ? "اتصل بي" : "Contact"}
          </motion.button>

          <AnimatePresence mode="popLayout">
            {mode1 && (
              <motion.div
                key="ellipsis-btn" // Unique Key
                // REMOVED layoutId="spacerBox"
                layout
                onClick={toggleMode}
                className="px-4 hover:mr-1 hover:shadow-xl ease-in-out duration-100 clickableMenu hover:scale-105 rounded-4xl border-2 border-black bg-black dark:hover:bg-white/10 dark:hover:text-lightGray text-white lg:flex items-center justify-center text-2xl hidden"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              layout
              key="mobile-toggle"
              onClick={() => setMenuMobile((v) => !v)}
              aria-label="Toggle menu"
              className="relative flex items-center gap-2 justify-center w-14 cursor-pointer rounded-4xl bg-lightGray dark:bg-darGray text-gray-900 dark:text-gray-100 z-[100000] lg:hidden"
            >
              <span
                className={`${burgerBarClasses} ${
                  menuMobile ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[35%]"
                }`}
              />
              <span
                className={`${burgerBarClasses} ${
                  menuMobile ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[35%]"
                }`}
              />
            </motion.button>
          </AnimatePresence>

          <AnimatePresence>
            {menuMobile && (
              <FullMenuMobile languages={languages} navTexts={navTexts} onToggle={() => setMenuMobile(false)} />
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      <IPadCursor />
    </div>
  );
}