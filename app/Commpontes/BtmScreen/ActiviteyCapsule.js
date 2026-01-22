"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import SoundWaveIcon from "../NavBar/SoundWave";
import React, { useRef,useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage,faRightLong } from "@fortawesome/free-solid-svg-icons";
import { capsuleTranslations } from "../../translations/capsuleTranslations";



export default function ActivityCapsule({currentCapsule}) {
    const language = useSelector((state) => state.language);
    const prevLanguage = useRef(language);
    useEffect(() => {
        prevLanguage.current = language;
    }, [language]);

    return (
       <motion.div className="w-full scale-75 lg:scale-[0.8] xl:scale-100 origin-bottom relative flex items-center justify-center gap-2 h-24">
        <AnimatePresence  initial={false}>
            {currentCapsule === "sound" && <SoundCapsule key="sound" />}
            {currentCapsule === "theme" && <ThemeCapsule key="theme" />}
            {currentCapsule === "language" && <LanguageCapsule key="language" prevLanguage={prevLanguage.current} />}
        </AnimatePresence>
        </motion.div>

    );

}

const LanguageCapsule = ({prevLanguage}) => {
    const language = useSelector((state) => state.language);



    const containerVariants = {
        hidden: { y: "120%", opacity: 0, scale: 0.9, transition: { type: "spring"},blur },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" } },
        exit: {
            y: "120%",
            opacity: 0,
            scale: 0.9,
            transition: {
                type: "spring",
              
                delay: 0.3
            }
        }
    };

    const textContainerVariants = {
        hidden: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
        },
        visible: {
            width: "auto",
            marginRight: "2.5rem",
            marginLeft:"2.5rem",
            opacity: 1,
            transition: {
                width: { delay: 0.25, duration: 0.3 },
                when: "beforeChildren",
                delayChildren: 0.3,
                staggerChildren: 0.08
            }
        },
        // This new exit variant ensures the text animates out first.
        exit: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: {
                // 'when: "afterChildren"' makes the parent (the width/opacity) animate after the text lines disappear.
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
                // Give the width a specific duration for a smooth shrink.
                width: { duration: 0.3 },
                opacity: { duration: 0.1 }
            }
        }
    };
    
    // Variant for each individual line of text. No changes needed here.
    const textLineVariants = {
        hidden: { y: -20, opacity: 0, transition: { type: "spring", stiffness: 500, damping: 20 } },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 20 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            // Using the new 'exit' variant to apply the delay
            exit="exit"
            className={`absolute ${language.indice === "Ar" ? "font-arb" : ""}`}
        >
            <motion.div
                layout
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="p-2 bg-lightGray/70 backdrop-blur-xs dark:bg-darGray/80 rounded-full flex items-stretch justify-center shadow-2xl shadow-black/5"
            >
                <motion.div layout="position" className="px-6 py-2 flex items-center justify-center bg-darGray/20 dark:bg-lightGray/40 rounded-full">
                    <FontAwesomeIcon className="text-2xl text-theBlue dark:text-theOrange" icon={faLanguage}/>
                </motion.div>

                {/* Text content wrapped for animation */}
                <motion.div
                    className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                    // Using the new 'exit' variant for the text container
                    exit="exit"
                >
                    <motion.h1
                        variants={textLineVariants}
                        className="text-xl font-bold whitespace-nowrap"
                    >
                        {capsuleTranslations[language.indice].languageSwitched}
                    </motion.h1>
                    <motion.div key={language.indice}  exit={{x: -20,opacity: 0,filter: "blur(20px)"}}initial={{ opacity: 0, x: -15 }} animate={{opacity: 1,x: 0,filter: "blur(0px)"}} transition={{type:"spring",delay:0.3}} className="flex items-center justify-center mt-1 gap-2">
                        {
                            prevLanguage.indice !== language.indice ? (
                        <>
                        <span className="rounded-2xl  px-2 bg-darGray/20 dark:bg-lightGray/20  text-black/50 dark:text-white/50  text-sm">{prevLanguage.indice.toLowerCase()}</span> <FontAwesomeIcon className="text-base text-theBlue dark:text-theOrange" icon={faRightLong}/> <span className="rounded-2xl  px-2 bg-darGray/20 dark:bg-lightGray/20 dark:text-white/50 text-black/50 text-sm">{language.indice.toLowerCase()}</span></>

                            ):(
                                 <span className="rounded-2xl  px-2 bg-darGray/20 dark:bg-lightGray/20 text-black/50 dark:text-white/50 text-sm">{language.indice.toLowerCase()}</span>
                            )
                        }
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}



