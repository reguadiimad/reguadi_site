"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Monoco from "@monokai/monoco-react";
import FullMenuMobile from "./FullMenuMobile";

const languages = [
  { indice: "Eng", value: "English " },
  { indice: "Ar", value: "العربي" },
  { indice: "Fr", value: "Francais" },
];

export default function RightSection({ mode1, toggleMode }) {
  const [menuMobile, setMenuMobile] = useState(false);
  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";

  const burgerBarClasses =
    "absolute block h-1 w-8 rounded-full bg-darGray dark:bg-lightGray ";

  return (
    <>
      {/* Contact Button */}
      <Monoco
        smoothing={1}
        clip={true}
        className="bg-black rounded-[14px] lg:rounded-[18px] clickableMenu flex items-center justify-center hover:scale-105 hover:shadow-xl ease-in-out duration-100 z-[100000] hover:opacity-80 font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] shadow-sm dark:bg-white text-center px-4 py-2 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-white dark:text-black transition-colors"
      >
        <motion.button
          key={mode1}
          layout
          layoutId="contactBtn"
          onClick={toggleMode}
          initial={{ opacity: 1, scale: 1, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 1, scale: 1, x: 20 }}
          className="text-white dark:text-black transition-colors"
          transition={{ type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isArabic ? "اتصل بي" : "Contact"}
        </motion.button>
      </Monoco>

      <AnimatePresence mode="popLayout">
        <motion.div
          key="ellipsis-btn"
          layoutId="ellipsis-btn"
          onClick={toggleMode}
          style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          className="hover:shadow-xl origin-right clickableMenu rounded-full bg-black dark:border-white dark:bg-white dark:text-black text-white lg:flex items-center justify-center text-2xl hidden"
          transition={{
            type: "spring",
            opacity: { duration: mode1 ? 0.6 : 0.4 },
            scale: { duration: mode1 ? 0.4 : 0.1 },
            width: { duration: 0.1 },
            x: { duration: mode1 ? 0.75 : 0.3 },
            mass: 1.15,
          }}
          initial={false}
          animate={{
            opacity: mode1 ? 1 : 0,
            scale: mode1 ? 1 : 1,
            x: mode1 ? 0 : (isArabic ? 60 : -60),
            color: mode1 ? "" : "transparent",
            width: mode1 ? "auto" : 0,
            paddingLeft: mode1 ? "14px" : 0,
            paddingRight: mode1 ? "14px" : 0,
            marginLeft: mode1 && !isArabic ? "8px" : 0,
            marginRight: mode1 && isArabic ? "6px" : 0,
            pointerEvents: mode1 ? "auto" : "none",
          }}
          whileHover={{ scale: 1.05, duration: 0.2, fontStyle: "bold" }}
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </motion.div>

        {/* Mobile Menu Toggle */}
        <motion.button
          layoutId="ellipsis-btn"
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