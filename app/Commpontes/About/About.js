"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import Monoco from "@monokai/monoco-react";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";

const paragraphText =
  "A full-stack craftsman with a front-end soul and a mind that never stops creating. From pixel-perfect interfaces to the backend powering them — motion, responsiveness, AI, and your data, handled end-to-end.";

const HERO_ITALIC_WORDS = new Set([
  "full-stack",
  "front-end",
  "ai",
  "end-to-end",
]);

const cleanWord = (word) => word.toLowerCase().replace(/[.,—–!?;:]/g, "");

const theClassName =
  "relative z-10 w-full h-auto overflow-hidden flex items-center justify-center bg-[#0b0b0e]/45 backdrop-blur-[7px] transform-gpu [transform-style:preserve-3d] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-24px_50px_rgba(255,255,255,0.035),0_34px_95px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,255,255,0.08)] before:content-[''] before:absolute before:inset-0 before:rounded-[90px] before:pointer-events-none before:z-40 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0.10))] before:opacity-50 after:content-[''] after:absolute after:inset-[1px] after:rounded-[89px] after:pointer-events-none after:z-40 after:border after:border-white/10";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const mapProgress = (value, start, end) =>
  clamp((value - start) / (end - start), 0, 1);

const mouseSpring = {
  stiffness: 90,
  damping: 26,
  mass: 0.55,
};

