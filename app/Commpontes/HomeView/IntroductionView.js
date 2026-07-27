import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TypeIt from 'typeit-react';
import { motion, AnimatePresence, spring } from 'framer-motion';
import CrystalToggle from './CrystalTogle';
import BackendGearsDisplay from './CrystalGears';
import Monoco from '@monokai/monoco-react';

const TypingAnimation = ({ onComplete }) => {
  const defaultLanguage = useSelector((state) => state.language.indice);
  const isArabic = defaultLanguage === "Ar";
  const wrapChar = (char) =>
  `<span class="fade-char">${char === ' ' ? '&nbsp;' : char}</span>`;

   const wrapChar2 = (char) =>
  `<span class="fade-char2">${char === ' ' ? '&nbsp;' : char}</span>`;
   const springTransition = {
    type: 'spring',
    stiffness: 380,
    damping: 26,
    mass: 0.8,
  };

  const content = {
    En: { 
      intro: 'Meet The ', 
      name: 'Reguadi Imad', 
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
  const [phase, setPhase] = useState(0);

  // Reset phase when language changes to re-trigger smooth animation sequence
  useEffect(() => {
    setPhase(0);
  }, [defaultLanguage]);

  // Notify parent component when phase 3 is reached
  useEffect(() => {
    if (phase >= 3 && onComplete) {
      onComplete(true);
    }
  }, [phase, onComplete]);

  const ThePhase2 = ({ outlined = false, opacityHd = true }) => (
  <motion.div
   initial={{opacity:outlined?0:1}} animate={{opacity:1}} transition={{duration:outlined?0.6:0,delay:outlined?1.4:0}}
    className={`ease-in-out duration-150 font-bold font-NumFont text-center text-gray-900 dark:text-gray-100 ${
      !opacityHd && outlined && "opacity-0"
    } ${
      isArabic
        ? `text-8xl -mr-[10%] sm:mr-0 sm:text-9xl  lg:text-[150px] xl:text-[180px] my-5 sm:my-10 2xl:my-20 xl:scale-125 font-arb2 ${
            outlined && " hdAr "
          }`
        : `${
            outlined && " hdMob dark:text-gray-100 "
          } text-[80px] leading-18 sm:leading-relaxed md:text-[6.784rem]  font-black lg:text-9xl xl:text-[150px] 2xl:scale-125 font-clashDisplay`
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

          // Type out each character directly wrapped in wrapChar
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  };

  const childVariants = {
    hidden: { y: isArabic ? "50%" : "-100%", filter: "blur(10px)", opacity: 0 },
    visible: { y: "0%", filter: "blur(0px)", opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div key={defaultLanguage} className={`flex flex-col items-center w-full px-4 h-auto ${isArabic ? 'font-arb' : ''}`}
      dir={isArabic ? "rtl" : "ltr"} id="typing" 
    >
      <motion.div  className={`flex z-10  flex-row items-end gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center   h-10 sm:h-12 md:h-14   2xl:h-16  ${isArabic && "font-arb"}`}>
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
                  // Create typo using lowercase versions of the first 2 characters
                  const typoChar1 = chars[0].toLowerCase();
                  const typoChar2 = chars[1].toLowerCase();

                  // 1. Type the typo
                  instance
                    .type(wrapChar(typoChar1)).pause(210)
                    .type(wrapChar(typoChar2)).pause(120)
                    // 2. Erase the typo (delete 1, pause, delete 1, pause)
                    .delete(1).pause(100)
                    .delete(1).pause(160);
                }

                // 3. Type out the actual string character by character
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


      <motion.div className='w-0  overflow-visible ' animate={{width:phase >= 1?"auto":"0px"}} transition={{type:"spring",duration:0.1}} >
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
                        
                  // Defer state update slightly so TypeIt can safely finish its lifecycle
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
        <motion.div
          dir="ltr"
          layout 
          transition={{ ...springTransition, delay: 0.1 }}
          className="mt-2 font-clashDisplay sm:-mt-2 md:mt-0 lg:-mt-4 xl:mt-0 relative flex items-center justify-center w-full"
        >
          <ThePhase2 />

          <div className="w-full h-full z-10 absolute top-0 left-0 pointer-events-none">
            <motion.h1   className={`${phase >= 3?"opacity-100":"opacity-0"} ease-in-out transition-opacity duration-500 font-bold  text-center text-gray-900 dark:text-gray-100
             ${isArabic? "text-8xl -mr-[10%] sm:mr-0 sm:text-9xl  lg:text-[150px]  xl:text-[180px] my-5 sm:my-10 2xl:my-20 xl:scale-125 font-arb2 hdAr" : "hdMob dark:text-gray-100 text-[80px] leading-18 sm:leading-relaxed md:text-[6.784rem]  font-black lg:text-9xl xl:text-[150px] 2xl:scale-125 font-clashDisplay"}`}>
              {currentText.name}
            </motion.h1>
          </div>

          <div
            className={`h-[100%] lg:-top-[10%] ${
              isArabic
                ? "2xl:w-[60%] lg:w-[60%] xl:w-[70%] md:w-[70%] sm:w-[80%] w-[90%] sm:right-auto h-[90%]"
                : "md:w-full xl:w-[75%] sm:w-[90%] lg:w-[85%] w-full"
            } absolute pointer-events-none flex flex-col sm:flex-row items-center justify-center`}
          >
            {/* --- 1. Crystal Toggle (Comes from Left) --- */}
            <motion.div
              initial={{ x: "-100vw", opacity: 0 }}
              animate={
                phase >= 3
                  ? { x: 0, opacity: 1,scale:1}
                  : { x: 0, opacity: 0,scale:0}
              }
              transition={{ duration: 2,type:"spring",delay:0.7,mass:1.1 }}
              className="w-full h-[50%] sm:w-[50%] sm:h-full flex items-center"
            >
              <CrystalToggle />
            </motion.div>

            {/* --- 2. Backend Gears Display (Comes from Right with Delay) --- */}
            <motion.div
              initial={{ x: "100vw", opacity: 0 }}
              animate={
                phase >= 3
                  ? { x: 0, opacity: 1,scale:1}
                  : { x: 0, opacity: 0,scale:0}
              }
              transition={{ duration: 1.4,type:"spring",delay:1,mass:1}}
              className="w-full h-[50%] sm:w-[50%] sm:h-full flex items-center"
            >
              <BackendGearsDisplay isArabic={isArabic} />
            </motion.div>
          </div>
        </motion.div>
      )}

      {phase >= 3 && (
        <motion.div
          className={`flex overflow-hidden mt-5 ${isArabic ? 'gap-2' : ''}`}
          key="job-container"
          variants={containerVariants}
          initial="hidden"
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