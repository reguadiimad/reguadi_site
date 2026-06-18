import Monoco from '@monokai/monoco-react';
import { useEffect, useRef, useState } from 'react';
// Make sure this path matches where you saved your hook
import useImagePreloader from '@/app/hooks/useImagePreloader';

// 1. Pre-calculate all unique image URLs required for the animation
const special = new Set([0, 1, 3, 5, 7]);
const PRELOAD_URLS = [...new Set([
  ...[...Array(8)].map((_, i) => `/abltys/abt_${i}.png`),
  ...[...Array(8)].map((_, i) => `/abltys/abt_${special.has(i) ? i : `${i}${i}`}.png`),
  ...[...Array(8)].map((_, i) => `/abltys/abt_${i}${i}${i}.png`),
  '/abltys/abt_fin.png'
])];

export default function Blobs() {
  const shapesRef = useRef([]);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [phaseNum, setPhaseNum] = useState(0);

  // 2. Initialize the preloader with our static array of URLs
  const { ready, progress } = useImagePreloader(PRELOAD_URLS);

  useEffect(() => {
    if (window.gsap) return setGsapLoaded(true);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = () => setGsapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // 3. Wait for BOTH GSAP to load AND all images to preload before starting
    if (!gsapLoaded || !window.gsap || !ready) return;

    const gsap = window.gsap, s = shapesRef.current;
    const st = 184, s1 = st * 1.1, s2 = st * 1.25, x = (i, t) => t - (i - 3.5) * st;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power4.inOut", duration: 1.2 }
    });

    tl.set(s, { x: 0, opacity: 1, scale: 1 })

      // --- PHASE 1 ---
      .add("p1")
      .to(s[0], { x: x(0, -2 * s1), scale: 1.1 }, "p1")
      .to(s[1], { x: x(1, -1 * s1), scale: 1.1 }, "p1")
      .to(s[2], { x: x(2, -1 * s1), opacity: 1, scale: 1 }, "p1")
      .to(s[5], { x: x(5, 1 * s1), scale: 1.1 }, "p1+=0.2")
      .to(s[6], { x: x(6, 1 * s1), opacity: 1, scale: 1.1 }, "p1+=0.2")
      .to(s[7], { x: x(7, 2 * s1), scale: 1.1 }, "p1+=0.4")
      .to(s[3], { x: x(3, 0), scale: 1.1 }, "p1")
      .to(s[4], { x: x(4, 0), opacity: 1, scale: 1 }, "p1")
      
      .add(() => setPhaseNum(1), "p1+=0.6") 
      
      .to({}, { duration: 1.5 })

      // --- PHASE 2 ---
      .add("p2")
      .to(s.slice(0, 5), {
        x: i => x(i, -0.5 * s2),
        scale: i => i === 3 ? 1.25 : 0,
        opacity: i => i === 3 ? 1 : 0
      }, "p2")
      .to(s.slice(5, 8), {
        x: i => x(i + 5, 0.5 * s2),
        scale: i => i === 0 ? 1.25 : 0,
        opacity: i => i === 0 ? 1 : 0
      }, "p2+=0.4")
      
      .add(() => setPhaseNum(2), "p2+=0.6")
      
      .to({}, { duration: 1.5 })

      // --- PHASE 3 ---
      .add("p3")
      .to(s, {
        x: i => x(i, 0),
        scale: i => i === 3 ? 1.4 : 0,
        opacity: i => i === 3 ? 1 : 0
      }, "p3")
      
      .add(() => setPhaseNum(3), "p3+=0.6") 
      
      .to({}, { duration: 2 })

      // --- RESET TO START ---
      .add("reset")
      .add(() => setPhaseNum(0), "reset")
      .to(s, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.3,
        stagger: { each: 0.08, from: "center" },
        ease: "elastic.out(1.2, 0.7)"
      }, "reset");

    return () => tl.kill();
  }, [gsapLoaded, ready]); // Added `ready` to the dependency array

  const theSrc = (i) => {
    if (phaseNum === 0) return `/abltys/abt_${i}.png`;
    else if (phaseNum === 1) return `/abltys/abt_${special.has(i) ? i : `${i}${i}`}.png`;
    else if (phaseNum === 2) return `/abltys/abt_${i + "" + i + "" + i}.png`;
    else if (phaseNum === 3) return `/abltys/abt_fin.png`;
  }

  return (
    <div className="w-full flex items-center justify-center overflow-visible scale-90 scale-x-95 -mb-10 z-10000 relative">
      
      {/* 4. Optional loading overlay based on the hook's progress state */}
     {!ready && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-48 sm:w-64 flex flex-col items-center gap-4">
            
            {/* Label */}
           

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              {/* Progress Bar Fill */}
              <div 
                className="h-full bg-black/10 dark:bg-white/10 backdrop-blur-2xl rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>

          
            
          </div>
        </div>
      )}

      <style>{`
        @keyframes fluidImageSwap {
          0% { opacity: 0; transform: scale(0.6); filter: blur(6px); }
          50% { opacity: 1; transform: scale(1.1); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        @keyframes fadeSwap {
          0% { opacity: 50%; filter: blur(6px); }
          100% { opacity: 100%; filter: blur(0px); }
        }
        .animate-fluid-swap {
          animation: fluidImageSwap 0.4s ease-out forwards;
        }
        .fade-swap {
          animation: fadeSwap 0.4s ease-out forwards;
        }
      `}</style>

      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        suppressHydrationWarning 
        style={{ filter: 'url(#goo)', opacity: ready ? 1 : 0 }} // Hide blobs until ready
        className="flex items-center justify-center gap-[35px] w-full scale-[0.275] sm:scale-[0.5] md:scale-[0.695] lg:scale-[0.7] xl:scale-[0.9] 2xl:scale-100 transition-opacity duration-500"
      >
          {[...Array(8)].map((_, i) => 
          <div 
            key={i} 
            ref={e => shapesRef.current[i] = e} 
            style={{ willChange: 'transform, opacity' }}
            className="w-36 h-28 shrink-0"
          >
            <Monoco clip={true} smoothing={1} borderRadius={30} className='w-full h-full dark:bg-white text-black bg-lightGray flex items-center justify-center p-[20px]'>
              <img 
                key={theSrc(i)} 
                src={theSrc(i)} 
                alt="" 
                className={`w-full h-full object-contain invert-[.25] ${(phaseNum >= 2) ? "animate-fluid-swap" :"fade-swap"}`} 
              />
            </Monoco>
          </div>
          )}
      </div>
    </div>
  );
}