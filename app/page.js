"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";  

import NavBar from "./Commpontes/TopScreen/NavBar/NavBar";
import BtmScreen from "./Commpontes/BtmScreen/BtmScreen";
import HomeView from "./Commpontes/HomeView/HomeView";
import ParticleWaves from "./Commpontes/GlobalComponotes/ParticleWaves";

export default function Home() {
  const [mode1, setMode1] = useState(false);
  const [currentCapsule, setCurrentCapsule] = useState("");

  // Redux states
  const language = useSelector((state) => state.language);
  const isArabic = language.indice === "Ar";
  const playingSound = useSelector((state) => state.sound.playingSound);
  const theTheme = useSelector((state) => state.theme.theme);

  // 1. Moved Refs to the top level to obey the Rules of Hooks
  const prevValues = useRef({ playingSound, theTheme, language });
  const lastY = useRef(0); // Safely initialize to 0 for Next.js SSR
  const direction = useRef(null);

  // --- Capsule Notification Logic ---
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

  // --- Scroll Direction Logic ---
  useEffect(() => {
    // 2. Set the initial scroll position once we are safely on the client
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      // ignore small movements (trackpad noise)
      if (Math.abs(delta) < 8) {
        ticking = false;
        return;
      }

      const newDirection = delta > 0 ? "down" : "up";

      // update mode1 ONLY when direction changes
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
    <>
      <div className={`${isArabic && "font-arb"} w-screen flex flex-col items-center selection:bg-theBlue selection:text-white dark:selection:bg-theOrange`}>
        
        <ParticleWaves />

        {/* Note: I kept your blur effect, but ensure the inner divs have a CSS class or styling to be visible! */}
        <AnimatePresence>
         {
          !mode1 &&  <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gradient-blur z-[9999999998] rotate-180 bg-gradient-to-b from-transparent to-white dark:to-black/60"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={"blr" + index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", ease: "circInOut", delay: 0.02 * index }}
                // NOTE: Consider adding a className here if these divs are supposed to render visible blur layers.
              />
            ))}
          </motion.div>
         }
        </AnimatePresence>
    

        <NavBar mode1={mode1} toggleMode={() => setMode1(!mode1)} />
        <HomeView />
        <BtmScreen currentCapsule={currentCapsule} mode1={mode1} />
      </div>
    </>
  );
}
