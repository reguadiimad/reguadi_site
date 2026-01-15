import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';

export default function AnimatedWelcome({ onAnimationComplete}) {
    // State for animation steps: 0 = initial, 1 = fade in/move up, 2 = expand
    const [animationStep, setAnimationStep] = useState(0);

    const defaultLanguage = useSelector((state) => state.language.indice);

    const isArabic = defaultLanguage === "Ar";
    const isFrench = defaultLanguage === "Fr";

    // Language text
    const fullText = isArabic
        ? "مرحبًا بك في مساحتي"
        : isFrench
        ? "Bienvenue dans mon espace"
        : "Welcome to my space";

    // Animation phase controller
    useEffect(() => {
        // After 100ms, trigger fade-in and move-up (Step 1)
        const step1Timer = setTimeout(() => {
            setAnimationStep(1);
        }, 100);

        // After 100ms + 700ms (duration of fade-in), trigger expansion (Step 2)
        const step2Timer = setTimeout(() => {
            setAnimationStep(2);
        }, 100 + 700); // Total 800ms

        // After 800ms + 700ms (duration of expansion), text fade-in starts.
        // The text animation takes 300ms.
        // After text starts (1500ms) + text anim (300ms) + 1s delay, call complete.
        const completeTimer = setTimeout(() => {
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, 1500 + 300 + 500); // Total 2800ms

        return () => {
            clearTimeout(step1Timer);
            clearTimeout(step2Timer);
            clearTimeout(completeTimer);
        };
    }, [onAnimationComplete]);

    // Variants for the main container's initial appearance
    const containerVariants = {
        hidden: { opacity: 0, y: 32, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", damping: 15, stiffness: 200 } 
        }
    };

    // Variants for the text's appearance
    const textVariants = {
        hidden: { opacity: 0, filter: "blur(4px)" },
        visible: { 
            opacity: 1, 
            filter: "blur(0px)", 
            transition: { delay: 0.3, duration: 0.4 } // Delay to let pill expand first
        }
    };

    // Animations and classes for the container
    // `framer-motion` handles opacity and transform, so we only define shape.
    const containerClasses =
        animationStep < 2
            ? 'w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0' // Step 1: Circle fades in and moves up
            : 'px-5 py-2 sm:px-4 sm:py-2 rounded-full  ';   // Step 2: Expands to final pill shape

    const textDirection = isArabic ? 'rtl' : 'ltr';
    const fontClass = isArabic ? 'font-arb' : '';

    return (
        <>
            {/* The blur keyframes are still needed */}
            <style>
                {`
                    @keyframes fadeInBlur {
                        0% { opacity: 0; filter: blur(4px); }
                        100% { opacity: 1; filter: blur(0); }
                    }
                    .animate-fade-in-blur {
                        animation: fadeInBlur 0.3s ease-out forwards;
                    }
                `}
            </style>

            <motion.div
                layout // This animates the change in shape/size
                transition={{ type: "spring", damping: 25, stiffness: 300 }} // Spring physics for the layout change
                variants={containerVariants}
                initial="hidden"
                animate={animationStep >= 1 ? "visible" : "hidden"}
                className={` backdrop-blur-xs font-satoshi blured
                    flex items-center justify-center overflow-hidden whitespace-nowrap
                    bg-lightGray/50 dark:bg-gray-500/50 text-darGray dark:text-lightGray font-semibold
                    ${containerClasses}
                `}
                dir={textDirection}
            >
                <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate={animationStep === 2 ? "visible" : "hidden"}
                    className={`
                        text-xs sm:text-base ${fontClass}
                        ${isArabic ? 'text-right' : 'text-left'}
                    `}
                >
                    {/* Render the full text at once */}
                    {fullText}
                </motion.div>
            </motion.div>
        </>
    );
}