const ThemeCapsule = () => {
    const language = useSelector((state) => state.language);

    // Variants for the main container.
    // I've added a new 'exit' variant with a delay.
    const containerVariants = {
        hidden: { y: "120%", opacity: 0, scale: 0.9, transition: { type: "spring"} },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" } },
        exit: {
            y: "120%",
            opacity: 0,
            scale: 0.9,
            transition: {
                type: "spring",
                // This delay is the key: it waits for the text to hide and the capsule to shrink before moving down.
                delay: 0.3
            }
        }
    };

    // Variants to orchestrate the text reveal and hide animations.
    // A new 'exit' variant is added for a more controlled sequence.
    const textContainerVariants = {
        hidden: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
        },
        visible: {
            width: "auto",
            marginRight: "2.5rem",
            marginLeft:"2.5rem",
            opacity: 1,
            transition: {
                width: { delay: 0.25, duration: 0.3 },
                when: "beforeChildren",
                delayChildren: 0.3,
                staggerChildren: 0.08
            }
        },
        // This new exit variant ensures the text animates out first.
        exit: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: {
                // 'when: "afterChildren"' makes the parent (the width/opacity) animate after the text lines disappear.
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
                // Give the width a specific duration for a smooth shrink.
                width: { duration: 0.3 },
                opacity: { duration: 0.1 }
            }
        }
    };
    
    // Variant for each individual line of text. No changes needed here.
    const textLineVariants = {
        hidden: { y: -20, opacity: 0, transition: { type: "spring", stiffness: 500, damping: 20 } },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 20 } }
    };
    const theme = useSelector((state) => state.theme.theme);
    

    // Framer Motion spring transition for a bouncy effect
    const spring = {
        type: "spring",
        stiffness: 500,
        damping: 30,
    };
     const isLight = theme === 'light';

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            // Using the new 'exit' variant to apply the delay
            exit="exit"
            className={`absolute ${language.indice === "Ar" ? "font-arb" : ""}`}
        >
            <motion.div
                layout
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="p-2 bg-lightGray/70  backdrop-blur-xs dark:bg-darGray/80 rounded-full flex items-stretch justify-center shadow-2xl shadow-black/10"
            >
                <motion.div layout="position" className={`p-2 w-24 flex spdy sk shadow-inherit bg-darGray/20 dark:bg-lightGray/40 rounded-full `}>
                   <img className={`h-10 spdy opacity-80 ${!isLight&&"rotate-[360deg] invert-100 translate-x-[100%]"}`} src="Icons/darkModeSwitchIcon.PNG"/>
                </motion.div>

                {/* Text content wrapped for animation */}
                <motion.div
                    className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                    // Using the new 'exit' variant for the text container
                    exit="exit"
                >
                    <motion.h1
                        variants={textLineVariants}
                        className="text-xl font-bold whitespace-nowrap"
                    >
                        {capsuleTranslations[language.indice].darkMode}
                    </motion.h1>
                   

                    <motion.p variants={textLineVariants} className="text-sm whitespace-nowrap">
                        {isLight ? capsuleTranslations[language.indice].isOff : capsuleTranslations[language.indice].isOn}
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}



const SoundCapsule = () => {
    const playingSound = useSelector((state) => state.sound.playingSound);
    const language = useSelector((state) => state.language);

    // Variants for the main container.
    // I've added a new 'exit' variant with a delay.
    const containerVariants = {
        hidden: { y: "120%", opacity: 0, scale: 0.9, transition: { type: "spring"} },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" } },
        exit: {
            y: "120%",
            opacity: 0,
            scale: 0.9,
            transition: {
                type: "spring",
                // This delay is the key: it waits for the text to hide and the capsule to shrink before moving down.
                delay: 0.3
            }
        }
    };

    // Variants to orchestrate the text reveal and hide animations.
    // A new 'exit' variant is added for a more controlled sequence.
    const textContainerVariants = {
        hidden: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
        },
        visible: {
            width: "auto",
            marginRight: "2.5rem",
            marginLeft:"2.5rem",
            opacity: 1,
            transition: {
                width: { delay: 0.25, duration: 0.3 },
                when: "beforeChildren",
                delayChildren: 0.3,
                staggerChildren: 0.08
            }
        },
        // This new exit variant ensures the text animates out first.
        exit: {
            width: 0,
            marginRight: 0,
            marginLeft: 0,
            opacity: 0,
            transition: {
                // 'when: "afterChildren"' makes the parent (the width/opacity) animate after the text lines disappear.
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
                // Give the width a specific duration for a smooth shrink.
                width: { duration: 0.3 },
                opacity: { duration: 0.1 }
            }
        }
    };
    
    // Variant for each individual line of text. No changes needed here.
    const textLineVariants = {
        hidden: { y: -20, opacity: 0, transition: { type: "spring", stiffness: 500, damping: 20 } },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 20 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            // Using the new 'exit' variant to apply the delay
            exit="exit"
            className="absolute"
        >
            <motion.div
                layout
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="p-2 bg-lightGray/70 backdrop-blur-xs dark:bg-darGray/80 rounded-full flex items-stretch justify-center shadow-2xl shadow-black/5"
            >
                <motion.div layout="position" className="px-6 py-2 flex items-center justify-center bg-darGray/10 dark:bg-lightGray/40 rounded-full">
                    <SoundWaveIcon isPlaying={playingSound} hoverAllow={false} />
                </motion.div>

                {/* Text content wrapped for animation */}
                <motion.div
                    className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                    // Using the new 'exit' variant for the text container
                    exit="exit"
                >
                    <motion.h1
                        variants={textLineVariants}
                        className="text-xl font-bold whitespace-nowrap"
                    >
                        {capsuleTranslations[language.indice].soundMode}
                    </motion.h1>
                    <motion.p
                        variants={textLineVariants}
                        className="text-sm whitespace-nowrap"
                    >
                        {playingSound ? capsuleTranslations[language.indice].isOn : capsuleTranslations[language.indice].isOff}
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}