const About = () => {
  const containerRef = useRef(null);
  const motherZoneRef = useRef(null);
  const frameRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const prevScrollY = useRef(0);
  const hasPlayedReadAnimation = useRef(false);

  const [isScrollReleased, setIsScrollReleased] = useState(false);
  
  // Gyroscope tracking states
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const readProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduceMotion) {
      hasPlayedReadAnimation.current = true;
      readProgress.set(1);
      setIsScrollReleased(true);
      return;
    }

    if (hasPlayedReadAnimation.current) {
      readProgress.set(1);
      return;
    }

    const isScrollingDown = latest > prevScrollY.current;
    prevScrollY.current = latest;

    if (latest >= 0.72) {
      hasPlayedReadAnimation.current = true;
      readProgress.set(1);
      setIsScrollReleased(true);
      return;
    }

    if (isScrollingDown) {
      const target = mapProgress(latest, 0.0, 0.72);
      readProgress.set(target);
    } else {
      const target = mapProgress(latest, 0.05, 0.42);
      readProgress.set(target);
    }
  });

  const smoothProgress = useSpring(readProgress, {
    stiffness: 260,
    damping: 30,
    mass: 0.16,
  });

  const aboutTitleOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1]);
  const aboutTitleRevealY = useTransform(smoothProgress, [0, 0.08], [14, 0]);
  const aboutTitleScale = useTransform(smoothProgress, [0, 0.08], [0.92, 1]);
  const aboutTitleBlur = useTransform(
    smoothProgress,
    [0, 0.08],
    ["blur(8px)", "blur(0px)"]
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, mouseSpring);
  const smoothY = useSpring(mouseY, mouseSpring);

  const rotateX = useTransform(smoothY, [-1, 1], [5.5, -5.5]);
  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7]);

  const cardX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const cardY = useTransform(smoothY, [-1, 1], [-3, 3]);

  const videoX = useTransform(smoothX, [-1, 1], [7, -7]);
  const videoY = useTransform(smoothY, [-1, 1], [5, -5]);

  const titleX = useTransform(smoothX, [-1, 1], [-3, 3]);
  const titleY = useTransform(smoothY, [-1, 1], [-2, 2]);

  const textX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const textY = useTransform(smoothY, [-1, 1], [-6, 6]);

  const lightX = useTransform(smoothX, [-1, 1], ["70%", "30%"]);
  const lightY = useTransform(smoothY, [-1, 1], ["24%", "76%"]);

  const glare = useMotionTemplate`
    radial-gradient(
      circle at ${lightX} ${lightY},
      rgba(255,255,255,0.13),
      rgba(255,255,255,0.045) 28%,
      rgba(255,255,255,0.00) 62%
    )
  `;

  const shadowX = useTransform(smoothX, [-1, 1], [18, -18]);
  const shadowY = useTransform(smoothY, [-1, 1], [18, -18]);

  // Handle hardware device movement (Gyroscope)
  const handleOrientation = useCallback((e) => {
    if (reduceMotion) return;
    const { beta, gamma } = e;
    if (beta === null || gamma === null) return;

    // Normal natural holding pitch/angle of a phone in hand is ~65 degrees
    const restingBeta = 65;
    const maxTiltRange = 24; // Lower means more sensitive tilt response

    // Map gamma to mouseX (-1 to 1) and beta to mouseY (-1 to 1)
    const calcX = clamp(gamma / maxTiltRange, -1, 1);
    const calcY = clamp((beta - restingBeta) / maxTiltRange, -1, 1);

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      mouseX.set(calcX);
      mouseY.set(calcY);
    });
  }, [mouseX, mouseY, reduceMotion]);

  // Track cursor tracking adjustments if mobile mode is NOT tracking hardware physics
  const handlePointerMove = useCallback(
    (e) => {
      if (!motherZoneRef.current || reduceMotion || isGyroActive) return;

      const rect = motherZoneRef.current.getBoundingClientRect();

      const nextX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const nextY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        mouseX.set(clamp(nextX, -1, 1));
        mouseY.set(clamp(nextY, -1, 1));
      });
    },
    [mouseX, mouseY, reduceMotion, isGyroActive]
  );

  const handlePointerLeave = useCallback(() => {
    if (isGyroActive) return; // Prevent resetting values when screen taps drop out
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      mouseX.set(0);
      mouseY.set(0);
    });
  }, [mouseX, mouseY, isGyroActive]);

  // Check device capabilities on layout paint
  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion) return;

    const isIOSSafari =
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (isIOSSafari) {
      setNeedsPermission(true);
    } else {
      // Direct pass for Android Chrome/Firefox touch setups
      const isMobileDevice = window.matchMedia("(pointer: coarse)").matches;
      if (isMobileDevice) {
        setIsGyroActive(true);
      }
    }
  }, [reduceMotion]);

  // Bind/Unbind active hardware orientation listener 
  useEffect(() => {
    if (typeof window === "undefined" || !isGyroActive || reduceMotion) return;

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isGyroActive, reduceMotion, handleOrientation]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Strict iOS Safari Trigger Framework
  const enableMotion = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setNeedsPermission(false);
          setIsGyroActive(true);
        }
      } catch (err) {
        console.error("Device orientation authorization denied:", err);
      }
    }
  };

  const words = useMemo(() => paragraphText.split(" "), []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        isScrollReleased ? "h-screen" : "h-[250vh]"
      }`}
    >
      <div
        className={`${
          isScrollReleased ? "relative" : "sticky top-0"
        } h-screen w-full overflow-hidden flex items-center justify-center`}
      >
        <div
          ref={motherZoneRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ perspective: "1800px" }}
          className="w-[95%] lg:w-[85%] flex items-center justify-center lg:px-4 py-2"
        >
          <motion.div
            style={{
              rotateX: reduceMotion ? 0 : rotateX,
              rotateY: reduceMotion ? 0 : rotateY,
              x: reduceMotion ? 0 : cardX,
              y: reduceMotion ? 0 : cardY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full will-change-transform transform-gpu"
          >
            <motion.div
              style={{
                x: reduceMotion ? 0 : shadowX,
                y: reduceMotion ? 0 : shadowY,
              }}
              className="absolute inset-12 -z-10 rounded-[90px] dark:bg-black/70 bg-lightGray pointer-events-none"
            />

            <Monoco
              borderRadius={90}
              clip={true}
              smoothing={1}
              className={theClassName}
            >
              <motion.div
                style={{
                  background: glare,
                  z: 120,
                }}
                className="absolute inset-0 z-30 py-10 pointer-events-none rounded-[90px] mix-blend-screen"
              />

              <motion.div
                style={{
                  x: reduceMotion ? 0 : videoX,
                  y: reduceMotion ? 0 : videoY,
                  z: -52,
                  scale: 1.11,
                }}
                className="absolute inset-0 z-0 pointer-events-none transform-gpu"
              >
                <video
                  className="
                    h-full w-full object-cover blur-md
                    dark:opacity-70 dark:brightness-[0.56] dark:contrast-[1.18] dark:saturate-[1.18] opacity-50
                  "
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src="/Videos/flow.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,8,10,0.03)_0%,rgba(8,8,10,0.28)_50%,rgba(8,8,10,0.82)_100%)]" />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>

              <motion.div
                style={{
                  x: reduceMotion ? 0 : titleX,
                  y: reduceMotion ? 0 : titleY,
                  z: 26,
                }}
                className="absolute font-['Instrument_Serif'] leading-[0.95] top-4 lg:top-20 left-0 right-0 z-10 flex justify-center pointer-events-none transform-gpu"
              >
                <motion.p
                  style={{
                    opacity: reduceMotion ? 1 : aboutTitleOpacity,
                    y: reduceMotion ? 0 : aboutTitleRevealY,
                    scale: reduceMotion ? 1 : aboutTitleScale,
                    filter: reduceMotion ? "blur(0px)" : aboutTitleBlur,
                  }}
                  className="text-base lg:text-2xl mt-2 italic text-white/38 font-medium will-change-transform"
                >
                  About Me
                </motion.p>
              </motion.div>

              <motion.div
                style={{
                  x: reduceMotion ? 0 : textX,
                  y: reduceMotion ? 0 : textY,
                  z: 64,
                  transformStyle: "preserve-3d",
                }}
                className="relative z-20 flex w-full font-clashDisplay flex-col items-center justify-center px-8 pt-24 pb-20 md:px-12 md:pt-36 md:pb-24 lg:px-16 lg:pt-40 lg:pb-24 pointer-events-none transform-gpu"
              >
                <p
                  className="
                    w-full lg:w-[90%] select-none text-center
                    text-xl lg:text-7xl leading-[0.95]
                    flex flex-wrap justify-center
                    text-white/90
                    drop-shadow-[0_14px_25px_rgba(0,0,0,0.55)]
                    [transform-style:preserve-3d]
                  "
                >
                  {words.map((word, wordIndex) => {
                    const start = wordIndex / words.length;
                    const end = (wordIndex + 1) / words.length;

                    return (
                      <Word
                        key={`${word}-${wordIndex}`}
                        progress={smoothProgress}
                        range={[start, end]}
                        isItalic={HERO_ITALIC_WORDS.has(cleanWord(word))}
                      >
                        {word}
                      </Word>
                    );
                  })}
                </p>
              </motion.div>

              {/* Glassmorphic iOS Permission Trigger */}
              {needsPermission && (
                <button
                  onClick={enableMotion}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto px-5 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-white/80 bg-white/[0.03] backdrop-blur-md rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/[0.08] active:scale-95 will-change-transform animate-pulse"
                >
                  Activate 3D Perspective 📱
                </button>
              )}
            </Monoco>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Word = memo(({ children, progress, range, isItalic }) => {
  const characters = children.split("");
  const amount = range[1] - range[0];
  const step = amount / characters.length;

  return (
    <span
      className={`relative mr-4 inline-block whitespace-nowrap [transform-style:preserve-3d] ${
        isItalic ? "italic opacity-95 font-[Instrument_Serif]" : ""
      }`}
    >
      {characters.map((char, index) => {
        const start = range[0] + step * index;
        const end = range[0] + step * (index + 1);

        return (
          <Character
            key={`${char}-${index}`}
            progress={progress}
            range={[start, end]}
          >
            {char}
          </Character>
        );
      })}
    </span>
  );
});

const Character = memo(({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [22, 0]);
  const z = useTransform(progress, range, [-16, 14]);
  const scale = useTransform(progress, range, [0.9, 1]);
  const rotateX = useTransform(progress, range, [14, 0]);
  const filter = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        z,
        scale,
        rotateX,
        filter,
      }}
      className="inline-block will-change-transform"
    >
      {children}
    </motion.span>
  );
});

export default memo(About);