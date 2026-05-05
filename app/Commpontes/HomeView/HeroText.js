'use client';

import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Monoco from '@monokai/monoco-react';

// Register plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroHeading = () => {
  const text =
    "A full-stack craftsman with a front-end soul and a mind that never stops creating. From pixel-perfect interfaces to the backend powering them — motion, responsiveness, AI, and your data, handled end to end.";

  const words = useMemo(() => text.split(' '), [text]);

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray('.word');
      const placeholders = gsap.utils.toArray('.word-placeholder');
      const texts = gsap.utils.toArray('.word-text');

      // Initial state
      gsap.set(wordEls, { opacity: 0, y: 18, scale: 0.9 });
      gsap.set(texts, { opacity: 0 });
      gsap.set(placeholders, { opacity: 1 });

      const PER_WORD = 0.18;
      const LOAD_DURATION = 0.55;
      const REVEAL_DURATION = 0.5;

      // Timeline is paused; ScrollTrigger plays it when heading enters view
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%', // when top of heading hits 80% of viewport
          once: true,        // only fire first time
          // markers: true,  // uncomment to debug
        },
      });

      tl.to(wordEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
        stagger: PER_WORD,
      });

      tl.to(
        placeholders,
        {
          opacity: 0,
          duration: REVEAL_DURATION,
          ease: 'power2.out',
          stagger: PER_WORD,
        },
        `<+${LOAD_DURATION}`
      );

      tl.to(
        texts,
        {
          opacity: 1,
          duration: REVEAL_DURATION,
          ease: 'power2.out',
          stagger: PER_WORD,
        },
        '<'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={containerRef}
      className="text-center w-[65%] text-6xl text-darGray dark:text-lightGray"
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="word relative inline-block align-baseline mx-[0.15em] my-[0.1em]"
          style={{ willChange: 'transform, opacity' }}
        >
         

          <span className="word-text relative inline-block">{word}</span>

           <div className="word-placeholder absolute inset-0 rounded-3xl overflow-hidden bg-gray-300 dark:bg-darGray/20 backdrop-blur-xl z-50">
            <span className="shimmer absolute inset-0 " />
          </div>
        </span>
      ))}

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.15) 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          backdrop-filter: blur(20px);
          animation: shimmerMove 1.1s ease-in-out infinite;
        }

        :global(.dark) .shimmer {
          backdrop-filter: blur(20px);
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.05) 80%,
            transparent 100%
          );
          background-size: 200% 100%;
        }

        @keyframes shimmerMove {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </h1>
  );
};

export default HeroHeading;