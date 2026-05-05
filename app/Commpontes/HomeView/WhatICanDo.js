import { useScroll, useTransform, motion } from 'framer-motion';
import Monoco from '@monokai/monoco-react';
import HeroHeading from './HeroText';

export default function WhatICanDo() {
    const TheH1=({text})=><h1 className='text-9xl font-extrabold mx-4 z-10 overflow-visible  text-transparent bg-darGray/20 dark:bg-lightGray/20 backdrop-blur-[3px] pt-4 pb-8' style={{WebkitMaskImage: 'linear-gradient(black, black)',WebkitMaskClip: 'text'}}>{text}</h1>;
    return (
        <div className='w-full items-center justify-center flex flex-col relative h-[150vh] -mt-96 '>
        <div className=' h-full absolute w-0.5 bg-linear-to-b from-transparent via-lightGray/70 to-transparent  '/>
        <div className='w-full h-[40%] flex items-center justify-center'>
            <HeroHeading/>
        </div>
        <div className='w-full relative h-[40%] items-center justify-center flex flex-col'>
    
          <ScrollingCircle/>
          <div className='w-full absolute flex items-center justify-center'>
            <div className='h-0.5 w-full bg-linear-to-r from-transparent via-lightGray/70 to-transparent absolute z-0'/>

           <TheH1 text="Play" />

           <Monoco borderRadius={50} smoothing={1} clip={true} className='spdy2 mx-10 hover:mx-20'>
                <video className='w-125' autoPlay  muted playsInline><source src='Videos/ReelIntro.mp4' type='video/mp4' /></video>
           </Monoco>

           <TheH1 text="Reel" />

          </div>
           <div className=' flex items-end justify-end  absolute bottom-[6%] right-[18%]'>
            <img className='w-32 dark:hidden' src={'/images/see.png'}/>
            <img className='w-32  hidden dark:block scale-x-110' src={'/images/seeDrk.png'}/>
            <p className='text-theBlue dark:text-theOrange font-caveat text-4xl ml-2'>See whaht i can do :D</p>
           </div>
    
        </div>
        <div className='w-full h-[20%] items-center justify-center flex flex-col'></div>
      </div>
    );
}

const ScrollingCircle = () => {
  const totalSpans = 110;
  const radius = 450;

  // 1. Hook into the page scroll
  const { scrollYProgress } = useScroll();

  // 2. Map scroll (0 to 1) to rotation (0 to 360 degrees)
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="relative w-[400px]  h-[400px] flex items-center justify-center">
      <motion.div 
        style={{ rotate,transition:"cubic-bezier(0.175, 0.885, 0.32, 1.275)" }} transition={{ type: "spring"}} // 3. Apply the scroll-driven rotation here
        className="relative w-full h-full flex items-center justify-center"
      >
        {Array.from({ length: totalSpans }).map((_, i) => {
          const angle = (i / totalSpans) * 2 * Math.PI;
          
          // Use .toFixed(3) to prevent the Hydration Error you had earlier
          const x = (Math.cos(angle) * radius).toFixed(3);
          const y = (Math.sin(angle) * radius).toFixed(3);
          const spanRotation = (angle + Math.PI / 2).toFixed(3);

          return (
            <span
              key={i}
              className="absolute w-[2px] h-[10px] bg-darGray rounded-full"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${spanRotation}rad)`,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
