import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  useAnimationFrame, 
  useMotionValue, 
  useTransform, 
  useScroll,
  motion
} from 'framer-motion';
import { useSelector } from 'react-redux'; 
import i18nData from '../../translations/homeCardsData';
import { LiquidGlass } from '@liquidglass/react';
import Monoco from '@monokai/monoco-react';

// Import your 8 custom cards here
import { 
  Card1, Card2, Card3, Card4, Card5, Card6, Card7, Card8 
} from './TheCards'; 

// Array of card components for dynamic rendering
const cardComponents = [Card3, Card2, Card8, Card4, Card6, Card5, Card7, Card1];

const BREAKPOINTS = {
  '2xl': { width: 550, height: 450, minGap: -180, maxGap: 40, speed: 1.1 },
  'xl':  { width: 500, height: 410, minGap: -160, maxGap: 38, speed: 1.4 }, 
  'lg':  { width: 450, height: 368, minGap: -140, maxGap: 35, speed: 1.2 }, 
  'md':  { width: 400, height: 327, minGap: -120, maxGap: 30, speed: 1.0 }, 
  'sm':  { width: 340, height: 278, minGap: -100, maxGap: 25, speed: 0.8 },
  'base':{ width: 290, height: 237, minGap: -80, maxGap: 20, speed: 0.6 },
};

function useResponsiveRadius() {
  const [radius, setRadius] = useState(30); 

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setRadius(30);
      else if (width < 768) setRadius(40);
      else if (width < 1024) setRadius(45);
      else if (width < 1536) setRadius(50);
      else setRadius(60);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return radius;
}

const BASE_RADIUS = 900; 
const FLATTEN_THRESHOLD = 600;

const Card = React.memo(({ 
  index, 
  baseX, 
  scrollY, 
  config, 
  totalWidth,
  item,
  onHoverStart,
  onHoverEnd
}) => {
  const { width, minGap, maxGap, height } = config;
  const radius = BASE_RADIUS;
  
  const rawX = useTransform(baseX, (v) => {
    const offset = index * (width + minGap);
    let position = (v + offset) % totalWidth;
    
    if (position > totalWidth / 2) position -= totalWidth;
    if (position < -totalWidth / 2) position += totalWidth;
    return position;
  });

  const flattenProgress = useTransform(scrollY, [0, FLATTEN_THRESHOLD], [0, 1]);
  const spacingRatio = (width + maxGap) / (width + minGap);
  const currentSpacingScale = useTransform(flattenProgress, [0, 1], [1, spacingRatio]);
  const x = useTransform([rawX, currentSpacingScale], ([val, scale]) => val * scale);

  const y = useTransform([rawX, flattenProgress], ([currentX, currentFlat]) => {
    const clampedX = Math.min(Math.max(currentX, -radius), radius);
    const curveY = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(clampedX, 2));
    return curveY * (1 - currentFlat);
  });

  const rotate = useTransform([rawX, flattenProgress], ([currentX, currentFlat]) => {
    const clampedX = Math.min(Math.max(currentX, -radius), radius);
    const angleRad = Math.asin(clampedX / radius);
    const curveAngle = (angleRad * 180) / Math.PI;
    return curveAngle * (1 - currentFlat);
  });

  const visibleRange = width * 1.4;
  const display = useTransform(rawX, (currentX) => {
    return (currentX > -visibleRange && currentX < visibleRange) ? 'block' : 'none';
  });

  const dynamicRadius = useResponsiveRadius();
  const ActiveCard = cardComponents[index % cardComponents.length];

  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{
        x, y, rotate, 
        display,
        position: 'absolute',
        left: '50%',
        marginLeft: -width / 2, 
        transformOrigin: `center ${radius}px`,
        zIndex: 20,
        width: `${width}px`,
        height: `${height}px`,
        willChange: 'transform' 
      }}
      className="rounded-[20px] relative scale-90 sm:rounded-[25px] md:rounded-[30px] lg:rounded-[35px] 2xl:rounded-[40px] p-[5px] lg:p-[20px] overflow-visible"
    >
      <Monoco 
        borderRadius={dynamicRadius} 
        border={[2, '#84848472']} 
        smoothing={1} 
        clip={true} 
        className="p-[10px] w-full h-full absolute top-0 left-0 pointer-events-none"
      />

      <div className="w-full h-full rounded-[25px] shadow-xl lg:rounded-[40px] blured bg-lightGray/5 relative overflow-hidden pointer-events-none">
        <LiquidGlass 
          borderRadius={0} 
          blur={0} 
          contrast={1.2} 
          brightness={1.3} 
          displacementScale={2} 
          elasticity={0.30} 
          shadowIntensity={0} 
          saturation={1.3}
        >
          <div className="w-full h-full absolute inset-0 pointer-events-none">
            <ActiveCard />
          </div>
        </LiquidGlass>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.index === nextProps.index &&
    prevProps.config === nextProps.config && 
    prevProps.totalWidth === nextProps.totalWidth &&
    prevProps.item === nextProps.item 
  );
});

