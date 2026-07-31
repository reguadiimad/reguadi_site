'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { TriggerCapsulle } from './Popup';
import { useSelector } from 'react-redux';
import GapClosureSection from './jjlk';

gsap.registerPlugin(ScrollTrigger);

const SLIDES_CONTENT = {
  Eng: [
    {
      id: "01",
      metricValue: 99,
      metricSuffix: "%",
      metricLabel: "Interaction Fluidity",
      quote1: "Design isn't just static layouts; it's how a digital product breathes. I engineer frontend architectures using React and Next.js where motion feels as native and weighted as physical objects.",
      quote2: "Every complex UI interaction, GSAP timeline, and SVG morph is precision-crafted to eliminate friction, ensuring your brand delivers an undeniable, premium impression.",
      author: "Imad Reguadi",
      role: "Creative Full-Stack Developer & Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// Next.js Architecture", "// GSAP Interaction", "// Premium UI/UX"]
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
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// Scalable API Layers", "// Edge Infrastructure", "// Optimized Pipelines"]
    }
  ],
  Fr: [
    {
      id: "01",
      metricValue: 99,
      metricSuffix: "%",
      metricLabel: "Fluidité d'Interaction",
      quote1: "Le design ne se limite pas à des mises en page statiques ; c'est la respiration d'un produit numérique. J'élabore des architectures frontend avec React et Next.js où le mouvement est aussi naturel et fluide que dans le monde réel.",
      quote2: "Chaque interaction UI complexe, chronologie GSAP et métamorphose SVG est conçue avec précision pour éliminer les frictions, garantissant à votre marque une impression haut de gamme.",
      author: "Imad Reguadi",
      role: "Développeur Full-Stack Créatif & Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// Architecture Next.js", "// Interaction GSAP", "// UI/UX Haut de Gamme"]
    },
    {
      id: "02",
      metricValue: 14,
      metricSuffix: "ms",
      metricLabel: "Latence du Réseau Edge",
      quote1: "Une interface somptueuse exige un moteur sans concession et éprouvé. J'architecture des systèmes backend évolutifs, des couches d'API sécurisées et des structures relationnelles qui convertissent la complexité en vitesse pure.",
      quote2: "De l'intégration de bases vectorielles pour les pipelines d'IA modernes au déploiement de microservices, chaque couche est configurée pour gérer une forte concurrence.",
      author: "Imad Reguadi",
      role: "Développeur Full-Stack Créatif & Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// Couches API Évolutives", "// Infrastructure Edge", "// Pipelines Optimisés"]
    }
  ],
  Ar: [
    {
      id: "01",
      metricValue: 99,
      metricSuffix: "%",
      metricLabel: "سلاسة التفاعل",
      quote1: "التصميم ليس مجرد تخطيطات ثابتة؛ بل هو الكيفية التي يتنفس بها المنتج الرقمي. أقوم بابتكار واجهات إلكترونية باستخدام React و Next.js حيث تكون الحركة طبيعية وملموسة كالأجسام الواقعية.",
      quote2: "كل تفاعل معقد، وجدول زمني لـ GSAP، وتحول SVG مصنوع بدقة متناهية لتقليل الاحتكاك، مما يضمن تقديم انطباع استثنائي وفاخر لعلامتك التجارية.",
      author: "عماد الروكادي",
      role: "مطور شامل ومصمم خلاق",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// معمارية Next.js", "// تفاعلات GSAP", "// واجهات مستخدم فاخرة"]
    },
    {
      id: "02",
      metricValue: 14,
      metricSuffix: "مللي ثانية",
      metricLabel: "زمن استجابة شبكة Edge",
      quote1: "الواجهة الجذابة تتطلب محركًا قويًا لا يتقبل المساومة. أقوم بتصميم أنظمة خلفية قابلة للترقية، وطبقات واجهة برمجة تطبيقات آمنة تحول التعقيد إلى سرعة فائقة.",
      quote2: "من دمج قواعد البيانات المتجهة لخطوط الذكاء الاصطناعي الحديثة إلى نشر الخدمات المصغرة، يتم إعداد كل طبقة للتعامل مع الأحمال العالية بنجاح.",
      author: "عماد الروكادي",
      role: "مطور شامل ومصمم خلاق",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      tags: ["// واجهات برمجة واسعة", "// بنية تحتية سحابية", "// خطوط معالجة محسّنة"]
    }
  ]
};

