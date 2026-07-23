import React, { useState } from 'react';
import TypeIt from 'typeit-react';
import { motion, AnimatePresence } from 'framer-motion';
import Monoco from '@monokai/monoco-react';
import { useSelector } from 'react-redux';
import CrystalToggle from './CrystalTogle';
import BackendGearsDisplay from './CrystalGears';

// Helper function to wrap typed characters in an animating span
const wrapChar = (char, extraClass = '') =>
  `<span class="fade-char ${extraClass}">${char === ' ' ? '&nbsp;' : char}</span>`;
const wrapChar2 = (char) =>
  `<span class="fade-char2">${char === ' ' ? '&nbsp;' : char}</span>`;

const HeroTyping = () => {
  const [showMonoco, setShowMonoco] = useState(false);
  const [isFirstLineComplete, setIsFirstLineComplete] = useState(false);
  const [isSecondeLineComplete, setIsSecondeLineComplete] = useState(false);
  const defaultLanguage = useSelector((state) => state.language.indice);
  const isArabic = defaultLanguage === "Ar";

  // Apple-style spring physics configuration
  const springTransition = {
    type: 'spring',
    stiffness: 380,
    damping: 26,
    mass: 0.8,
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-center px-4 overflow-visible">
    
      <motion.div 
        layout 
        transition={springTransition}
        className="z-10 flex items-end justify-center gap-2"
      >
        {/* Step 1: Main Intro Header */}
        <motion.h1 
          layout
          className=" max-[103px]:text-[8px] max-[200px]:-mr-2 max-[158px]:text-[10px]  max-[248px]:text-[10px]   max-[340px]:text-[18px]  text-3xl sm:text-4xl md:text-5xl -mb-1  font-extrabold text-nowrap text-gray-800 dark:text-gray-100 "
        >
          <TypeIt
            options={{
              lifeLike: true,
              speed: 0,
              html: true,
              cursor: true,
              afterComplete: (instance) => {
                instance.destroy();
                setShowMonoco(true);
              },
            }}
            getBeforeInit={(instance) => {
              instance
                .type(wrapChar("m")).pause(210)
                .type(wrapChar("e")).pause(120)
                .delete(1).pause(100)
                .delete(1).pause(160)
                .type(wrapChar("M")).pause(100)
                .type(wrapChar("e")).pause(90)
                .type(wrapChar("e")).pause(80)
                .type(wrapChar("t")).pause(106)
                .type(wrapChar(" ")).pause(133)
                .type(wrapChar("t")).pause(118)
                .type(wrapChar("h")).pause(57)
                .type(wrapChar("e")).pause(85)
                .type(wrapChar(" "));

              return instance;
            }}
          />
        </motion.h1>

        {/* Step 2: Monoco Squircle Badge */}
        <AnimatePresence mode="wait">
          {showMonoco && (
            <Monoco
              borderRadius={13}
              smoothing={1}
              clip={true}
              className="max-[240px]:scale-[0.3]   max-[340px]:scale-[0.6] origin-bottom-left relative z-10 shadow-lg text-white bg-blue-600 dark:bg-orange-500 px-1 py-0.5 text-[10px] md:text-sm lg:text-lg  font-satoshi"
            >
              <span className="font-bold w-full h-full" dir="ltr">
                <TypeIt
                  options={{
                    lifeLike: false,
                    speed: 0,
                    html: true,
                    cursor: true,
                    afterComplete: (instance) => {
                      instance.destroy();
                      setIsFirstLineComplete(true);
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
              </span>
            </Monoco>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Step 3: Phase 2 Reveal (Waits 1 second before killing the cursor) */}
      <AnimatePresence>
        {isFirstLineComplete && (
          <motion.div
            layout 
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-center w-full relative p-0 m-0 overflow-visible"
          >
            <h2 className="max-[113px]:hidden max-[103px]:text-[12px] max-[158px]:text-[20px] max-[248px]:text-[30px] max-[248px]:leading-8 max-[340px]:text-[48px] text-[70px]   leading-18 sm:text-[80px] sm:leading-relaxed md:text-[95px] font-black lg:text-9xl xl:text-[150px] 2xl:scale-125 font-clashDisplay">
              <TypeIt 
                options={{
                  lifeLike: true,
                  speed: 0,
                  cursor: true,
                  html: true,
                  afterComplete: (instance) => {
                    instance.destroy();
                    setIsSecondeLineComplete(true);
                  },
                }}
                getBeforeInit={(instance) => {
                  instance
                    .type(wrapChar("R")).pause(180)
                    .type(wrapChar("e")).pause(100)
                    .type(wrapChar("g")).pause(80)
                    .type(wrapChar("u")).pause(65)
                    .type(wrapChar("a")).pause(80)
                    .type(wrapChar("d")).pause(60)
                    .type(wrapChar("i")).pause(70)
                    // Inserts a line break visible only under 520px
                    .type('<br class="min-[520px]:hidden" />')
                    // Space visible only on 520px and above
                    .type(wrapChar(" ", "max-[519px]:hidden")).pause(80)
                    .type(wrapChar("i")).pause(90)
                    .type(wrapChar("m")).pause(80)
                    .type(wrapChar("a")).pause(90)
                    .type(wrapChar("d")).pause(90)
                    .type(wrapChar(" ")).pause(90)
                    .pause(1000);

                  return instance;
                }}
              />
            </h2>


                      <div
                        className={`h-[100%] lg:-top-[10%] ${
                          isArabic
                            ? "2xl:w-[60%] lg:w-[60%] xl:w-[70%] md:w-[70%] sm:w-[80%] w-[90%] sm:right-auto h-[90%]"
                            : "md:w-full xl:w-[75%] sm:w-[90%] lg:w-[85%] w-full  "
                        } absolute pointer-events-none flex flex-col sm:flex-row items-center justify-center left-[12.5%]`}
                      >
                        <div
                          className={`w-full h-[50%]  sm:w-[50%] sm:h-full flex items-center transition-opacity duration-300 ${
                            isSecondeLineComplete? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <CrystalToggle />
                        </div>
                        <div
                          className={`w-full h-[50%] sm:w-[50%] sm:h-full flex items-center transition-opacity duration-300 ${
                            isSecondeLineComplete ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <BackendGearsDisplay isArabic={isArabic} />
                        </div>
                      </div>

             {isSecondeLineComplete && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ duration: 0.1, ease: "easeInOut" }}  
                 className='w-full absolute top-0 left-0 text-center'
               >
                <h2 className=" max-[103px]:text-[12px] max-[158px]:text-[20px]  max-[248px]:text-[30px] max-[248px]:leading-8  max-[340px]:text-[48px] text-[70px]   hdMob  sm:text-[80px] leading-18 sm:leading-relaxed md:text-[95px] font-black lg:text-9xl xl:text-[150px] 2xl:scale-125 font-clashDisplay">
                  Reguadi
                  <br className="min-[520px]:hidden" />
                  <span className="max-[519px]:hidden">&nbsp;</span>
                  imad{"\u00A0"}
                </h2>

                
               </motion.div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroTyping;