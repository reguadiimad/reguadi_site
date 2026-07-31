'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSelector } from 'react-redux';
import Monoco from '@monokai/monoco-react';

gsap.registerPlugin(ScrollTrigger);

const TITLE_CONTENT = {
  Eng: { left: 'I CLOSE', right: 'THAT GAP' },
  Fr: { left: 'Je Comble', right: "l'écart" },
  Ar: { left: 'أُغلق', right: 'الفجوة' }
};

export default function GapClosureSection() {
  const wrapperRef = useRef(null);
  const dimOverlayRef = useRef(null);
  const riseSectionRef = useRef(null);
  const riseInnerRef = useRef(null);
  const leftFragRef = useRef(null);
  const rightFragRef = useRef(null);
  const videoWrapperRef = useRef(null); // Ref for video container
  const videoWrapperRef2 = useRef(null); // Ref for video container

  const language = useSelector((state) => state.language.indice);
  const isArabic = language === 'Ar';
  const fontClash = isArabic ? 'font-arb2' : 'font-clashDisplay';
  const copy = TITLE_CONTENT[language] || TITLE_CONTENT.Eng;

  // Helper to split string into individual animatable character spans
  const renderLetters = (text, side) => {
    return text.split('').map((char, index) => (
      <span
        key={`${side}-${index}`}
        className={`letter-${side} inline-block will-change-transform select-none`}
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Query individual letter elements inside context
      const leftLetters = gsap.utils.toArray('.letter-left', leftFragRef.current);
      const rightLetters = gsap.utils.toArray('.letter-right', rightFragRef.current);

      // --- 1. Initial Container States ---
      gsap.set(dimOverlayRef.current, { opacity: 0 });
      gsap.set(riseSectionRef.current, {
        yPercent: 100,
        scale: 0.88,
        borderRadius: 40,
      });
      gsap.set(riseInnerRef.current, { opacity: 0, scale: 0.92 });

      // Initial letter-spacing on parent wrappers
      gsap.set([leftFragRef.current, rightFragRef.current], {
        letterSpacing: '0.25em',
        opacity: 1,
        x: 0,
        scale: 1,
      });

      // Video hidden initial state
      gsap.set(videoWrapperRef.current, {
        scale: 0,
        opacity: 1,
        pointerEvents: 'none',
      });
      gsap.set(videoWrapperRef2.current, {
        scale: 0,
        opacity: 0,
        pointerEvents: 'none',
      });

      // --- 2. Initial Mirrored Letter States ---
      gsap.set(leftLetters, {
        x: -140,
        opacity: 0,
        scale: 0.4,
        rotation: -18,
        filter: 'blur(12px)',
      });

      gsap.set(rightLetters, {
        x: 140,
        opacity: 0,
        scale: 0.4,
        rotation: 18,
        filter: 'blur(12px)',
      });

      // --- 3. Master Scrub Timeline ---
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=2600', // Increased scroll distance to accommodate video reveal phase
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Dim background
      master.to(
        dimOverlayRef.current,
        { opacity: 1, ease: 'power2.inOut', duration: 0.75, delay: 1 },
        0
      );

      // Phase 2: Card rises up & expands
      master.to(
        riseSectionRef.current,
        {
          yPercent: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        0
      );

      master.to(
        riseSectionRef.current,
        {
          scale: 1,
          borderRadius: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        0.05
      );

      master.to(
        riseInnerRef.current,
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
        0.1
      );

      // Phase 3: Mirrored Letter-by-Letter Convergence
      master.to(
        rightLetters,
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'back.out(2.2)',
          stagger: {
            amount: 0.3,
            from: 'start',
          },
        },
        0.35
      );

      master.to(
        leftLetters,
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'back.out(2.2)',
          stagger: {
            amount: 0.3,
            from: 'end',
          },
        },
        0.35
      );

      // Tighten letter spacing smoothly to complete the merge
      master.to(
        [leftFragRef.current, rightFragRef.current],
        {
          letterSpacing: '0em',
          duration: 0.45,
          ease: 'power3.out',
        },
        0.45
      );

      // --- Phase 4: Scale Down Text, Open Gap, and Reveal Video ---
      master.to(
        leftFragRef.current,
        {
          x: '-10vw',
          scale: 0.85,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '>+0.1'
      );

      master.to(
        rightFragRef.current,
        {
          x: '15vw',
          scale: 0.85,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '<'
      );

      master.to(
        videoWrapperRef.current,
        {
          scale: 1,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.6,
          ease: 'back.out(1.4)',
        },
        '<'
      );

        master.to(
        videoWrapperRef2.current,
        {
          scale: 1,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.6,
          ease: 'back.out(1.4)',
        },
        '<'
      );

    }, wrapperRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div
      ref={wrapperRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative w-full h-screen overflow-hidden -mt-[100vh] bg-transparent z-[9999999999] pointer-events-auto"
    >
      {/* Theme-aware dim layer */}
      <div
        ref={dimOverlayRef}
        className="absolute inset-0 bg-lightwhite dark:bg-[#101010] backdrop-blur-lg pointer-events-none"
      />

      {/* The rising, expanding section */}
      <div
        ref={riseSectionRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <Monoco
          ref={riseInnerRef}
          className="relative w-full h-full flex items-center rounded-b-none justify-center z-[9999999999999] backdrop-blur-3xl bg-black/5 will-change-transform"
        >
          <div className="relative overflow-visible w-full max-w-7xl px-6 flex items-center justify-center">
           

            <h2
              dir="ltr"
              className={`relative flex font-monologue items-center justify-center gap-x-4 overflow-visible sm:gap-x-6 leading-10 text-4xl sm:text-6xl md:text-7xl lg:text-[220px] font-semibold ${fontClash}`}
            >
              {/* Left text fragment */}
              <span ref={leftFragRef} className="inline-flex overflow-visible will-change-transform">
                {renderLetters(copy.left, 'left')}
              </span>
              <div   className='  absolute left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 -z-10 flex overflow-visible scale-125 items-center justify-center will-change-transform blur-[60px] w-screen h-screen opacity-30 dark:opacity-40      '>
               <Monoco borderRadius={30} smoothing={1} clip={true} className="spdy2 pointer-events-none">
                  <video ref={videoWrapperRef2} className="w-48 sm:w-80 md:w-96 lg:w-[480px] object-cover rounded-[30px] filter saturate-150 brightness-110  " autoPlay muted loop playsInline >
                    <source src="Videos/ReelIntro.mp4" type="video/mp4" />
                  </video>
                </Monoco>
              </div>

              {/* Scaled-up video inside central gap */}
              <div
                ref={videoWrapperRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex overflow-visible items-center justify-center will-change-transform"
              >
                <Monoco borderRadius={30} smoothing={1} clip={true} className="spdy2 mx-10 hover:mx-20">
                  <video className="w-48 sm:w-80 md:w-96 lg:w-[480px] object-cover  rounded-[30px]" autoPlay muted loop playsInline>
                    <source src="Videos/ReelIntro.mp4" type="video/mp4" />
                  </video>
                </Monoco>
               
              </div>
              
              

              {/* Right text fragment */}
              <span ref={rightFragRef} className="inline-flex overflow-visible will-change-transform">
                {renderLetters(copy.right, 'right')}
              </span>
            </h2>
          </div>
        </Monoco>
        <p>
            
        </p>
      </div>
    </div>
  );
}
