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
  const [cleanSpace,setCleanSpace] = useState(false);
  const [isDocked,setIsDocked] = useState(false);
  const [showWaves,setShowWaves] = useState(true);

useEffect(() => {
  let timeoutId;
  const prev = prevValues.current;

  // 1. Check if playingSound changed
  if (playingSound !== prev.playingSound) {
    setCurrentCapsule("sound");
    setCleanSpace(true);
    timeoutId = setTimeout(() => {
      setCurrentCapsule("");
      setCleanSpace(false);
    }, 7000);

  // 2. Check if theTheme changed
  } else if (
    theTheme !== prev.theTheme &&
    prev.theTheme !== "system"
  ) {
    setCurrentCapsule("theme");
    setCleanSpace(true);
    timeoutId = setTimeout(() => {
      setCurrentCapsule("");
      setCleanSpace(false);
    }, 7000);

  // 3. Check if language.indice changed
  } else if (
    language.indice !== prev.language?.indice &&
    prev.language?.indice
  ) {
    setCurrentCapsule("language");
    setCleanSpace(true);
    timeoutId = setTimeout(() => {
      setCurrentCapsule("");
      setCleanSpace(false);
    }, 7000);
  }

  // Update the ref to store the latest values for the next render comparison
  prevValues.current = { playingSound, theTheme, language };

  return () => clearTimeout(timeoutId);

// Removed `cleanSpace` (not read inside) 
// Swapped `language` for `language.indice` (prevents unnecessary object reference triggers)
}, [playingSound, theTheme, language.indice]); 

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
        isArabic ? "font-arb" : "font-satoshi"
      } w-screen flex flex-col  -mt-2 items-center dark:bg-[#101010]  bg-white -z-[999999999999] selection:bg-theBlue selection:text-white dark:selection:bg-theOrange`}
    >
   <ParticleWaves showWaves={showWaves} />

      <AnimatePresence mode="wait">
        {!mode1 && (
          <motion.div
            key="gradient-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gradient-blur z-[9999999998] pointer-events-none -mt-2 rotate-180 bg-gradient-to-b from-transparent to-white dark:to-black/60"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={`blur-layer-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: -2 }}
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

      <HomeView
        cleanSpace={cleanSpace}
        showTyping={showTyping}
        setShowTyping={setShowTyping}
        typingComplete={typingComplete}
        setTypingComplete={setTypingComplete}
        setIsDocked={setIsDocked}
        setShowWaves={setShowWaves}
        />



          {typingComplete && <About/>}

          <IPadCursor/>


      <BtmScreen currentCapsule={currentCapsule} cleanSpace isDocked={isDocked} mode1={mode1} />
      

      
    </div>
  );
}