Card.displayName = "Card";

export default function ArchedCarousel() {
  const baseX = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  const langIndex = useSelector((state) => state.language.indice); 
  const langKey = useMemo(() => 
    langIndex === 'Ar' ? 'ar' : (langIndex === 'Fr' ? 'fr' : 'en'),
    [langIndex]
  );

  const [breakpoint, setBreakpoint] = useState('2xl');
  const config = useMemo(() => BREAKPOINTS[breakpoint], [breakpoint]);
  
  const speedRef = useRef(config.speed);

  // Interaction speed and physics state trackers
  const currentSpeedMultiplier = useRef(1);
  const targetSpeedMultiplier = useRef(1);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const [isCursorGrabbing, setIsCursorGrabbing] = useState(false);

  useEffect(() => {
    speedRef.current = config.speed;
  }, [config.speed]);

  const currentData = useMemo(() => 
    i18nData[langKey] || i18nData.en, 
    [langKey]
  );

  const totalWidth = useMemo(() => 
    currentData.length * (config.width + config.minGap), 
    [currentData.length, config.width, config.minGap]
  );

  const resizeTimeout = useRef();
  
  const handleResize = useCallback(() => {
    if (resizeTimeout.current) {
      cancelAnimationFrame(resizeTimeout.current);
    }
    
    resizeTimeout.current = requestAnimationFrame(() => {
      const screenW = window.innerWidth;
      let newBreakpoint;

      if (screenW >= 1536) newBreakpoint = '2xl';
      else if (screenW >= 1280) newBreakpoint = 'xl';
      else if (screenW >= 1024) newBreakpoint = 'lg';
      else if (screenW >= 768) newBreakpoint = 'md';
      else if (screenW >= 640) newBreakpoint = 'sm';
      else newBreakpoint = 'base';

      setBreakpoint(prev => prev === newBreakpoint ? prev : newBreakpoint);
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout.current) {
        cancelAnimationFrame(resizeTimeout.current);
      }
    };
  }, [handleResize]);

  // Framer Motion Deceleration & Physics Loop
  useAnimationFrame((t, delta) => {
    if (!isMounted) return;
    
    // Lerp multiplier for elegant deceleration transitions
    currentSpeedMultiplier.current += (targetSpeedMultiplier.current - currentSpeedMultiplier.current) * 0.08;

    if (isDragging.current) {
      dragVelocity.current = 0; 
    } else if (Math.abs(dragVelocity.current) > 0.01) {
      baseX.set(baseX.get() + dragVelocity.current);
      // Decay friction coefficient
      dragVelocity.current *= 0.96; 
    }

    if (!isDragging.current) {
      const safeDelta = Math.min(delta, 100); 
      const direction = langKey === 'ar' ? -1 : 1;
      const moveBy = (speedRef.current * direction) * currentSpeedMultiplier.current * (safeDelta / 16);
      
      baseX.set(baseX.get() + moveBy);
    }
  });

  // Smooth Pan Handlers
  const handlePanStart = () => {
    isDragging.current = true;
    setIsCursorGrabbing(true);
  };

  const handlePan = (event, info) => {
    baseX.set(baseX.get() + info.delta.x);
  };

  const handlePanEnd = (event, info) => {
    isDragging.current = false;
    setIsCursorGrabbing(false);
    dragVelocity.current = info.velocity.x * 0.045; 
  };

  // Hover Callbacks wrapped to keep Card memoization perfectly stable
  const handleCardHoverStart = useCallback(() => {
    targetSpeedMultiplier.current = 0.08;
  }, []);

  const handleCardHoverEnd = useCallback(() => {
    targetSpeedMultiplier.current = 1;
  }, []);

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[700px] lg:h-[300px] transition-colors duration-500"> 
      <motion.div 
        initial={{ opacity: 0, y: 140, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 14,
          mass: 1.1,
          delay: 0.25
        }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ cursor: isCursorGrabbing ? 'grabbing' : 'grab' }}
        className="sticky top-0 w-full h-screen flex justify-center items-start overflow-hidden pt-10 md:pt-20 select-none touch-pan-y"
      >
        <div className="absolute inset-0 pointer-events-none" />
        {isMounted && currentData.map((item, index) => (
          <Card 
            key={item.id || index} 
            item={item} 
            index={index} 
            baseX={baseX} 
            scrollY={scrollY}
            config={config}
            totalWidth={totalWidth}
            onHoverStart={handleCardHoverStart}
            onHoverEnd={handleCardHoverEnd}
          />
        ))}
      </motion.div>
    </div>
  );
}