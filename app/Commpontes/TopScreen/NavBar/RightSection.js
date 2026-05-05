"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Monoco from "@monokai/monoco-react";
import FullMenuMobile from "../FullMenuMobile";

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

export default function RightSection({ mode1, toggleMode }) {
  const [menuMobile, setMenuMobile] = useState(false);
  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";

  const burgerBarClasses =
    "absolute block h-1 w-8 rounded-full bg-darGray dark:bg-lightGray transition-all duration-300 ease-in-out";

  return (
    <>
      {/* Contact Button */}
      <Monoco
        borderRadius={18}
        smoothing={1}
        clip={true}
        className="bg-black clickableMenu flex items-center justify-center hover:scale-105 hover:shadow-xl ease-in-out duration-100 z-[100000] hover:opacity-80 font-bold shadow-sm dark:bg-white text-center px-4 py-2 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-white dark:text-black transition-colors"
      >
        <motion.button
          key={mode1}
          layout
          layoutId="contactBtn"
          onClick={toggleMode}
           initial={{ opacity: 0, scale: 1,x:10 }}
            animate={{ opacity: 1, scale: 1,x:0 }}
            exit={{ opacity: 0, scale: 1,x:10 }}
          className="text-white dark:text-black transition-colors"
          transition={{ type: "spring" }}
          whileHover={{ scale: 1.05, }}
          whileTap={{ scale: 0.95 }}
        >
          {isArabic ? "اتصل بي" : "Contact"}
        </motion.button>
      </Monoco>

      <AnimatePresence mode="popLayout">
        {mode1 && (
          <motion.div
            key="ellipsis-btn"
            layout
            onClick={toggleMode}
            className={`px-3.5  hover:shadow-xl origin-right  clickableMenu  ml-2 rounded-full border-2 border-black bg-black dark:border-white dark:bg-white dark:text-black   text-white lg:flex items-center justify-center text-2xl hidden  ${isArabic ? "mr-1.5" : "ml-1.5"}`}
            transition={{ type: "spring",opacity: { duration: 0.55 }, scale: { duration: 0.6 },exit: { duration: 0.8 },mass:1.16 }}
            initial={{ opacity: 0, scale: 0.2,x:-200 }}
            animate={{ opacity: 1, scale: 1,x:0 }}
            exit={{ opacity: 0, scale: 0.2,x:-200 }} 
          whileHover={{ scale: 1.05,duration: 0.2,fontStyle:"bold" }}

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
          className="relative flex items-center gap-2 justify-center w-14 cursor-pointer rounded-4xl bg-lightGray dark:bg-darGray text-gray-900 dark:text-gray-100 z-[100000] lg:hidden transition-colors"
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
          <FullMenuMobile
            languages={languages}
            navTexts={navTexts}
            onToggle={() => setMenuMobile(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
