import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import CrystalToggle from './CrystalTogle';
import BackendGearsDisplay from './CrystalGears';
import Monoco from '@monokai/monoco-react';

const TypingAnimation = ({ onComplete }) => {
  const defaultLanguage = useSelector((state) => state.language.indice);
  const isArabic = defaultLanguage === "Ar";

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

  useEffect(() => {
    if (phase >= 3) onComplete(true);
  }, [phase]);

  const ThePhase2 = ({ outlined = false, opacityHd = true }) => (
    <motion.div className={`ease-in-out duration-150 font-bold text-center text-gray-900 dark:text-gray-100 ${!opacityHd && outlined && "opacity-0"}  ${isArabic ? `text-8xl -mr-[10%] sm:mr-0 sm:text-9xl lg:text-[150px] xl:text-[180px] my-5 sm:my-10 2xl:my-20  xl:scale-125 font-arb2 ${outlined && " hdAr   "}` : ` ${outlined && " hdMob  dark:text-gray-100 "} text-[80px]   leading-18 sm:leading-relaxed md:text-[7rem]  lg:text-9xl xl:text-[150px] 2xl:scale-125 font-clashDisplay`}`}>
      {phase === 2 ? (<TypeAnimation key="name-anim" sequence={[currentText.name, () => setPhase(3)]} wrapper="span" speed={50} cursor={true} repeat={0} />) : phase > 2 ? (<span>{currentText.name}</span>) : null}
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
    <motion.div className={`flex  flex-col items-center  w-full px-4 h-auto ${isArabic ? 'font-arb' : ''}`} layout dir={isArabic ? "rtl" : "ltr"} id='typing'>
      <motion.div layout className={`flex z-10 flex-row items-baseline gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center ${isArabic && "font-arb"}`}>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-nowrap text-gray-800 dark:text-gray-100'>
          {phase === 0 ? (<TypeAnimation key="intro-anim" sequence={[currentText.intro, 500, () => setPhase(1)]} wrapper="span" speed={50} cursor={true} repeat={0} />) : (<span>{currentText.intro}</span>)}
        </h1>

        <AnimatePresence mode="popLayout">
          {phase >= 1 && (
            <Monoco borderRadius={13} smoothing={1} clip={true} className="relative z-10 shadow-lg text-white bg-blue-600 dark:bg-orange-500 px-2 py-1 text-[10px] md:text-sm lg:text-lg xl:text-xl font-satoshi -translate-y-1">
              <motion.span className="font-bold w-full h-full  " layout dir="ltr" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{phase === 1 ? (<TypeAnimation sequence={['<br/>', 500, () => setPhase(2)]} wrapper="span" speed={75} cursor={false} repeat={0} />) : (<span>&lt;br/&gt;</span>)}</motion.span>
            </Monoco>
            )}
        </AnimatePresence>

      </motion.div>
      {phase >= 2 && (
        <motion.div dir={'ltr'} layout className="mt-2 sm:-mt-2 md:mt-0 lg:-mt-4 xl:mt-0    relative flex items-center justify-center w-full ">
          <ThePhase2 />
         
          <div className='w-full h-full z-10 absolute top-0 left-0 pointer-events-none '><ThePhase2 outlined={true} opacityHd={phase >= 3} /></div>
          <div className={`h-[100%] lg:-top-[10%]    ${isArabic ? "2xl:w-[60%] lg:w-[60%] xl:w-[70%] md:w-[70%] sm:w-[80%] w-[90%] sm:right-auto h-[90%] " : "md:w-full xl:w-[75%] sm:w-[90%] lg:w-[85%] w-full"} absolute pointer-events-none flex flex-col sm:flex-row items-center justify-center`}>
            <div className={`w-full h-[50%] sm:w-[50%] sm:h-full flex items-center ${phase >= 3 ? "opacity-100" : "opacity-0"}`}><CrystalToggle /></div>
            <div className={`w-full h-[50%] sm:w-[50%] sm:h-full flex items-center  ${phase >= 3 ? "opacity-100" : "opacity-0"}`}><BackendGearsDisplay isArabic={isArabic}/></div>
          </div> 
        </motion.div>
      )}
      {phase >= 3 && (
        <motion.div className={`flex overflow-hidden   mt-5 ${isArabic ? 'gap-2' : ''}`} key="job-container" variants={containerVariants} initial="hidden" animate="visible">
          {currentText.job.split(isArabic ? " " : "").map((charOrWord, index) => (
            <span key={index} className="inline-block overflow-hidden h-full align-top">
              <motion.span className="text-base md:text-lg  lg:text-xl 2xl:text-2xl text-darGray font-semibold inline-block" variants={childVariants}>{!isArabic && charOrWord === " " ? "\u00A0" : charOrWord}{isArabic && "\u00A0"}</motion.span>
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TypingAnimation;