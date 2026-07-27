'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence, delay } from 'framer-motion';
import Monoco from '@monokai/monoco-react';
import { Glass } from '@samasante/liquid-glass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';

const PLAYER_OPTICS = {
  clipToShape: false,
  softEdge: true,
  strength: 0.6,
  depth: 0.15,
  curvature: 1,
  bend: 0.3,
  bendWidth: 0.2,
  dispersion: 0.25,
  specular: 0,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 0.9,
  brightness: 0,
  thickness: 0,
};


const PLAYER_OPTICS2 = {
  clipToShape: false,
  softEdge: true,
  strength: 0.7,
  depth: 0.15,
  curvature: 1,
  bend: 0.3,
  bendWidth: 0.1,
  dispersion: 1,
  specular: 0,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 0.9,
  brightness: 0,
  thickness: 0,
};

export function TriggerCapsulle({ children, handleNext, handlePrev, innerRef, isCapsuleVisible, isCapsuleDocked,cleanSpace,isArabic }) {
  const defaultWidths = { left: '25%', right: '8%', rouneded: 12 };
  const [widths, setWidths] = useState(defaultWidths);
  const safeWidths = {
    left: widths?.left ?? defaultWidths.left,
    right: widths?.right ?? defaultWidths.right,
    rouneded: widths?.rouneded ?? defaultWidths.rouneded,
  };

  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {          
        setWidths({ left: '40%', right: '20%',rouneded:18 });
      } else if (w < 768) {   
        setWidths({ left: '60%', right: '18%',rouneded:20 });
      } else if (w < 1024) {  
        setWidths({ left: '48%', right: '14%',rouneded:24 });
      } else if (w < 1280) {  
        setWidths({ left: '38%', right: '11%',rouneded:28 });
      } else if (w < 1536) {  
        setWidths({ left: '28%', right: '9%',rouneded:30 });
      } else {                
        setWidths({ left: '20%', right: '8%',rouneded:33 });
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time pointer physics interpolation layer with custom jelly intensity scaling
  const handleMouseMove = (e, element, intensity = 1.0) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);

    // Jelly magnet micro-interaction calculations scaled by structural intensity
    const innerJelly = element.querySelector('.js-jelly-inner');
    if (innerJelly) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;

      // Multipliers are throttled dynamically per component instance
      const pullX = deltaX * 0.05 * intensity; 
      const pullY = deltaY * 0.08 * intensity;
      const stretchX = 1 + (Math.abs(deltaX) * 0.00015 * intensity);
      const stretchY = 1 - (Math.abs(deltaY) * 0.00015 * intensity);
      const skewX = deltaX * 0.012 * intensity;

      gsap.to(innerJelly, {
        x: pullX,
        y: pullY,
        scaleX: stretchX,
        scaleY: stretchY,
        skewX: skewX,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  };

  // Elastic snap-back reset when mouse leaves a capsule
  const handleMouseLeave = (element) => {
    if (!element) return;
    const innerJelly = element.querySelector('.js-jelly-inner');
    if (innerJelly) {
      gsap.to(innerJelly, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        duration: 0.65,
        ease: "elastic.out(1.2, 0.44)",
        overwrite: "auto"
      });
    }
  };



  const leftPhysics = {
    hidden: { 
      y: 240,
      x: 28,
      width: '64px',        
      scaleX: 0.52,
      scaleY: 1.22,
      opacity: 0 
    },
    visible: (custom) => ({ 
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      width: custom?.left ?? defaultWidths.left, 
      x: 0,                 
      transition: {
        y: { type: 'spring', stiffness: 175, damping: 17, mass: 1.05 },
        scaleX: { type: 'spring', stiffness: 220, damping: 15, mass: 0.9 },
        scaleY: { type: 'spring', stiffness: 220, damping: 15, mass: 0.9 },
        opacity: { duration: 0.22, ease: 'easeOut' },
        width: { type: 'spring', stiffness: 150, damping: 15, mass: 1.1, delay: 0.2 },
        x: { type: 'spring', stiffness: 150, damping: 15, mass: 1.1, delay: 0.2 }
      }
    }),
    hiddenState: {

      y: 240,
      x:124,
      
      transition: { 
        x:{delay:0,type:"spring",mass:2},
        y:{delay:0.1,type:"spring",mass:2}
      }
    }
  };

  const rightPhysics = {
    hidden: { 
      y: 240, 
      x: -120,
      width: '64px', 
      scaleX: 0.52,
      scaleY: 1.22,
      opacity: 0 
    },
    visible: (custom) => ({ 
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      width: custom?.right ?? defaultWidths.right, 
      x: 0, 
      transition: {
        y: { type: 'spring', stiffness: 170, damping: 17, mass: 1.05, delay: 0.12 },
        scaleX: { type: 'spring', stiffness: 215, damping: 14, mass: 0.9, delay: 0.2 },
        scaleY: { type: 'spring', stiffness: 215, damping: 14, mass: 0.9, delay: 0.2 },
        opacity: { duration: 0.22, ease: 'easeOut', delay: 0, exit: { duration: 0 } },
        width: { type: 'spring', stiffness: 155, damping: 14, mass: 1.05, delay: 0.4 },
        x: { type: 'spring', stiffness: 155, damping: 14, mass: 1.05, delay: 0.4 }
      }
    }),
    hiddenState: {

      y: 240,
      x:-104,
      
      transition: { 
        x:{delay:0.18,type:"spring",mass:2},
        y:{delay:0.25,type:"spring",mass:2}
      }
    }
  };

  const contentReveal = {
    hidden: { opacity: 0, scale: 0.78, y: 16 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.26, ease: 'easeOut', delay: 0.64 },
        scale: { type: 'spring', stiffness: 190, damping: 14, mass: 0.72, delay: 0.7 },
        y: { type: 'spring', stiffness: 160, damping: 17, mass: 0.8, delay: 0.7 }
      }
    }
  };


  return (
<AnimatePresence>
  <motion.div 
    layout 
    transition={{
      type: "spring",
      mass:1.5,
      duration:0.9
    }}
    ref={innerRef} 
    className={`w-full  py-3 left-0 z-[9999999999999] gap-4 flex items-center justify-center    ${cleanSpace && !isCapsuleDocked &&"xl:-ml-[18%] 2xl:-ml-[12%]"}`} 
    style={{ 
      position: isCapsuleDocked ? "absolute" : "fixed", 
      bottom: isCapsuleDocked ? "auto" : 0, 
      top: isCapsuleDocked ? 0 : "auto",
      left: 0,
    }}
  >
  <AnimatePresence>
      {isCapsuleVisible && (
      <>
        {/* LEFT CAPSULE: Progress Track */}
        <motion.div 
          ref={leftTrackRef}
          custom={safeWidths}
          variants={leftPhysics}
          initial="hidden"
          animate="visible"
          exit="hiddenState"
          
          className={`h-14 blured2 rounded-2xl overflow-visible lg:h-20  relative group  clickable will-change-transform select-none   transition-shadow duration-500`}
        >
          <div className="js-jelly-inner w-full h-full will-change-transform clickable origin-center">
            <Glass radius={33} optics={{...PLAYER_OPTICS}} className="w-full h-full ">
              <Monoco 
                borderRadius={widths.rouneded} 
                smoothing={1} 
                clip={true} 
                className={`w-full h-full flex items-center ${isCapsuleDocked?"bg-lightGray dark:bg-darGray/40":"bg-darGray/20 dark:bg-darGray/30"}    clickable justify-center relative overflow-hidden`}
              >

                
                
                <motion.div variants={contentReveal} className="w-full h-full flex items-center justify-center relative z-20">
                  {children}
                </motion.div>
              </Monoco>
            </Glass>
          </div>
        </motion.div>

        {/* RIGHT CAPSULE: Action Triggers */}
        <motion.div
          dir={"ltr"}
          ref={rightTrackRef}
          custom={safeWidths}
          variants={rightPhysics}
          initial="hidden"
          animate="visible"
          exit="hiddenState"
          onMouseMove={(e) => handleMouseMove(e, rightTrackRef.current, 1.0)}
          onMouseLeave={() => handleMouseLeave(rightTrackRef.current)}
          whileHover={{ boxShadow: "0 12px 40px -12px rgba(255, 255, 255, 0.12)" }}
          className="h-14 lg:h-20 blured2 overflow-visible relative group pointer-events-auto will-change-transform select-none   transition-shadow duration-500"
        >
          <div className="js-jelly-inner w-full h-full will-change-transform origin-center">
            <Glass radius={widths.rouneded+6} optics={{...PLAYER_OPTICS2}} className="w-full h-full  ">
              <Monoco 
                borderRadius={widths.rouneded+4} 
                smoothing={1} 
                clip 
                className={`w-full h-full flex  items-center ${isCapsuleDocked?"bg-lightGray  dark:bg-darGray/40":"bg-darGray/20 dark:bg-darGray/30"}    clickable justify-center relative overflow-hidden`}

              >
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen z-10"
                  style={{
                    background: `radial-gradient(140px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.08), transparent 100%)`
                  }}
                />
                
                <motion.div variants={contentReveal} className="flex items-center justify-center gap-4 lg:gap-6 relative z-20 px-2 lg:px-4">
                  <motion.button 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      transition: { type: "spring", delay: 0.7 } 
                    }} 
                    exit={{ 
                      opacity: 0, 
                      y: 15, 
                      transition: { duration: 0.15 } 
                    }}
                    onClick={handlePrev} 
                     className="text-sm sm:text-lg lg:text-2xl font-black cursor-pointer font-satoshi text-darGray dark:text-[#87878a] flex items-center justify-center   dark:hover:text-white hover:text-black/90 transition-colors duration-300 select-none focus:outline-none relative z-30"

                  > 
                    <div className='w-10 h-10 bg-white/50 dark:bg-black/30 blur-md absolute -z-10'></div>
                    <FontAwesomeIcon icon={faLeftLong}/>
                  </motion.button>

                  <motion.button 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      transition: { type: "spring", delay: 0.75 } 
                    }} 
                    exit={{ 
                      opacity: 0, 
                      y: 15, 
                      transition: { duration: 0.15 } 
                    }}
                    onClick={handleNext} 
                    className="text-sm  sm:text-lg lg:text-2xl font-black cursor-pointer font-satoshi text-darGray dark:text-[#87878a] flex items-center justify-center   dark:hover:text-white hover:text-black/90 transition-colors duration-300 select-none focus:outline-none relative z-30"

                  > 
                    <div className='w-10 h-10 bg-white/50 dark:bg-black/30 blur-md absolute -z-10'></div>
                    <FontAwesomeIcon className='z-50' icon={faRightLong}/>
                  </motion.button>
                </motion.div>
              </Monoco>
            </Glass>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  </motion.div> 
</AnimatePresence>
  );
}