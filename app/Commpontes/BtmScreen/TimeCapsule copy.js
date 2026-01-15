"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const texts = {
  Eng: {
    showLocal: "Show local time",
    showCasablanca: "Show Reguadi Imad time"
  },
  Ar: {
    showLocal: "عرض التوقيت المحلي",
    showCasablanca: "عرض توقيت ركادي عماد"
  },
  Fr: {
    showLocal: "Afficher l'heure locale",
    showCasablanca: "Afficher l'heure de Reguadi Imad"
  }
};

/**
 * Format a date object into parts for animation.
 */
const formatTimeParts = (date, timeZone, language) => {
  const locales = {
    Eng: 'en-US',
    Ar: 'ar-MA',
    Fr: 'fr-FR'
  };

  const dateOptions = {
    weekday: "short",
    month: "short",
    timeZone: timeZone,
  };
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: language === 'Ar',
    timeZone: timeZone,
  };

  const locale = locales[language] || 'en-US';
  const day = date.getDate();
  let datePrefix = new Intl.DateTimeFormat(locale, dateOptions).format(date);
  
  // Clean up French format
  if (language === 'Fr') {
    datePrefix = datePrefix
      .replace(/\./g, '') // Remove dots
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' ');
  }
  const formattedTime = new Intl.DateTimeFormat(locale, timeOptions).format(date);

  let time = "";
  let ampm = "";
  
  // Extract hours and minutes directly from the date object
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert to 12-hour format for all languages
  const hour12 = hours % 12 || 12;
  time = `${hour12}:${minutes.toString().padStart(2, '0')}`;
  
  if (language === 'Ar') {
    ampm = hours >= 12 ? 'م' : 'ص';
  } else if (language === 'Fr') {
    ampm = hours >= 12 ? 'p' : 'a';
  } else {
    // English
    ampm = hours >= 12 ? 'p' : 'a';
  }

  return {
    datePrefix: `${datePrefix} `,
    day: String(day).padStart(2, "0"),
    time: time,
    ampm: ampm,
  };
};

// Animation settings
const slideAnimation = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-100%", opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

const AnimatedPart = ({ value }) => (
  <div
    className="flex items-center justify-center"
    style={{
      position: "relative",
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "bottom",
    }}
  >
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={value}
        initial={slideAnimation.initial}
        animate={slideAnimation.animate}
        exit={slideAnimation.exit}
        transition={slideAnimation.transition}
        style={{ display: "inline-block", position: "relative" }}
      >
        {value === " " ? "\u00A0" : value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const AnimatedText = ({ text }) => (
  <span style={{ display: "inline-flex" }}>
    {text.split("").map((char, index) => (
      <AnimatedPart key={index} value={char} />
    ))}
  </span>
);

export default function TimeCapsule() {
  const language = useSelector((state) => state.language);
  const [isCasablancaTime, setIsCasablancaTime] = useState(false);
  const [timeParts, setTimeParts] = useState({
    datePrefix: "",
    day: "",
    time: "",
    ampm: "",
  });
  const [isHovered, setIsHovered] = useState(false);
  
  const isArabic = language.indice === "Ar";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const newTimeParts = formatTimeParts(
        now,
        isCasablancaTime ? "Africa/Casablanca" : undefined,
        language.indice
      );
      setTimeParts(newTimeParts);
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000 * 60);

    return () => clearInterval(timerId);
  }, [isCasablancaTime, language]);

  const toggleTimezone = () => {
    setIsCasablancaTime((prev) => !prev);
  };

  return (
    <div
      className={`relative  p-2 hover:scale-105 transition-transform rounded-4xl cursor-pointer bg-white dark:bg-darGray  ease-in-out duration-200 border dark:border-[2.5px] border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10  items-center justify-center  ${isArabic ? "flex-row-reverse" : ""}`}
      onClick={toggleTimezone}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layout
          
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute backdrop-blur-xs  flex justify-center items-center -top-12 whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-4xl bg-black/5 dark:bg-white/10 text-darGray dark:text-lightGray shadow-xl border dark:border-white/10 border-black/5"
          >
            <div className="relative h-4 w-44 overflow-hidden font-light">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${
                  isCasablancaTime ? "-translate-y-full" : "translate-y-0"
                } ${isArabic ? "font-arb" : ""}`}
                aria-hidden={isCasablancaTime}
              >
                {texts[language.indice].showCasablanca}
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${
                  isCasablancaTime ? "translate-y-0" : "translate-y-full"
                } ${isArabic ? "font-arb" : ""}`}
                aria-hidden={!isCasablancaTime}
              >
                {texts[language.indice].showLocal}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-4xl backdrop-blur-sm bg-lightGray dark:bg-darGray font-semibold hover:font-bold px-3 py-1.5 hover:shadow-md text-darGray dark:text-lightGray flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={(isCasablancaTime ? "casa" : "local")}
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex items-center ${isArabic&&'flex-row-reverse gap-1'} `}
          >
            <span className="mr-1">{timeParts.datePrefix}</span>
            <AnimatedText text={timeParts.day} />
            <span className="mx-1">•</span>
            <AnimatedText text={timeParts.time} />
            <div className="ml-1 flex items-center">
              <AnimatedPart value={timeParts.ampm} />
             {language.indice!=="Ar"&&<span>m</span>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