const UI_LABELS = {
  Eng: { capability: "Capability", clickPause: "Click Line to Pause", clickPlay: "Click Line to Play" },
  Fr: { capability: "Capacité", clickPause: "Cliquer pour mettre en pause", clickPlay: "Cliquer pour lire" },
  Ar: { capability: "الإمكانيات", clickPause: "انقر للإيقاف المؤقت", clickPlay: "انقر للتشغيل" }
};

const TRACK_REVEAL_CONFIG = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.75 } }
};

const SplitText = ({ text, isArabic }) => (
  <span className="inline-flex flex-wrap content-start row-gap-0">
    {text.split(' ').map((word, index) => (
      <span key={index} className={`inline-block overflow-hidden py-1 ${isArabic ? 'ml-[0.22em]' : 'mr-[0.22em]'}`}>
        <span className="animate-word inline-block will-change-transform">{word}</span>
      </span>
    ))}
  </span>
);

export default function FoundersSection({ cleanSpace, setIsDocked, setShowWaves }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCapsuleVisible, setIsCapsuleVisible] = useState(false);
  const [isCapsuleDocked, setIsCapsuleDocked] = useState(false);
  
  const mainWrapperRef = useRef(null);
  const containerRef = useRef(null);
  const gridBgRef = useRef(null);
  const metricColumnRef = useRef(null);
  const textContainerRef = useRef(null);
  const metricRef = useRef(null);
  const counterRef = useRef(null);
  const revealLayerRef = useRef(null);
  const capsuleRef = useRef(null); 
  const landingRef = useRef(null);
  const progressBarRef = useRef(null); 
  
  const prevMetricRef = useRef(0);
  const timerTweenRef = useRef(null);

  const language = useSelector((state) => state.language.indice);
  const isArabic = language === "Ar";

  const fontSatoshi = isArabic ? 'font-arb' : 'font-satoshi';
  const fontClash = isArabic ? 'font-arb2' : 'font-clashDisplay';

  const activeSlides = SLIDES_CONTENT[language] || SLIDES_CONTENT.Eng;
  const labels = UI_LABELS[language] || UI_LABELS.Eng;
  const currentSlide = activeSlides[activeIndex] || activeSlides[0];

  useEffect(() => {
    if (setIsDocked) {
      setIsDocked(isCapsuleVisible && !isCapsuleDocked);
    }
  }, [isCapsuleVisible, isCapsuleDocked, setIsDocked]);

  const triggerExitAndChange = (nextIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (timerTweenRef.current) timerTweenRef.current.kill();

    const baseWords = textContainerRef.current?.querySelectorAll('.base-layer .animate-word') || [];
    const revealWords = textContainerRef.current?.querySelectorAll('.reveal-layer .animate-word') || [];
    const footer = textContainerRef.current?.querySelector('.animate-footer');
    
    const pairedWords = [];
    const maxLen = Math.max(baseWords.length, revealWords.length);
    for (let i = 0; i < maxLen; i++) {
      if (baseWords[i]) pairedWords.push(baseWords[i]);
      if (revealWords[i]) pairedWords.push(revealWords[i]);
    }

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

    if (pairedWords.length > 0) {
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
            if ((baseWords[i].parentElement?.offsetTop || 0) === top) wordInLineIdx++;
          }
          return (lineIdx * 0.05) + (wordInLineIdx * 0.004);
        }
      }, 0);
    }

    const exitTargets = [metricRef.current, footer].filter(Boolean);
    if (exitTargets.length > 0) {
      exitTl.to(exitTargets, { opacity: 0, y: 15, duration: 0.35, ease: "power2.in" }, 0);
    }
  };

  const handleNext = () => triggerExitAndChange((activeIndex + 1) % activeSlides.length);
  const handlePrev = () => triggerExitAndChange((activeIndex - 1 + activeSlides.length) % activeSlides.length);
  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  useEffect(() => {
    if (timerTweenRef.current) {
      if (isPlaying) timerTweenRef.current.resume();
      else timerTweenRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridBgRef.current) {
        gsap.to(gridBgRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      if (metricColumnRef.current) {
        gsap.to(metricColumnRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      }

      if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          }
        });
      }

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

      if (setShowWaves && mainWrapperRef.current) {
        ScrollTrigger.create({
          trigger: mainWrapperRef.current,
          start: "top 20%",
          end: "bottom 20%",
          onEnter: () => setShowWaves(false),
          onLeaveBack: () => setShowWaves(true),
          onLeave: () => setShowWaves(true),
          onEnterBack: () => setShowWaves(false),
        });
      }

      if (textContainerRef.current && landingRef.current) {
        ScrollTrigger.create({
          trigger: textContainerRef.current,
          start: "top 85%",
          end: "bottom top", 
          onEnter: () => setIsCapsuleVisible(true),
          onLeave: () => setIsCapsuleVisible(true),
          onEnterBack: () => setIsCapsuleVisible(true),
          onLeaveBack: () => {
            setIsCapsuleVisible(false);
            setIsCapsuleDocked(false);
          }
        });

        ScrollTrigger.create({
          trigger: landingRef.current,
          start: "top bottom-=96", 
          end: "bottom top",
          onEnter: () => setIsCapsuleDocked(true),
          onLeave: () => setIsCapsuleDocked(true),
          onEnterBack: () => setIsCapsuleDocked(true),
          onLeaveBack: () => setIsCapsuleDocked(false)
        });
      }
    }, mainWrapperRef);

    return () => ctx.revert();
  }, [setShowWaves]);

  useEffect(() => {
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

      if (metricRef.current) {
        tl.fromTo(metricRef.current, 
          { opacity: 0, y: 35, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" }
        );
      }

      const counterTarget = { value: startVal };
      tl.to(counterTarget, {
        value: endVal,
        duration: 1.1,
        ease: "power4.out",
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = Math.floor(counterTarget.value);
        },
        onComplete: () => { prevMetricRef.current = endVal; }
      }, "-=0.75");

      const lineOffsets = [];
      baseWords.forEach(word => {
        const top = word.parentElement?.offsetTop || 0;
        if (!lineOffsets.includes(top)) lineOffsets.push(top);
      });
      lineOffsets.sort((a, b) => a - b);

      if (pairedWords.length > 0) {
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
                if ((baseWords[i].parentElement?.offsetTop || 0) === top) wordInLineIdx++;
              }
              return (lineIdx * 0.0) + (wordInLineIdx * 0.006);
            }
          },
          "-=0.9"
        );
      }

      if (footer) {
        tl.fromTo(footer,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.5"
        );
      }

      const progressObj = { value: 0 };
      const transformOrigin = isArabic ? "right center" : "left center";
      const exitTransformOrigin = isArabic ? "left center" : "right center";
      
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin });
      }

      timerTweenRef.current = gsap.to(progressObj, {
        value: 1,
        duration: 12,
        ease: "none",
        onUpdate: () => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: progressObj.value, transformOrigin });
          }
        },
        onComplete: () => {
          if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
              transformOrigin: exitTransformOrigin,
              scaleX: 0,
              duration: 0.4,
              ease: "power3.inOut",
              onComplete: () => handleNext()
            });
          } else {
            handleNext();
          }
        }
      });

      if (!isPlaying) timerTweenRef.current.pause();
    }, mainWrapperRef);

    return () => ctx.revert(); 
  }, [activeIndex, language]);

  return (
    <div 
      ref={mainWrapperRef} 
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative w-full bg-gradient-to-b from-[#e8eaec00] to-lightwhite dark:from-[#10101000] dark:to-[#101010] to-30% pb-0"
    >
      <section 
        ref={containerRef}
        className="min-h-screen text-gray-900 dark:text-white flex items-center justify-center p-6 sm:p-12 md:p-20 font-sans -mt-64 tracking-tight relative overflow-hidden"
      >
        <div 
          ref={gridBgRef} 
          className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 will-change-transform" 
        />

        <div className="w-full grid grid-cols-1 pt-64 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
          <div 
            ref={metricColumnRef} 
            className="lg:col-span-4 flex flex-row justify-between lg:flex-col h-full pt-4 lg:min-h-[320px] will-change-transform"
          >
            <div className={`space-y-3 ${fontSatoshi}`}>
              <div className="text-[8px] lg:text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                {labels.capability} // 0{activeIndex + 1}
              </div>
              <div className="flex flex-col gap-1 pt-2 text-[9px] lg:text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                {currentSlide.tags.map((tag) => (
                  <span key={tag} className="tracking-wide">{tag}</span>
                ))}
              </div>
            </div>

            <div ref={metricRef} className="lg:mt-auto">
              <h2 className={`text-6xl font-semibold text-gray-900 dark:text-white tracking-tighter tabular-nums ${fontClash}`}>
                <span ref={counterRef}>{currentSlide.metricValue}</span>
                <span className={`text-neutral-500 font-light ${isArabic ? 'mr-1' : 'ml-0.5'}`}>
                  {currentSlide.metricSuffix}
                </span>
              </h2>
              <span className="block mt-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                {currentSlide.metricLabel}
              </span>
            </div>
          </div>

          <div ref={textContainerRef} className={`lg:col-span-8 flex flex-col space-y-12 lg:space-y-14 ${fontSatoshi} relative will-change-transform`}>
            <div className="base-layer space-y-12 lg:space-y-14 text-neutral-300 dark:text-neutral-700/80 select-none pointer-events-none transition-colors duration-300">
              <h1 className={`text-2xl sm:text-4xl md:text-[2.75rem] lg:text-4xl xl:text-5xl font-bold leading-[1.2] tracking-tight ${isArabic ? 'lg:pl-16' : 'lg:pr-16'}`}>
                <SplitText text={currentSlide.quote1} isArabic={isArabic} />
              </h1>
              <p className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-4xl xl:text-5xl font-bold leading-[1.2] tracking-tight">
                <SplitText text={currentSlide.quote2} isArabic={isArabic} />
              </p>
            </div>

            <div 
              ref={revealLayerRef} 
              className="reveal-layer space-y-12 lg:space-y-14 text-black dark:text-white absolute top-0 left-0 w-full h-full pointer-events-none select-none will-change-transform"
              style={{
                maskImage: 'linear-gradient(135deg, #000 -40%, transparent -12%)',
                WebkitMaskImage: 'linear-gradient(135deg, #000 -40%, transparent -12%)'
              }}
            >
              <h1 className={`text-2xl sm:text-4xl md:text-[2.75rem] lg:text-4xl xl:text-5xl font-bold leading-[1.2] tracking-tight ${isArabic ? 'lg:pl-16' : 'lg:pr-16'}`}>
                <SplitText text={currentSlide.quote1} isArabic={isArabic} />
              </h1>
              <p className="text-2xl sm:text-4xl md:text-[2.75rem] lg:text-4xl xl:text-5xl font-bold leading-[1.2] tracking-tight">
                <SplitText text={currentSlide.quote2} isArabic={isArabic} />
              </p>
            </div>

            <div className="animate-footer flex items-center gap-3 pt-4 relative z-20">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 grayscale border border-neutral-800">
                <img src={currentSlide.avatar} alt={currentSlide.author} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-[13px] leading-tight">
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">{currentSlide.author}</span>
                <span className={`text-neutral-500 ${fontClash} font-normal`}>{currentSlide.role}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Capsule Slot */}
      <div ref={landingRef} className="w-full h-24 flex items-center justify-center relative capabilities-bridge dark:bg-[#101010] py-4">
        <TriggerCapsulle 
          innerRef={capsuleRef}
          handleNext={handleNext} 
          handlePrev={handlePrev} 
          isPlaying={isPlaying} 
          onTogglePlayPause={togglePlayPause}
          isCapsuleVisible={isCapsuleVisible}
          isCapsuleDocked={isCapsuleDocked}
          cleanSpace={cleanSpace}
          setIsDocked={setIsDocked}
          isArabic={isArabic}
        >
          <div 
            onClick={togglePlayPause}
            className="w-full h-full flex flex-col justify-center px-4 lg:px-6 cursor-pointer group/line select-none relative transform transition-all duration-300 ease-out z-20"
            title={isPlaying ? labels.clickPause : labels.clickPlay}
          >
            <motion.div 
              variants={TRACK_REVEAL_CONFIG}
              transition={{ type: "spring" }}
              className="w-full h-[8px] lg:h-[12px] rounded-full hover:scale-105 hover:shadow-2xs bg-[#87878a] dark:bg-darGray relative overflow-hidden transition-all duration-300 ease-out will-change-[filter,opacity]"
            >
              <div 
                ref={progressBarRef} 
                className="js-progress-bar h-full rounded-full bg-neutral-700 dark:bg-neutral-300 w-full transition-colors duration-300 group-hover/line:bg-black dark:group-hover/line:bg-white"
                style={{ transform: "scaleX(0)" }}
              />
            </motion.div>
          </div>
        </TriggerCapsulle>
      </div>

      {/* GapClosureSection overlaps immediately */}
      <GapClosureSection/>
    </div>
  );
}
