"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import SoundWaveIcon from "../TopScreen/SoundWave";
import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { capsuleTranslations } from "../../translations/capsuleTranslations";
import Monoco from "@monokai/monoco-react";
import { Glass } from "@samasante/liquid-glass";

const PLAYER_OPTICS2 = {
  clipToShape: false,
  softEdge: true,
  strength: 1.4,
  depth: 0.3,
  curvature: 2,
  bend: 0.6,
  bendWidth: 0.1,
  dispersion: 0.4,
  specular: 0.1,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 1.9,
  brightness: 0,
  thickness: 0,
};

// Optimized container variants: Removed 'scale' which breaks shader initialization
const globalContainerVariants = {
    hidden: { y: "120%", opacity: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: {
        y: "120%",
        opacity: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 200,
            delay: 0.25
        }
    }
};

const globalTextContainerVariants = {
    hidden: {
        width: 0,
        marginRight: 0,
        marginLeft: 0,
        opacity: 0,
        transition: { when: "afterChildren", staggerChildren: 0.03, staggerDirection: -1 }
    },
    visible: {
        width: "auto",
        marginRight: "2.5rem",
        marginLeft: "2.5rem",
        opacity: 1,
        transition: {
            width: { delay: 0.1, duration: 0.3, ease: "easeOut" },
            when: "beforeChildren",
            delayChildren: 0.1,
            staggerChildren: 0.05
        }
    },
    exit: {
        width: 0,
        marginRight: 0,
        marginLeft: 0,
        opacity: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.03,
            staggerDirection: -1,
            width: { duration: 0.25, ease: "easeIn" },
            opacity: { duration: 0.1 }
        }
    }
};

const textLineVariants = {
    hidden: { y: -15, opacity: 0, transition: { type: "spring", stiffness: 400, damping: 22 } },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 22 } }
};

export default function ActivityCapsule({ currentCapsule }) {
    const language = useSelector((state) => state.language);
    const prevLanguage = useRef(language);
    
    useEffect(() => {
        prevLanguage.current = language;
    }, [language]);

    return (
       <motion.div className="w-full scale-[0.7]  lg:scale-[1] xl:scale-100 origin-bottom relative flex items-center pointer-events-none justify-center gap-2  h-24">
            <AnimatePresence initial={false}>
                {currentCapsule === "sound" && <SoundCapsule key="sound" />}
                {currentCapsule === "theme" && <ThemeCapsule key="theme" />}
                {currentCapsule === "language" && <LanguageCapsule key="language" prevLanguage={prevLanguage.current} />}
            </AnimatePresence>
        </motion.div>
    );
}

