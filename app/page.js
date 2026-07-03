"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

import NavBar from "./Commpontes/TopScreen/NavBar/NavBar";
import BtmScreen from "./Commpontes/BtmScreen/BtmScreen";
import HomeView from "./Commpontes/HomeView/HomeView";
import ParticleWaves from "./Commpontes/GlobalComponotes/ParticleWaves";
import About from "./Commpontes/About/About";
import IPadCursor from "./Commpontes/GlobalComponotes/IPadCursor";
import Blobs from "./Commpontes/HomeView/Blobs";

export default function Home() {
  const [mode1, setMode1] = useState(false);
  const [currentCapsule, setCurrentCapsule] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";
  const playingSound = useSelector((state) => state.sound.playingSound);
  const theTheme = useSelector((state) => state.theme.theme);

  const prevValues = useRef({ playingSound, theTheme, language });
  const lastY = useRef(0);
  const direction = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (playingSound !== prevValues.current.playingSound) {
      setCurrentCapsule("sound");
      timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
    } else if (
      theTheme !== prevValues.current.theTheme &&
      prevValues.current.theTheme !== "system"
    ) {
      setCurrentCapsule("theme");
      timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
    } else if (
      language.indice !== prevValues.current.language.indice &&
      prevValues.current.language.indice
    ) {
      setCurrentCapsule("language");
      timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
    }

    prevValues.current = { playingSound, theTheme, language };

    return () => clearTimeout(timeoutId);
  }, [playingSound, theTheme, language]);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      if (Math.abs(delta) < 8) {
        ticking = false;
        return;
      }

      const newDirection = delta > 0 ? "down" : "up";

      if (newDirection !== direction.current) {
        setMode1(newDirection === "down");
        direction.current = newDirection;
      }

      lastY.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${
        isArabic ? "font-arb" : ""
      } w-screen flex flex-col items-center selection:bg-theBlue selection:text-white dark:selection:bg-theOrange`}
    >
      <ParticleWaves/>

      <AnimatePresence mode="wait">
        {!mode1 && (
          <motion.div
            key="gradient-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gradient-blur z-[9999999998] rotate-180 bg-gradient-to-b from-transparent to-white dark:to-black/60"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={`blur-layer-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{
                  type: "spring",
                  ease: "circInOut",
                  delay: 0.02 * index,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar mode1={mode1} toggleMode={() => setMode1((prev) => !prev)} />




    <div className="w-full h-[100px] lg:h-[500px]"/>
          <About/>
    <div className="w-full h-[700px]"/>
<IPadCursor/>


      <BtmScreen currentCapsule={currentCapsule} mode1={mode1} />
    </div>
  );
}