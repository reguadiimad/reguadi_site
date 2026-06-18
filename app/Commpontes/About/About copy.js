import { memo, useCallback, useEffect, useMemo, useRef } from "react";
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
import InfiniteLogoCarousel from "./InfiniteLogoCarousel";

const paragraphText =
  "A full-stack craftsman with a front-end soul and a mind that never stops creating. From pixel-perfect interfaces to the backend powering them — motion, responsiveness, AI, and your data, handled end-to-end.";

const HERO_ITALIC_WORDS = new Set(["full-stack", "front-end", "ai", "end-to-end"]);

const cleanWord = (word) =>
  word.toLowerCase().replace(/[.,—–!?;:]/g, "");
const theClassName =
  "relative z-10 w-full h-auto overflow-hidden flex items-center justify-center bg-[#0b0b0e]/45 backdrop-blur-[7px] transform-gpu [transform-style:preserve-3d] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-24px_50px_rgba(255,255,255,0.035),0_34px_95px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,255,255,0.08)] before:content-[''] before:absolute before:inset-0 before:rounded-[90px] before:pointer-events-none before:z-40 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0.10))] before:opacity-50 after:content-[''] after:absolute after:inset-[1px] after:rounded-[89px] after:pointer-events-none after:z-40 after:border after:border-white/10";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const readProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const current = readProgress.get();
    const faster = clamp(latest * 1.55, 0, 1);

    if (faster > current) {
      readProgress.set(faster);
    }
  });

  const smoothProgress = useSpring(readProgress, {
    stiffness: 190,
    damping: 32,
    mass: 0.2,
  });

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

  const handlePointerMove = useCallback(
    (e) => {
      if (!motherZoneRef.current || reduceMotion) return;

      const rect = motherZoneRef.current.getBoundingClientRect();

      const nextX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const nextY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        mouseX.set(clamp(nextX, -1, 1));
        mouseY.set(clamp(nextY, -1, 1));
      });
    },
    [mouseX, mouseY, reduceMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      mouseX.set(0);
      mouseY.set(0);
    });
  }, [mouseX, mouseY]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const words = useMemo(() => paragraphText.split(" "), []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div
          ref={motherZoneRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ perspective: "1800px" }}
          className="w-[75%] flex items-center justify-center px-4 py-8"
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
              className="absolute inset-12 -z-10 rounded-[90px] bg-black/70 blur-[58px] pointer-events-none"
            />

            <Monoco borderRadius={90} clip={true} smoothing={1} className={theClassName}>
              <motion.div
                style={{
                  background: glare,
                  z: 120,
                }}
                className="absolute inset-0 z-30 pointer-events-none rounded-[90px] mix-blend-screen"
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
                    h-full w-full object-cover
                    opacity-70 brightness-[0.56] contrast-[1.18] saturate-[1.18]
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
                className="absolute font-['Instrument_Serif']  leading-[0.95] top-20 left-0 right-0 z-10 flex justify-center pointer-events-none transform-gpu"
              >
                <p className="text-xl mt-2 italic  text-white/38 font-medium">
                 About Me
                </p>
              </motion.div>

             <motion.div
              style={{
                x: reduceMotion ? 0 : textX,
                y: reduceMotion ? 0 : textY,
                z: 64,
                transformStyle: "preserve-3d",
              }}
              className="relative z-20 flex w-full font-clashDisplay flex-col items-center justify-center px-8 pt-32 pb-20 md:px-12 md:pt-36 md:pb-24 lg:px-16 lg:pt-40 lg:pb-24 pointer-events-none transform-gpu"
            >
                <p
                  className="
                    w-[90%] select-none text-center
                    text-[90px] leading-[0.95]
                    flex flex-wrap justify-center
                    text-white/90
                    drop-shadow-[0_14px_25px_rgba(0,0,0,0.55)]
                    [transform-style:preserve-3d] mb-10
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

                  <div className="w-[120%] h-[1px] mt-10 bg-white/10"/>  
                  <InfiniteLogoCarousel />

              </motion.div>
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
        isItalic ? "italic opacity-95" : ""
      }`}
    >
      {characters.map((char, index) => {
        const start = range[0] + step * index;
        const end = range[0] + step * (index + 1);

        return (
          <Character key={`${char}-${index}`} progress={progress} range={[start, end]}>
            {char}
          </Character>
        );
      })}
    </span>
  );
});

const Character = memo(({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.28, 1]);
  const y = useTransform(progress, range, [1, 0]);
  const z = useTransform(progress, range, [-5, 9]);
  const filter = useTransform(progress, range, ["blur(1px)", "blur(0px)"]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        z,
        filter,
      }}
      className="inline-block will-change-transform"
    >
      {children}
    </motion.span>
  );
});



export default memo(About);