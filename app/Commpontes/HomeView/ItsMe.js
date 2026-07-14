'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion} from 'framer-motion';
import { TriggerCapsulle } from './Popup';

// Register ScrollTrigger for GPU-accelerated scroll interpolation
gsap.registerPlugin(ScrollTrigger);

const PLAYER_OPTICS = {
  clipToShape: true,
  softEdge: true,
  strength: 0.6,
  depth: 0.2,
  curvature: 0.5,
  bend: 0.1,
  bendWidth: 0.1,
  dispersion: 0.25,
  specular: 0,
  sheenAngle: 100,
  glow: 1.6,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 1.3,
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

const SLIDES_DATA = [
  {
    id: "01",
    metricValue: 99,
    metricSuffix: "%",
    metricLabel: "Interaction Fluidity",
    quote1: "Design isn't just static layouts; it's how a digital product breathes. I engineer frontend architectures using React and Next.js where motion feels as native and weighted as physical objects.",
    quote2: "Every complex UI interaction, GSAP timeline, and SVG morph is precision-crafted to eliminate friction, ensuring your brand delivers an undeniable, premium impression.",
    author: "Imad Reguadi",
    role: "Creative Full-Stack Developer & Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "02",
    metricValue: 14,
    metricSuffix: "ms",
    metricLabel: "Edge Network Latency",
    quote1: "A gorgeous interface demands an uncompromising, battle-hardened engine. I architect scalable backend systems, secure API layers, and relational structures that translate deep complexity into raw speed.",
    quote2: "From integrating vector stores for modern AI pipelines to deploying microservices, every system layer is configured to handle high concurrency seamlessly.",
    author: "Imad Reguadi",
    role: "Creative Full-Stack Developer & Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const TRACK_REVEAL_CONFIG = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], 
      delay: 0.75 
    } 
  }
};

