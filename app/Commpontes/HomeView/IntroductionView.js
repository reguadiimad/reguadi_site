import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';

const TypingAnimation = () => {
  const defaultLanguage = useSelector((state) => state.language.indice);
  const isArabic = defaultLanguage === "Ar";

  const content = {
    En: { intro: 'Meet The ', name: 'Reguadi iMad', job: 'A ninja fullStack developer' },
    Fr: { intro: 'Découvrez ', name: 'Reguadi iMad', job: 'Un développeur FullStack Ninja' },
    Ar: { intro: 'تعرف على ', name: 'رَكَّادي عِمادْ', job: 'مطور ويب نينجا شامل' }
  };

  const currentText = content[defaultLanguage] || content['En'];
  const [phase, setPhase] = useState(0);

  useEffect(() => { setPhase(0); }, [defaultLanguage]);

  const ThePhase2 = ({ outlined = false }) => (
    <motion.div className={`ease-in-out duration-150 font-bold text-center text-gray-900 dark:text-gray-100 ${outlined && " hd "} ${isArabic ? 'text-7xl sm:text-9xl lg:text-[150px] xl:text-[180px] my-5 sm:my-10 xl:scale-110 font-arb2' : 'text-[80px] leading-18 sm:leading-relaxed md:text-8xl xl:text-[150px] xl:scale-125 font-clashDisplay'}`}>
      {phase === 2 ? (
        <TypeAnimation key={`name-${defaultLanguage}`} sequence={[currentText.name, () => setPhase(3)]} wrapper="span" speed={50} cursor={true} repeat={0} />
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
    <motion.div className={`flex flex-col items-center mt-2 md:mt-5 w-full px-4 h-auto ${isArabic ? 'font-arb' : ''}`} layout dir={isArabic ? "rtl" : "ltr"} id='typing'>
      
      <motion.div layout className={`flex flex-row items-baseline gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center ${isArabic && "font-arb"}`}>
        <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-nowrap text-gray-800 dark:text-gray-100'>
          {phase === 0 ? (
            <TypeAnimation key={`intro-${defaultLanguage}`} sequence={[currentText.intro, 500, () => setPhase(1)]} wrapper="span" speed={50} cursor={true} repeat={0} />
          ) : (
            <span>{currentText.intro}</span>
          )}
        </h1>

        <AnimatePresence mode="popLayout">
          {phase >= 1 && (
            <motion.span className="font-semibold rounded-md shadow-lg text-white bg-blue-600 dark:bg-orange-500 px-2 py-1 text-[10px] lg:text-lg xl:text-xl font-satoshi -translate-y-1" layout dir="ltr" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {phase === 1 ? (
                <TypeAnimation sequence={['<br/>', 500, () => setPhase(2)]} wrapper="span" speed={75} cursor={false} repeat={0} />
              ) : (
                <span>&lt;br/&gt;</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {phase >= 2 && (
        <motion.div layout className="mt-4 relative flex items-center justify-center">
          <ThePhase2 />
          <div className='w-full h-full absolute top-0 left-0 pointer-events-none'>
            <ThePhase2 outlined={true} />
          </div>
        </motion.div>
      )}

      {phase >= 3 && (
        <motion.div className={`flex overflow-hidden mt-5 ${isArabic ? 'gap-2' : ''}`} key={`job-${defaultLanguage}`} variants={containerVariants} initial="hidden" animate="visible">
          {currentText.job.split(isArabic ? " " : "").map((charOrWord, index) => (
            <span key={index} className="inline-block overflow-hidden h-full align-top">
              <motion.span className="text-lg md:text-2xl text-gray-500 font-semibold inline-block" variants={childVariants}>
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