const LanguageCapsule = ({ prevLanguage }) => {
    const language = useSelector((state) => state.language);

    return (
        <motion.div
            variants={globalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute blured2 overflow-visible rounded-4xl ${language.indice === "Ar" ? "font-arb" : ""}`}
        >
            <Glass optics={{ ...PLAYER_OPTICS2 }} radius={33} className="w-full h-full">
                <Monoco borderRadius={33} smoothing={1} clip={true} className="p-[10px] bg-darGray/20 dark:bg-darGray/20 shadow-2xl shadow-black/5">
                    <div className="w-full h-full flex items-stretch justify-center">
                        <Monoco borderRadius={23} smoothing={1} clip={true} className="px-6 py-2 bg-darGray/20 dark:bg-lightGray/40">
                            <div className="flex items-center justify-center w-full h-full">
                                <FontAwesomeIcon className="text-2xl text-theBlue dark:text-theOrange" icon={faLanguage} />
                            </div>
                        </Monoco>

                        <motion.div
                            className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                            variants={globalTextContainerVariants}
                        >
                            <motion.h1 variants={textLineVariants} className="text-xl font-bold whitespace-nowrap">
                                {capsuleTranslations[language.indice].languageSwitched}
                            </motion.h1>

                            <motion.div 
                                key={language.indice}
                                variants={textLineVariants}
                                initial={{ opacity: 0, x: -15 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ type: "spring", delay: 0.15 }} 
                                className="flex items-center justify-center mt-1 gap-2"
                            >
                                {prevLanguage.indice !== language.indice ? (
                                    <>
                                        <span className="rounded-xl px-2 bg-darGray/20 dark:bg-lightGray/20 text-black/50 dark:text-white/50 text-sm">
                                            {prevLanguage.indice.toLowerCase()}
                                        </span> 
                                        <FontAwesomeIcon className="text-xs text-theBlue dark:text-theOrange" icon={faRightLong} /> 
                                        <span className="rounded-xl px-2 bg-darGray/20 dark:bg-lightGray/20 dark:text-white/50 text-black/50 text-sm">
                                            {language.indice.toLowerCase()}
                                        </span>
                                    </>
                                ) : (
                                    <span className="rounded-xl px-2 bg-darGray/20 dark:bg-lightGray/20 text-black/50 dark:text-white/50 text-sm">
                                        {language.indice.toLowerCase()}
                                    </span>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </Monoco>
            </Glass>
        </motion.div>
    );
};


const ThemeCapsule = () => {
    const language = useSelector((state) => state.language);
    const theme = useSelector((state) => state.theme.theme);
    const isLight = theme === 'light';

    return (
        <motion.div
            variants={globalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute blured2 rounde-4xl overflow-visible ${language.indice === "Ar" ? "font-arb" : ""}`}
        >
            <Glass optics={{ ...PLAYER_OPTICS2 }} radius={36} className="w-full h-full">
                <Monoco borderRadius={36} smoothing={1} clip={true} className="p-[10px] bg-darGray/20 dark:bg-darGray/20 flex items-stretch justify-center shadow-2xl shadow-black/10">
                    <div className="flex items-stretch justify-center">
                        <Monoco borderRadius={26} smoothing={1} clip={true} className="flex spdy sk shadow-inherit sk bg-darGray/20 dark:bg-lightGray/40">
                            <div className="flex spdy w-24 p-2">
                                <img className={`h-10 spdy opacity-80 transition-transform duration-500 ${!isLight && "rotate-[360deg] invert-100 translate-x-[100%]"}`} src="Icons/darkModeSwitchIcon.PNG" alt="Theme Switch" />
                            </div>
                        </Monoco>

                        <motion.div
                            className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                            variants={globalTextContainerVariants}
                        >
                            <motion.h1 variants={textLineVariants} className="text-xl font-bold whitespace-nowrap">
                                {capsuleTranslations[language.indice].darkMode}
                            </motion.h1>

                            <motion.p variants={textLineVariants} className="text-sm whitespace-nowrap">
                                {isLight ? capsuleTranslations[language.indice].isOff : capsuleTranslations[language.indice].isOn}
                            </motion.p>
                        </motion.div>
                    </div>
                </Monoco>
            </Glass>
        </motion.div>
    );
};

const SoundCapsule = () => {
    const playingSound = useSelector((state) => state.sound.playingSound);
    const language = useSelector((state) => state.language);

    return (
        <motion.div
            variants={globalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute blured2 overflow-visible rounded-4xl"
        >
            <Glass optics={{ ...PLAYER_OPTICS2 }} radius={33} className="w-full h-full  ">
                <Monoco borderRadius={30} smoothing={1} clip={true} className="p-[10px]  bg-darGray/20 dark:bg-darGray/20 shadow-2xl shadow-black/5" >
                    <div className="w-full h-full flex items-stretch justify-center">
                        <Monoco borderRadius={20} smoothing={1} clip={true} className="px-6 py-2 bg-darGray/30 dark:bg-lightGray/90">
                            <div className="flex items-center justify-center">
                                <SoundWaveIcon isPlaying={playingSound} hoverAllow={false} />
                            </div>
                        </Monoco>

                        <motion.div
                            className="flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 overflow-hidden"
                            variants={globalTextContainerVariants}
                        >
                            <motion.h1 variants={textLineVariants} className="text-xl font-bold whitespace-nowrap">
                                {capsuleTranslations[language.indice].soundMode}
                            </motion.h1>
                            <motion.p variants={textLineVariants} className="text-sm whitespace-nowrap">
                                {playingSound ? capsuleTranslations[language.indice].isOn : capsuleTranslations[language.indice].isOff}
                            </motion.p>
                        </motion.div>
                    </div>
                </Monoco>
            </Glass>
        </motion.div>
    );
};