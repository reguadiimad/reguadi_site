import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';

const TypingAnimation = () => {
  // 1. Get Language from Redux
  const defaultLanguage = useSelector((state) => state.language.indice); // "En", "Fr", "Ar"
  
  const isArabic = defaultLanguage === "Ar";

  // 2. Define Content Dictionary
  const content = {
    En: {
      introSequence: ['Meet The Re', 1000, 'Meet The '], // Typo effect: "Re" -> backspace -> ""
      staticIntro: 'Meet The ',
      name: 'Reguadi iMad',
      job: 'A ninja fullStack developer'
    },
    Fr: {
      introSequence: ['Découvrez Le', 1000, 'Découvrez '],
      staticIntro: 'Découvrez ',
      name: 'Reguadi iMad',
      job: 'Un développeur FullStack Ninja'
    },
    Ar: {
      introSequence: ['تعرف على الـ', 1000, 'تعرف على '],
      staticIntro: 'تعرف على ',
      name: 'رَكَّادي عِمادْ',
     job: 'مطور ويب نينجا شامل'
    }
  };

  // Fallback to English if language is undefined
  const currentText = content[defaultLanguage] || content['En'];

  // 3. State management
  const [phase, setPhase] = useState(0);

  // Reset animation when language changes
  useEffect(() => {
    setPhase(0);
  }, [defaultLanguage]);


  // --- Sub-components & Variants ---

  // The Big Name Component
  const ThePhase2 = () => {
    return (
      <motion.div
        // Adjust font size slightly for Arabic to make it legible
        className={`
          ease-in-out duration-150 font-bold text-center text-gray-900 dark:text-gray-100 
          ${isArabic ? 'text-8xl sm:text-9xl  lg:text-[150px] xl:text-[200px] my-10  font-arb2' : 'text-[52px] scale-y-110 sm:scale-y-100 md:text-8xl xl:text-9xl font-clashDisplay'}
        `}
      >
        {phase === 2 ? (
          <TypeAnimation
            // key forces re-render on lang change
            key={`name-${defaultLanguage}`} 
            sequence={[
              currentText.name,
              () => setTimeout(() => setPhase(3), 100),
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            repeat={0}
          />
        ) : phase > 2 ? (
          <span>{currentText.name}</span>
        ) : null}
      </motion.div>
    );
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, 
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: isArabic ? "50%" : "-100%", // Arabic slides up, Latin slides down
      filter: "blur(10px)",
      opacity: 0,
    },
    visible: {
      y: "0%",
      filter: "blur(0px)",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div 
      layout 
      // RTL for Arabic, LTR for others
      dir={isArabic ? "rtl" : "ltr"}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        flex flex-col items-center mt-2 md:mt-5 w-full px-4  h-auto
        ${isArabic ? 'font-arb' : ''} 
      `}
      id='typing'
    >
      
      {/* Row 1: "Meet The" + Badge */}
      <motion.div 
        layout
        className={`flex flex-row items-baseline gap-2 sm:gap-3 md:gap-4  flex-wrap justify-center ${isArabic&&"font-arb"}`}
      > 
        {/* 1. Intro Text */}
        <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-nowrap text-gray-800 dark:text-gray-100'>
          {phase === 0 ? (
            <TypeAnimation
              key={`intro-${defaultLanguage}`}
              sequence={[
                ...currentText.introSequence, 
                () => setPhase(1)
              ]}
              wrapper="span"
              speed={50}
              cursor={true}
              repeat={0}
            />
          ) : (
            <span>{currentText.staticIntro}</span>
          )}
        </h1>

        {/* 2. "<br/>" Badge */}
        <AnimatePresence mode="popLayout">
          {phase >= 1 && (
            <motion.span
              layout
              dir="ltr" // Always keep code badge LTR
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`
                font-semibold rounded-md shadow-lg
                text-white bg-blue-600 dark:bg-orange-500 dark:text-white
                px-2 py-1 text-[10px] lg:text-lg xl:text-xl font-satoshi
                -translate-y-1
              `}
            >
              {phase === 1 ? (
                <TypeAnimation
                  sequence={['<br/>', 500, () => setPhase(2)]}
                  wrapper="span"
                  speed={50}
                  cursor={true}
                  repeat={0}
                />
              ) : (
                <span>&lt;br/&gt;</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Name */}
      {phase >= 2 && (
         <motion.div layout className="mt-4">
            <ThePhase2/>
         </motion.div>
      )}

      {/* 4. Job Title (The complex part) */}
      {phase >= 3 && (
        <motion.div
          key={`job-${defaultLanguage}`} // Re-animate on language change
          className={`flex overflow-hidden mt-5 ${isArabic ? 'gap-2' : ''}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LOGIC: 
             If Arabic: Split by SPACE (" ") to keep letters connected.
             If En/Fr: Split by CHAR ("") for cool letter staggering.
          */}
          {currentText.job.split(isArabic ? " " : "").map((charOrWord, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden h-full align-top"
            >
              <motion.span
                variants={childVariants}
                className={`text-lg md:text-2xl text-gray-500 font-semibold inline-block ${isArabic}`}
              >
                {/* Add non-breaking space if splitting by char and we hit a space */}
                {!isArabic && charOrWord === " " ? "\u00A0" : charOrWord}
              </motion.span>
            </span>
          ))}
        </motion.div>
      )}



    </motion.div>
  );
};

export default TypingAnimation;