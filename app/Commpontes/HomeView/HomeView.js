import { useState, useCallback } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import AnimatedWelcome from './AnimatedWelcome';
import TypingAnimation from './IntroductionView';
import ArchedCarousel from './ArchedCarousel';
import ItsMe from './ItsMe';

// Import your 3D components & the new Bouncer
import DvdBouncer from './DvdBouncer';
import CrystalToggle from './CrystalGears';
import BackendGearDisplay from './CrystalTogle';

export default function HomeView({
  showTyping,
  setShowTyping,
  typingComplete,
  setTypingComplete,
  cleanSpace,
  setIsDocked,
  setShowWaves,
  isArabic
}) {
  const handleAnimationComplete = useCallback(() => {
    setTimeout(() => {
      setShowTyping(true);
    }, 0);
  }, []);

  const UpSpace = () => (
    <div className="w-full ease-in-out duration-200 tiny:h-[70px] short:h-[120px] medium:h-[200px] tall:h-[310px] grand:h-[370px]"></div>
  );

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* First-screen Bouncing DVD Arena (Absolute to hero section) */}
      <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
      
      
      </div>

      {/* Main Foreground Content */}
      <div className="w-screen flex flex-col justify-center relative items-center overflow-x-hidden pt-10 z-[10] pointer-events-auto">
        <UpSpace />
        <LayoutGroup>
          <motion.div
            className="w-full relative flex items-center justify-center mb-10"
            layout={true}
            transition={{ type: "spring" }}
          >
            <AnimatedWelcome onAnimationComplete={handleAnimationComplete} />
          </motion.div>

          {showTyping && (
            <motion.div
              layout={true}
              transition={{ type: "spring" }}
              className="w-full relative flex flex-col items-center justify-center mb-10"
            >
              <TypingAnimation onComplete={(a) => setTypingComplete(a)} />
            </motion.div>
          )}
        </LayoutGroup>

        {showTyping && typingComplete && (
          <div className="w-full relative">
            <ArchedCarousel />
            <ItsMe
              setShowWaves={setShowWaves}
              setIsDocked={setIsDocked}
              cleanSpace={cleanSpace}
            />
          </div>
        )}
       

      </div>
    </div>
  );
}
