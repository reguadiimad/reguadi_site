"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../redux/languageSlice";
import SoundWaveIcon from "./SoundWave";
import { setPlayingSound } from "../../redux/soundSlice";

const FullMenuMobile = ({ onToggle,navTexts,languages }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [showDropDownLang, setShowDropDownLang] = useState(false);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const texts = navTexts[language.indice] || navTexts.Eng;
  const isArabic = language.indice === "Ar";
  const playingSound = useSelector((state) => state.sound.playingSound);



  return (
    <motion.div
      transition={{ ease: "circInOut", type: "spring", stiffness: 250, damping: 25 }}
      initial={{ opacity: 0, scaleY: 0.2, y: "-60%" }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.2, y: "60%", duration: 0.2, delay: 0.1 }}
      className="w-screen h-screen bg-lightGray/70 dark:bg-darGray backdrop-blur-xl fixed top-0 left-0 z-[99999] lg:hidden"
    >
      <div className="w-full h-full items-center overflow-scroll pb-20 flex flex-col relative p-2">
        <div dir={isArabic?"rtl":"ltr"} className={`w-[95%]  md:w-[72%] tiny:mt-[80px] short:mt-[15%] medium:mt-[35%] mt-[35%]  flex flex-col `}>
          {texts.map((text, i) => (
            <motion.a
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.08 * i } }}
              className="w-full py-4 font-bold text-6xl drak:text-white flex items-center"
              transition={{ type: "spring", delay: i * 0.11 }}
              onClick={onToggle}
            >
              {i === 0 && <span className={`w-9 h-9 bg-theBlue dark:bg-theOrange ${isArabic?"ml-3":"mr-3"} rounded-full `}></span>}
              {text}
            </motion.a>
          ))}
        </div>
        <div className={`fixed bottom-10  flex items-stretch justify-center pb-10 p-6 gap-2 ${isArabic ? "flex-row-reverse left-0":"right-0"}`}>
          <AnimatePresence>
            <motion.div
              initial={{ x: 40, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -40, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              onClick={() => setShowDropDownLang(!showDropDownLang)}
              className="px-2 border-2 border-darGray text-darGray dark:border-lightGray dark:text-lightGray rounded-4xl flex items-center justify-center text-base font-bold gap-2 relative cursor-pointer"
            >
              {language.value}
              <FontAwesomeIcon className={`${showDropDownLang && "rotate-180"} ease-in-out duration-300`} icon={faCaretUp} />
              <AnimatePresence>
                {showDropDownLang && (
                  <motion.div
                    key="dropdown"
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 70, opacity: 0 }}
                    transition={{ type: "spring" }}
                    className={` w-full absolute -top-[300%] border-2 p-1 left-0 px-2 border-darGray text-darGray dark:border-lightGray dark:text-lightGray rounded-2xl`}
                  >
                    {languages.filter(lang => lang.indice !== language.indice).map(lang => (
                      <p
                        key={lang.indice}
                        onClick={() => {
                          dispatch(setLanguage(lang));
                          setShowDropDownLang(false);
                        }}
                        className={`py-1 hover:underline clickable ${lang.indice==="Ar"&&"font-arb"}`}
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
             <SoundWaveIcon isMobile={true} onToggle={() => dispatch(setPlayingSound(!playingSound))} isPlaying={playingSound} language={language.value} />
            <motion.button
              key="theme-toggle"
              initial={{ x: 40, opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 360 }}
              exit={{ x: -40, opacity: 0, scale: 0.8, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
              className="cursor-pointer bg-lightGray dark:bg-darGray rounded-4xl flex items-center justify-center"
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            >
              <img
                className="w-9 transition-all border-2 border-transparent duration-300 invert-0 dark:invert dark:rotate-180 dark:opacity-80"
                src="/Icons/darkModeSwitchIcon.png"
                alt="Switch theme"
              />
            </motion.button>
               

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
export default FullMenuMobile;

