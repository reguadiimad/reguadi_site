"use client";
import NavBar from "./Commpontes/NavBar/NavBar";
import { useState, useEffect, useRef } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";  
import BtmScreen from "./Commpontes/BtmScreen/BtmScreen";
import HomeView from "./Commpontes/HomeView/HomeView";
import ParticleWaves from "./Commpontes/GlobalComponotes/ParticleWaves";
import IPadCursor from "./Commpontes/GlobalComponotes/IPadCursor";


export default function Home() {
const [mode1, setMode1] = useState(false);
const language = useSelector((state) => state.language);
const isArabic = language.indice === "Ar";
const playingSound = useSelector((state) => state.sound.playingSound);
const theTheme = useSelector((state) => state.theme.theme);
const [currentCapsule,setCurrentCapsule] = useState("");
const prevValues = useRef({ playingSound, theTheme, language });

useEffect(() => {
  let timeoutId;
  if (playingSound !== prevValues.current.playingSound) {
    setCurrentCapsule("sound");
    timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
  } else if (theTheme !== prevValues.current.theTheme && prevValues.current.theTheme !=="system") {
    setCurrentCapsule("theme");
    timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
  }
  else if (language.indice !== prevValues.current.language.indice && prevValues.current.language.indice) {
    setCurrentCapsule("language");
    timeoutId = setTimeout(() => setCurrentCapsule(""), 7000);
  }
  prevValues.current = { playingSound, theTheme, language };

  return () => clearTimeout(timeoutId);
}, [playingSound, theTheme, language]);

useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // If scrolling down → set mode1 true
    if (currentScrollY > lastScrollY) {
      setMode1(true);
    } 
    // If scrolling up → set mode1 false
    else if (currentScrollY < lastScrollY) {
      setMode1(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll); 
}, []);

 return ( 
    <>
     
      <div  className={`${isArabic&&'font-arb'} w-screen flex flex-col items-center selection:bg-theBlue selection:text-white  dark:selection:bg-theOrange  `}>
        <ParticleWaves/>
         <AnimatePresence>
           {
            !mode1 &&  <motion.div  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}  className=" gradient-blur z-[9999999998] rotate-180 bg-gradient-to-b from-transparent  to-white   dark:to-black/60">
            {
              Array.from({ length: 20 }).map((_, index) => (<motion.div key={"blr"+index} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:60}} transition={{type:"spring",ease:"circInOut",delay:0.02*index}}></motion.div>))
            }

          </motion.div>
          }
        </AnimatePresence>
     
        {/* Your NavBar is fixed, so it stays on top */}
        <NavBar mode1={mode1} toggleMode={()=>setMode1(!mode1)}/> 
        
        {/* MODIFICATION: 
          HomeView is no longer inside a w-[70%] div. 
          It's now the main content block that will handle its own scrolling.
        */}
        <HomeView />

        {/* Your BtmScreen is fixed, so it stays on the bottom */}
        <BtmScreen currentCapsule={currentCapsule} mode1={mode1}/>
        
      </div>
   

     
    </>
  );

}

