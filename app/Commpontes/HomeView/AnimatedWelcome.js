import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import Monoco from '@monokai/monoco-react';

export default function AnimatedWelcome({ onAnimationComplete }) {
  // =========================================================================
  // CODE 1: UI & Language Setup
  // =========================================================================
  const defaultLanguage = useSelector((state) => state.language?.indice);
  const isArabic = defaultLanguage === 'Ar';
  const isFrench = defaultLanguage === 'Fr';
  const fullText = isArabic
    ? 'مرحبًا بك في مساحتي'
    : isFrench
      ? 'Bienvenue dans mon espace'
      : 'Welcome to my space';

  const wrapperRef = useRef(null);
  const cardRef = useRef(null);

  // Keep a ref to onAnimationComplete so it won't break dependency rules
  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  const textDirection = isArabic ? 'rtl' : 'ltr';
  const fontClass = isArabic ? 'font-arb' : '';

  // Code 1 Exact Class Names
  const containerClasses = 'px-3 py-2 md:px-5 md:py-3';

  // =========================================================================
  // CODE 3: Text Splitting Logic (Arabic Ligature Safe)
  // =========================================================================
  const renderText = () => {
    if (isArabic) {
      return fullText.split(' ').map((word, i) => (
        <span key={i} className="char inline-block whitespace-nowrap mx-1">
          {word}
        </span>
      ));
    }
    return fullText.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{
          display: char === ' ' ? 'inline' : 'inline-block',
          willChange: 'transform, opacity, filter',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // =========================================================================
  // SINGLE-ELEMENT GSAP TIMELINE (Runs ONLY once on mount / page reload)
  // =========================================================================
  useEffect(() => {
    const cardEl = cardRef.current;
    const wrapperEl = wrapperRef.current;
    if (!cardEl || !wrapperEl) return;

    const ctx = gsap.context(() => {
      // 1. Measure natural size of the card from the DOM
      const targetRect = wrapperEl.getBoundingClientRect();
      const circleSize = 48; // Code 1 initial small state dimensions

      // Lock wrapper dimensions in page layout so surrounding elements don't shift
      gsap.set(wrapperEl, {
        width: targetRect.width,
        height: targetRect.height,
      });

      // 2. Set initial fixed floating position (Center bottom of viewport)
      gsap.set(cardEl, {
        visibility: 'visible',
        position: 'fixed',
        top: '50vh',
        left: '50vw',
        xPercent: -50,
        yPercent: -50,
        width: circleSize,
        height: circleSize,
        y: '60vh', // Start below viewport
        scale: 0.6,
        opacity: 0,
        willChange: 'transform, width, height, top, left',
      });

      // 3. Scatter text setup (Code 3)
      const chars = cardEl.querySelectorAll('.char');
      chars.forEach((char) => {
        const randomX = (Math.random() - 0.5) * 16;
        const randomY = (Math.random() - 0.5) * 12 + 6;
        const randomRot = (Math.random() - 0.5) * 15;
        gsap.set(char, {
          opacity: 0,
          filter: 'blur(10px)',
          x: randomX,
          y: randomY,
          rotation: randomRot,
        });
      });

      // Master Timeline setup
      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        },
      });

      // PHASE 1: BIRTH
      tl.to(cardEl, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'back.out(1.6)',
      });

      // PHASE 2: TRANSFORMATION
      tl.to(
        cardEl,
        {
          scaleY: 0.68,
          scaleX: 1.2,
          duration: 0.22,
          ease: 'power2.out',
        },
        '+=0.1'
      );

      tl.to(
        cardEl,
        {
          width: targetRect.width,
          height: targetRect.height,
          scaleX: 1,
          scaleY: 1,
          duration: 0.75,
          ease: 'elastic.out(1.1, 0.5)',
        },
        '<0.12'
      );

      // PHASE 3: TEXT REVEAL
      tl.to(
        chars,
        {
          opacity: 1,
          filter: 'blur(0px)',
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.5,
          stagger: {
            amount: 0.45,
            from: 'start',
          },
          ease: 'power3.out',
        },
        '-=0.35'
      );

      // PHASE 4: FINAL POSITION INTEGRATION
      tl.to(cardEl, {
        delay: 0.2,
        duration: 0.95,
        ease: 'power4.inOut',
        top: () => {
          const rect = wrapperEl.getBoundingClientRect();
          return rect.top + rect.height / 2;
        },
        left: () => {
          const rect = wrapperEl.getBoundingClientRect();
          return rect.left + rect.width / 2;
        },
      });

      // PHASE 5: ZERO-FLICKER SEAMLESS SNAP
      tl.add(() => {
        gsap.set(cardEl, {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          xPercent: 0,
          yPercent: 0,
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          clearProps: 'transform,willChange',
        });
        gsap.set(wrapperEl, { clearProps: 'width,height' });
      });
    });

    return () => ctx.revert();
  }, []); // <-- Empty array ensures animation runs ONCE on mount/reload only

  return (
    <div ref={wrapperRef} className="inline-block relative z-50">
      <div
        ref={cardRef}
        className="w-full h-full overflow-hidden"
        style={{ visibility: 'hidden' }}
      >
        <Monoco
          borderRadius={17}
          smoothing={1}
          clip={true}
          className="w-full h-full backdrop-blur-xs"
        >
          <div
            className={`w-full h-full blured2 backdrop-blur-[10px] font-satoshi flex items-center justify-center overflow-hidden whitespace-nowrap bg-lightGray/50 dark:bg-gray-500/40 text-darGray dark:text-lightGray font-semibold ${containerClasses}`}
            dir={textDirection}
          >
            <div
              className={`text-xs md:text-base ${fontClass} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {renderText()}
            </div>
          </div>
        </Monoco>
      </div>
    </div>
  );
}
