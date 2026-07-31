import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TypeIt from 'typeit-react';
import { motion } from 'framer-motion';
import Monoco from '@monokai/monoco-react';
import TextPressure from './TextPressure';

const STORAGE_KEY = 'hasSeenTypingAnimation';

const TypingAnimation = ({ onComplete }) => {
  const defaultLanguage = useSelector((state) => state.language.indice);
  const isArabic = defaultLanguage === "Ar";

  // Check if animation was already completed in previous session/load
  const [phase, setPhase] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true' ? 3 : 0;
    }
    return 0;
  });

  // Track if animation sequence has completed (starts true if loaded from localStorage)
  const [isAnimationFinished, setIsAnimationFinished] = useState(() => phase >= 3);

  const wrapChar = (char) =>
    `<span class="fade-char">${char === ' ' ? '&nbsp;' : char}</span>`;

  const wrapChar2 = (char) =>
    `<span class="fade-char2">${char === ' ' ? '&nbsp;' : char}</span>`;

  const content = {
    En: { 
      intro: 'Meet The ', 
      name: 'Reguadi ImAd', 
      job: 'A Creative Full Stack Developer' 
    },
    Fr: { 
      intro: 'Découvrez ', 
      name: 'Reguadi Imad', 
      job: 'Un Développeur Full Stack Créatif' 
    },
    Ar: { 
      intro: 'تعرف على ', 
      name: 'رَكَّادي عِمادْ', 
      job: 'مطور ويب شامل ومُبدع' 
    }
  };

  const currentText = content[defaultLanguage] || content['En'];

  // Save completion state and set isAnimationFinished to true after initial phase 3 reveal
  useEffect(() => {
    if (phase >= 3) {
      localStorage.setItem(STORAGE_KEY, 'true');
      if (onComplete) {
        onComplete(true);
      }

      // Allow initial Phase 3 entry animation to complete before turning off future transitions
      const timer = setTimeout(() => {
        setIsAnimationFinished(true);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: isAnimationFinished ? { duration: 0 } : { staggerChildren: 0.05, delayChildren: 0.2 } 
    },
  };

  const childVariants = {
    hidden: isAnimationFinished 
      ? { y: "0%", filter: "blur(0px)", opacity: 1 } 
      : { y: isArabic ? "50%" : "-100%", filter: "blur(10px)", opacity: 0 },
    visible: { 
      y: "0%", 
      filter: "blur(0px)", 
      opacity: 1, 
      transition: { duration: isAnimationFinished ? 0 : 0.4, ease: "easeOut" } 
    },
  };

  const ThePhase2 = ({ outlined = false, opacityHd = true }) => (
    <motion.div
      initial={isAnimationFinished ? false : { opacity: outlined ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: outlined ? (isAnimationFinished ? 0 : 0.6) : 0, 
        delay: outlined ? (isAnimationFinished ? 0 : 1.4) : 0 
      }}
      className={`ease-in-out duration-150 font-bold font-NumFont text-center text-gray-900 dark:text-gray-100 ${
        !opacityHd && outlined && "opacity-0"
      } ${
        isArabic
          ? `text-8xl -mr-[10%] sm:mr-0 sm:text-9xl lg:text-[150px] xl:text-[180px] my-5 sm:my-10 2xl:my-20 xl:scale-125 font-arb2 ${
              outlined && " hdAr "
            }`
          : `${
              outlined && " hdMob dark:text-gray-100 "
            } text-[80px] leading-18 sm:leading-relaxed md:text-[6.784rem] font-black lg:text-9xl xl:text-[290px] 2xl:scale-125 font-monologue lg:-mt-10 xl:-mt-24`
      }`}
    >
      {phase === 2 ? (
        <TypeIt
          key={currentText.name}
          options={{
            lifeLike: true,
            speed: 0,
            html: true,
            cursor: true,
            afterComplete: () => {
              setTimeout(() => {
                setPhase(3);
              }, 0);
            },
          }}
          getBeforeInit={(instance) => {
            const chars = Array.from(currentText.name);
            chars.forEach((char) => {
              const randomPause = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
              instance.type(wrapChar(char)).pause(randomPause);
            });
            instance.pause(500);
            return instance;
          }}
        />
      ) : phase > 2 ? (
        <span>{currentText.name}</span>
      ) : null}
    </motion.div>
  );

  return (
    <motion.div 
      className={`flex flex-col items-center w-full px-4 h-auto ${isArabic ? 'font-arb' : ''}`}
      dir={isArabic ? "rtl" : "ltr"} 
      id="typing" 
    >
      <motion.div className={`flex z-10 flex-row items-end gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center h-10 sm:h-12 md:h-14 2xl:h-16 ${isArabic && "font-arb"}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-nowrap text-gray-800 dark:text-gray-100">
          {phase === 0 ? (
            <TypeIt
              key={currentText.intro}
              options={{
                lifeLike: true,
                speed: 0,
                html: true,
                cursor: true,
                afterComplete: () => {
                  setTimeout(() => {
                    setPhase(1);
                  }, 0);
                },
              }}

              getBeforeInit={(instance) => {
                const chars = Array.from(currentText.intro);
                if (chars.length >= 2) {
                  const typoChar1 = chars[0].toLowerCase();
                  const typoChar2 = chars[1].toLowerCase();

                  instance
                    .type(wrapChar(typoChar1)).pause(210)
                    .type(wrapChar(typoChar2)).pause(120)
                    .delete(1).pause(100)
                    .delete(1).pause(160);
                }

                chars.forEach((char) => {
                  const randomPause = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
                  instance.type(wrapChar(char)).pause(randomPause);
                });

                instance.pause(500);
                return instance;
              }}
            />
          ) : (
            <span>{currentText.intro}</span>
          )}
        </h1>

        <motion.div 
          className='w-0 overflow-visible' 
          animate={{ width: phase >= 1 ? "auto" : "0px" }} 
          transition={isAnimationFinished ? { duration: 0 } : { type: "spring", duration: 0.1 }}
        >
          {phase >= 1 && (
            <Monoco
              borderRadius={13}
              smoothing={1}
              clip={true}
              className="relative z-10 shadow-lg text-white bg-blue-600 dark:bg-orange-500 px-2 py-1 text-[10px] md:text-sm lg:text-lg xl:text-xl font-satoshi -translate-y-1"
            >
              <span className="font-bold w-full h-full" dir="ltr">
                {phase === 1 ? (
                  <TypeIt
                    options={{
                      lifeLike: true,
                      speed: 0,
                      html: true,
                      cursor: true,
                      afterComplete: () => {
                        setTimeout(() => {
                          setPhase(2);
                        }, 0);
                      },
                    }}
                    getBeforeInit={(instance) => {
                      instance
                        .pause(49)
                        .type(wrapChar2("<")).pause(120)
                        .type(wrapChar2("b")).pause(80)
                        .type(wrapChar2("r")).pause(150)
                        .type(wrapChar2("/")).pause(40)
                        .type(wrapChar2(">")).pause(120)
                        .type(wrapChar2("")).pause(80);

                      return instance;
                    }}
                  />
                ) : (
                  <span>&lt;br/&gt;</span>
                )}
              </span>
            </Monoco>
          )}
        </motion.div>
      </motion.div>

      {phase >= 2 && (
        <TextPressure />
      )}

      {phase >= 3 && (
        <motion.div
          className={`flex overflow-hidden -mt-10 ${isArabic ? 'gap-2' : ''}`}
          key="job-container"
          variants={containerVariants}
          initial={isAnimationFinished ? false : "hidden"}
          animate="visible"
        >
          {currentText.job.split(isArabic ? " " : "").map((charOrWord, index) => (
            <span key={index} className="inline-block overflow-hidden h-full align-top">
              <motion.span
                className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-darGray font-semibold inline-block"
                variants={childVariants}
              >
                {!isArabic && charOrWord === " " ? "\u00A0" : charOrWord}
                {isArabic && "\u00A0"}
              </motion.span>
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TypingAnimation;
