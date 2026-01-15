"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";







const SoundWaveIcon = ({ isPlaying, onToggle,language,hoverAllow=true,isMobile=false }) => {
  const [barHeights, setBarHeights] = useState([0.25, 0.25, 0.25, 0.25, 0.25]);
  const [isHovered, setIsHovered] = useState(isMobile?true:false);
  const volumeText = language === "Ar" ? (isPlaying ? "إيقاف الأصوات" : "تشغيل الأصوات") : language === "Fr" ? (isPlaying ? "Désactiver les sons" : "Activer les sons") : (isPlaying ? "Turn off sounds" : "Turn on sounds");

  useEffect(() => {
    let intervalId = null;

    if (isPlaying) {
      // Full "playing" animation
      intervalId = setInterval(() => {
        const newHeights = Array.from({ length: 5 }).map(
          () => Math.random() * (1.5 - 0.25) + 0.25
        );
        setBarHeights(newHeights);
      }, 300);
    } else if (isHovered) {
      // Gentle hover animation
      const hoverPattern = [
        [0.4, 0.6, 0.8, 0.6, 0.4],
        [0.1, 0.2, 0.12, 0.3, 0.1],
        [0.2, 0.3, 0.2, 0.2, 0.6],
        [0.1, 0.7, 1.0, 0.4, 0.2],
        [0.25, 0.25, 0.25, 0.25, 0.25],
        [0.3, 0.4, 0.3, 0.5, 0.3],
        [0.2, 0.1, 0.4, 0.2, 0.1],
        [0.25, 0.25, 0.25, 0.25, 0.25]
      ];
      let step = 0;
      intervalId = setInterval(() => {
        setBarHeights(hoverPattern[step]);
        step = (step + 1) % hoverPattern.length;
      }, 200);
    } else {
      // Reset all bars to baseline when not playing and not hovered
      setBarHeights([0.25, 0.25, 0.25, 0.25, 0.25]);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, isHovered]); // Rerun effect if playing state or hover state changes

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}
      transition={{type:"spring",stiffness:300,damping:20,delay:0.2}}
      title={volumeText}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
      className={`relative flex items-center clickable justify-center p-1 gap-0.5 h-10 `}
    >
      <AnimatePresence>
        {(isHovered && hoverAllow) && (
          <motion.div
          layout 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute flex justify-center items-center backdrop-blur-lg ${isMobile?"-top-12 hidden":"-bottom-12"} whitespace-nowrap px-3 py-1.5 text-xs font-semibold  rounded-4xl bg-black/5 dark:bg-white/10 text-darGray dark:text-lightGray shadow-xl border dark:border-white/10 border-black/5`}
          >
          {volumeText}
          </motion.div>
        )}
      </AnimatePresence>
      {barHeights.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full  shadow-blue-200 shadow-lg  ${
            isPlaying ? "bg-theBlue dark:bg-theOrange" : "bg-black/40 dark:bg-white"
          }`}
          style={{
            height: `${height}rem`,
            transition: "height 0.3s ease-in-out",
          }}
        />
      ))}
       
    </motion.div>
  );
};
export default SoundWaveIcon;