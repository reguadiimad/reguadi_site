import React, { useState, useEffect } from 'react';
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useTransform, 
  useMotionValueEvent,
  useScroll 
} from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';

// --- CONFIGURATION CONSTANTS (Base values for Desktop) ---
const BASE_WIDTH = 650;
const BASE_HEIGHT = 400;
const BASE_GAP_MIN = -200; 
const BASE_GAP_MAX = 40;   
const BASE_RADIUS = 1100; 
const SPEED = 1.5; 
const FLATTEN_THRESHOLD = 600; 

const items = Array.from({ length: 8 }, (_, i) => i + 1);

const Card = ({ index, baseX, isUnsupportedBrowser, scrollY, config }) => {
  const [isHighQuality, setIsHighQuality] = useState(false);
  const { width, height, gapMin, gapMax, radius } = config;

  // Recalculate total width based on current dynamic dimensions
  const totalWidth = items.length * (width + gapMin);

  // 1. Calculate Infinite Position
  const rawX = useTransform(baseX, (v) => {
    const offset = index * (width + gapMin);
    let position = (v + offset) % totalWidth;
    if (position > totalWidth / 2) position -= totalWidth;
    if (position < -totalWidth / 2) position += totalWidth;
    return position;
  });

  // 2. Flatten Progress
  const flattenProgress = useTransform(scrollY, [0, FLATTEN_THRESHOLD], [0, 1]);

  // 3. SPACING EXPANSION LOGIC
  const spacingRatio = (width + gapMax) / (width + gapMin);
  const currentSpacingScale = useTransform(flattenProgress, [0, 1], [1, spacingRatio]);

  // The Final X Position
  const x = useTransform([rawX, currentSpacingScale], ([val, scale]) => val * scale);

  // 4. Resource Management
  useMotionValueEvent(rawX, "change", (latest) => {
    if (isUnsupportedBrowser) {
        if (isHighQuality) setIsHighQuality(false);
        return;
    }
    // Dynamic trigger zone based on width
    const triggerZone = width * 2; 
    const shouldBeHighQuality = latest > -triggerZone && latest < triggerZone;
    if (shouldBeHighQuality !== isHighQuality) {
      setIsHighQuality(shouldBeHighQuality);
    }
  });

  // 5. Arch Math (Y position)
  const y = useTransform([rawX, flattenProgress], ([currentX, currentFlat]) => {
    const clampedX = Math.min(Math.max(currentX, -radius), radius);
    const curveY = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(clampedX, 2));
    return curveY * (1 - currentFlat);
  });

  // 6. Rotation
  const rotate = useTransform([rawX, flattenProgress], ([currentX, currentFlat]) => {
    const clampedX = Math.min(Math.max(currentX, -radius), radius);
    const angleRad = Math.asin(clampedX / radius);
    const curveAngle = (angleRad * 180) / Math.PI;
    return curveAngle * (1 - currentFlat);
  });

  // 7. Opacity (Dynamic Fade Zones)
  const fadeStart = width * 2;
  const fadeEnd = width * 2.5;
  
  const opacity = useTransform(
    rawX, 
    [-fadeEnd, -fadeStart, 0, fadeStart, fadeEnd], 
    [0, 1, 1, 1, 0] 
  );

  const CardContent = () => (
    <div className="w-full h-full flex flex-col justify-center items-center select-none">
      {/* Responsive Text Size */}
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{items[index]}</h2>
      <p className="text-white/70 text-sm md:text-base">Card Details</p>
    </div>
  );

  return (
    <motion.div
      style={{
        width: width,
        height: height,
        x, 
        y,
        rotate,
        opacity,
        position: 'absolute',
        left: '50%',
        marginLeft: -width / 2, // Centering offset
        transformOrigin: `center ${radius}px`, // Dynamic Origin
        zIndex: isHighQuality ? 20 : 10,
      }}
      className="rounded-2xl"
    >
      {isHighQuality ? (
        <div className="w-full h-full animate-fade-in border-4 rounded-[30px] md:rounded-[40px] p-[15px] md:p-[20px] border-darGray/80 dark:border-lightGray ">
          <LiquidGlass blur={0.3} contrast={0.8} brightness={1.1} saturation={1.15} displacementScale={1} elasticity={0.4} shadowIntensity={0.3}>
            <CardContent />
          </LiquidGlass>
        </div>
      ) : (
        <div className="w-full h-full animate-fade-in border-4 rounded-[30px] md:rounded-[40px] p-[15px] md:p-[20px] border-lightGray relative overflow-hidden">
             <div className="relative z-10 w-full h-full">
                <CardContent />
             </div>
             <div className='absolute inset-0 rounded-[20px] backdrop-blur-2xl bg-white/10 w-full h-full z-0'></div>
        </div>
      )}
    </motion.div>
  );
};

export default function ArchedCarousel() {
  const baseX = useMotionValue(0);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const { scrollY } = useScroll();

  // State for responsive dimensions
  const [config, setConfig] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    gapMin: BASE_GAP_MIN,
    gapMax: BASE_GAP_MAX,
    radius: BASE_RADIUS
  });

  useEffect(() => {
    // Browser check
    const ua = navigator.userAgent.toLowerCase();
    const isFirefox = ua.includes('firefox');
    const isSafari = ua.includes('safari') && !ua.includes('chrome');
    if (isFirefox || isSafari) setIsUnsupported(true);

    // Responsive Logic
    const handleResize = () => {
        const screenW = window.innerWidth;
        // If screen is smaller than base width + margin, we scale down
        // We use 0.85 (85%) of screen width for mobile to leave room for the curve
        const targetWidth = Math.min(BASE_WIDTH, screenW * 0.85);
        
        // Calculate the scale ratio (e.g., 0.5 for mobile)
        const scale = targetWidth / BASE_WIDTH;

        setConfig({
            width: targetWidth,
            height: BASE_HEIGHT * scale,     // Maintain aspect ratio
            gapMin: BASE_GAP_MIN * scale,    // Scale overlap
            gapMax: BASE_GAP_MAX * scale,    // Scale gap
            radius: BASE_RADIUS * scale      // Scale curve radius (Crucial for same look)
        });
    };

    handleResize(); // Run immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame((t, delta) => {
    // Adjust speed based on card width so it feels consistent
    const speedAdjustment = config.width / BASE_WIDTH; 
    let moveBy = (SPEED * speedAdjustment) * (delta / 16); 
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative w-full min-h-[700px]"> 
      <div className="sticky top-0 w-full h-screen flex justify-center items-start overflow-hidden pt-20 ">
        <div className="absolute inset-0  pointer-events-none" />

        {items.map((item, index) => (
          <Card 
              key={index} 
              index={index} 
              baseX={baseX} 
              scrollY={scrollY}
              isUnsupportedBrowser={isUnsupported} 
              config={config}
          />
        ))}
      </div>
    </div>
  );
}