const SplitText = ({ text }) => {
  return (
    <span className="inline-flex flex-wrap content-start row-gap-0">
      {text.split(' ').map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.22em] py-1">
          <span className="animate-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

export default function FoundersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [isCapsuleVisible, setIsCapsuleVisible] = useState(false);
  const [isCapsuleDocked, setIsCapsuleDocked] = useState(false);
  
  const mainWrapperRef = useRef(null);
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const metricRef = useRef(null);
  const counterRef = useRef(null);
  const revealLayerRef = useRef(null);
  const capsuleRef = useRef(null); 
  const landingRef = useRef(null);
  
  const prevMetricRef = useRef(0);
  const timerTweenRef = useRef(null);

  // Dynamic Line-Aware Exit Timeline Controller
  const triggerExitAndChange = (nextIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (timerTweenRef.current) {
      timerTweenRef.current.kill();
    }

    const baseWords = textContainerRef.current?.querySelectorAll('.base-layer .animate-word') || [];
    const revealWords = textContainerRef.current?.querySelectorAll('.reveal-layer .animate-word') || [];
    const footer = textContainerRef.current?.querySelector('.animate-footer');
    
    const pairedWords = [];
    const maxLen = Math.max(baseWords.length, revealWords.length);
    for (let i = 0; i < maxLen; i++) {
      if (baseWords[i]) pairedWords.push(baseWords[i]);
      if (revealWords[i]) pairedWords.push(revealWords[i]);
    }

    // Dynamic line offset calculation for reverse transition
    const lineOffsets = [];
    baseWords.forEach(word => {
      const top = word.parentElement?.offsetTop || 0;
      if (!lineOffsets.includes(top)) lineOffsets.push(top);
    });
    lineOffsets.sort((a, b) => a - b);

    const exitTl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        setIsTransitioning(false);
      }
    });

    // Clean downward rolling slide-out
    exitTl.to(pairedWords, {
      yPercent: 105,
      duration: 0.5,
      ease: "power3.in",
      stagger: (index) => {
        const wordIdx = Math.floor(index / 2);
        const currentWord = baseWords[wordIdx];
        if (!currentWord) return 0;

        const top = currentWord.parentElement?.offsetTop || 0;
        const lineIdx = lineOffsets.indexOf(top);
        
        let wordInLineIdx = 0;
        for (let i = 0; i < wordIdx; i++) {
          if ((baseWords[i].parentElement?.offsetTop || 0) === top) {
            wordInLineIdx++;
          }
        }
        return (lineIdx * 0.05) + (wordInLineIdx * 0.004);
      }
    }, 0);

    exitTl.to([metricRef.current, footer], {
      opacity: 0,
      y: 15,
      duration: 0.35,
      ease: "power2.in"
    }, 0);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % SLIDES_DATA.length;
    triggerExitAndChange(nextIdx);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + SLIDES_DATA.length) % SLIDES_DATA.length;
    triggerExitAndChange(nextIdx);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (timerTweenRef.current) {
      if (isPlaying) {
        timerTweenRef.current.play();
      } else {
        timerTweenRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const maskProgress = { value: -40 }; 
      gsap.to(maskProgress, {
        value: 140,
        ease: "none",
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: "top 85%",
          end: "bottom 35%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          if (revealLayerRef.current) {
            const p = maskProgress.value;
            const maskString = `linear-gradient(135deg, #000 ${p}%, transparent ${p + 28}%)`;
            revealLayerRef.current.style.maskImage = maskString;
            revealLayerRef.current.style.webkitMaskImage = maskString;
          }
        }
      });

      if (textContainerRef.current && landingRef.current) {
        ScrollTrigger.create({
          trigger: textContainerRef.current,
          start: "top 90%",                 
          onEnter: () => setIsCapsuleVisible(true),
          onLeaveBack: () => setIsCapsuleVisible(false)
        });

        ScrollTrigger.create({
          trigger: landingRef.current,
          start: "top bottom-=96", 
          onEnter: () => setIsCapsuleDocked(true),
          onLeaveBack: () => setIsCapsuleDocked(false)
        });
      }
    }, mainWrapperRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const currentSlide = SLIDES_DATA[activeIndex];
    const startVal = prevMetricRef.current;
    const endVal = currentSlide.metricValue;

    const ctx = gsap.context(() => {
      const baseWords = textContainerRef.current?.querySelectorAll('.base-layer .animate-word') || [];
      const revealWords = textContainerRef.current?.querySelectorAll('.reveal-layer .animate-word') || [];
      
      const pairedWords = [];
      const maxLen = Math.max(baseWords.length, revealWords.length);
      for (let i = 0; i < maxLen; i++) {
        if (baseWords[i]) pairedWords.push(baseWords[i]);
        if (revealWords[i]) pairedWords.push(revealWords[i]);
      }

      const footer = textContainerRef.current?.querySelector('.animate-footer');
      const tl = gsap.timeline();

      tl.fromTo(metricRef.current, 
        { opacity: 0, y: 35, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" }
      );

      const counterTarget = { value: startVal };
      tl.to(counterTarget, {
        value: endVal,
        duration: 1.1,
        ease: "power4.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.floor(counterTarget.value);
          }
        },
        onComplete: () => {
          prevMetricRef.current = endVal;
        }
      }, "-=0.75");

      // Dynamic Line-Aware Entry Stagger Calculation
      const lineOffsets = [];
      baseWords.forEach(word => {
        const top = word.parentElement?.offsetTop || 0;
        if (!lineOffsets.includes(top)) lineOffsets.push(top);
      });
      lineOffsets.sort((a, b) => a - b);

      tl.fromTo(pairedWords,
        { yPercent: 105 },
        { 
          yPercent: 0, 
          duration: 0.95, 
          ease: "power4.out",
          stagger: (index) => {
            const wordIdx = Math.floor(index / 2);
            const currentWord = baseWords[wordIdx];
            if (!currentWord) return 0;

            const top = currentWord.parentElement?.offsetTop || 0;
            const lineIdx = lineOffsets.indexOf(top);
            
            let wordInLineIdx = 0;
            for (let i = 0; i < wordIdx; i++) {
              if ((baseWords[i].parentElement?.offsetTop || 0) === top) {
                wordInLineIdx++;
              }
            }
            return (lineIdx * 0.0) + (wordInLineIdx * 0.006);
          }
        },
        "-=0.9"
      );

      if (footer) {
        tl.fromTo(footer,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.5"
        );
      }

      const progressObj = { value: 0 };
      
      const initialBars = mainWrapperRef.current?.querySelectorAll('.js-progress-bar');
      if (initialBars) {
        gsap.set(initialBars, { scaleX: 0, transformOrigin: "left center" });
      }

      timerTweenRef.current = gsap.to(progressObj, {
        value: 1,
        duration: 12,
        ease: "none",
        onUpdate: () => {
          const activeBars = mainWrapperRef.current?.querySelectorAll('.js-progress-bar');
          if (activeBars) {
            gsap.set(activeBars, { scaleX: progressObj.value, transformOrigin: "left center" });
          }
        },
        onComplete: () => {
          const finalBars = mainWrapperRef.current?.querySelectorAll('.js-progress-bar');
          if (finalBars) {
            gsap.to(finalBars, {
              transformOrigin: "right center",
              scaleX: 0,
              duration: 0.4,
              ease: "power3.inOut",
              onComplete: () => {
                handleNext();
              }
            });
          } else {
            handleNext();
          }
        }
      });

      if (!isPlaying) {
        timerTweenRef.current.pause();
      }
    }, mainWrapperRef);

    return () => ctx.revert(); 
  }, [activeIndex]);

  const currentSlide = SLIDES_DATA[activeIndex];

  return (
    <div ref={mainWrapperRef} className="relative w-full">
      <section 
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-black/0 to-[#101010] to-30% text-white flex items-center justify-center p-6 sm:p-12 md:p-20 font-sans -mt-64 selection:bg-white selection:text-black tracking-tight relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="w-full grid grid-cols-1 pt-64 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
          
          <div className="lg:col-span-4  flex flex-row justify-between lg:flex-col  h-full pt-4 lg:min-h-[320px]">
            <div className="space-y-3 font-satoshi ">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                Capability // 0{activeIndex + 1}
              </div>
              
              <div className="flex flex-col gap-1 pt-2 text-[11px] font-mono text-neutral-400">
                {(activeIndex === 0 
                  ? ["// Next.js Architecture", "// GSAP Interaction", "// Premium UI/UX"] 
                  : ["// Scalable API Layers", "// Edge Infrastructure", "// Optimized Pipelines"]
                ).map((tag) => (
                  <span key={tag} className="tracking-wide">{tag}</span>
                ))}
              </div>
            </div>

            <div ref={metricRef} className=" lg:mt-auto">
              <h2 className="text-6xl font-semibold  text-white tracking-tighter tabular-nums font-clashDisplay">
                <span ref={counterRef}>{currentSlide.metricValue}</span>
                <span className="text-neutral-500 font-light ml-0.5">{currentSlide.metricSuffix}</span>
              </h2>
              <span className="block mt-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                {currentSlide.metricLabel}
              </span>
            </div>
          </div>

          <div ref={textContainerRef} className="lg:col-span-8 flex flex-col space-y-12 lg:space-y-14 font-satoshi relative">
            
            <div className="base-layer space-y-12 lg:space-y-14 text-neutral-700/80 select-none pointer-events-none transition-colors duration-300">
              <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-[1.2] lg:pr-16 tracking-tight">
                <SplitText text={currentSlide.quote1} />
              </h1>
              <p className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-[45px] font-bold leading-[1.2] tracking-tight">
                <SplitText text={currentSlide.quote2} />
              </p>
            </div>

            <div 
              ref={revealLayerRef} 
              className="reveal-layer space-y-12 lg:space-y-14 text-white absolute top-0 left-0 w-full h-full pointer-events-none select-none will-change-transform"
              style={{
                maskImage: 'linear-gradient(135deg, #000 -40%, transparent -12%)',
                WebkitMaskImage: 'linear-gradient(135deg, #000 -40%, transparent -12%)'
              }}
            >
              <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-[1.2] lg:pr-16 tracking-tight">
                <SplitText text={currentSlide.quote1} />
              </h1>
              <p className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-[45px] font-bold leading-[1.2] tracking-tight">
                <SplitText text={currentSlide.quote2} />
              </p>
            </div>

            <div className="animate-footer flex items-center gap-3 pt-4 relative z-20">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 grayscale border border-neutral-800">
                <img 
                  src={currentSlide.avatar} 
                  alt={currentSlide.author}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col text-[13px] leading-tight">
                <span className="text-neutral-300 font-medium">{currentSlide.author}</span>
                <span className="text-neutral-500 font-clashDisplay font-normal">{currentSlide.role}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <div ref={landingRef} className="w-full h-24 flex items-center justify-center relative bg-[#101010] p-10 ">
        <TriggerCapsulle 
          innerRef={capsuleRef}
          handleNext={handleNext} 
          handlePrev={handlePrev} 
          isPlaying={isPlaying} 
          onTogglePlayPause={togglePlayPause}
          isCapsuleVisible={isCapsuleVisible}
          isCapsuleDocked={isCapsuleDocked}
        >
          <div 
            onClick={togglePlayPause}
            className="w-full h-full flex flex-col justify-center px-6 cursor-pointer group/line select-none relative hover:pb-2 transform transition-all duration-300 ease-out z-20"
            title={isPlaying ? "Click Line to Pause" : "Click Line to Play"}
          >
            <motion.div 
              variants={TRACK_REVEAL_CONFIG}
              className="w-full h-[4px] rounded-full bg-neutral-800 relative overflow-hidden transition-all duration-300 ease-out group-hover/line:h-[6px] group-hover/line:bg-neutral-700 will-change-[filter,opacity]"
            >
              <div 
                className="js-progress-bar h-full rounded-full bg-neutral-300 w-full transition-colors duration-300 group-hover/line:bg-white"
                style={{ transform: "scaleX(0)" }}
              />
            </motion.div>
            
            <span className="absolute bottom-3 left-6 text-[8px] font-mono uppercase tracking-widest text-neutral-600 opacity-0 transform translate-y-1 transition-all duration-300 ease-out group-hover/line:opacity-100 group-hover/line:translate-y-0">
              {isPlaying ? "|| Pause Timeline" : "▶ Play Timeline"}
            </span>
          </div>
        </TriggerCapsulle>
      </div>
    </div>
  );
}

