import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { text } from '@fortawesome/fontawesome-svg-core';

export default function AnimatedWelcome({ onAnimationComplete}) {
    const [animationStep, setAnimationStep] = useState(0);
    const defaultLanguage = useSelector((state) => state.language.indice);
    const isArabic = defaultLanguage === "Ar";
    const isFrench = defaultLanguage === "Fr";
    const fullText = isArabic? "مرحبًا بك في مساحتي": isFrench? "Bienvenue dans mon espace": "Welcome to my space";

    useEffect(() => {
        const step1Timer = setTimeout(() => setAnimationStep(1), 100);
        const step2Timer = setTimeout(() => setAnimationStep(2), 100 + 700);
        const completeTimer = setTimeout(() => onAnimationComplete && onAnimationComplete(), 2800); 
        return () => { clearTimeout(step1Timer);clearTimeout(step2Timer);clearTimeout(completeTimer);};
    }, [onAnimationComplete]);


    const containerVariants = {
        hidden: { opacity: 0, y: 32, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15, stiffness: 200 } }
    };

    const textVariants = {
        hidden: { opacity: 0, filter: "blur(4px)" },
        visible: {  opacity: 1, filter: "blur(0px)", transition: { delay: 0.3, duration: 0.4 }}
    };

   
    const containerClasses = animationStep < 2 ? 'w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0' : 'px-3 py-2 md:px-5 md:py-2.5 rounded-full  ';
    const textDirection = isArabic ? 'rtl' : 'ltr';
    const fontClass = isArabic ? 'font-arb' : '';

    return (
        <>


            <motion.div className={` blured backdrop-blur-[2px] font-satoshi  flex items-center justify-center overflow-hidden whitespace-nowrap bg-lightGray/50 dark:bg-gray-500/40 text-darGray dark:text-lightGray font-semibold ${containerClasses}`}layout transition={{ type: "spring", damping: 25, stiffness: 300 }} variants={containerVariants} initial="hidden" animate={animationStep >= 1 ? "visible" : "hidden"} dir={textDirection}>
                <motion.div className={` text-xs md:text-base ${fontClass} ${isArabic ? 'text-right' : 'text-left'}`} variants={textVariants} initial="hidden" animate={animationStep === 2 ? "visible" : "hidden"}>
                    {fullText}
                </motion.div>
            </motion.div>

        </>
    );
}

