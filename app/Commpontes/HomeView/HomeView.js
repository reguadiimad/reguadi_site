import { useState, useCallback } from 'react';
import { AnimatePresence, LayoutGroup, motion} from 'framer-motion';
import AnimatedWelcome from './AnimatedWelcome';
import TypingAnimation from './IntroductionView';
import ArchedCarousel from './ArchedCarousel'; // Import the new component
import WhatICanDo from './WhatICanDo';
import TextRevealSection from './ItsMe';
import { Glass } from '@samasante/liquid-glass';
import Monoco from '@monokai/monoco-react';



const PLAYER_OPTICS = {

  clipToShape: false,
  softEdge: true,
  strength: 0.5,
  depth: 0.15,
  curvature: 2,
  bend: 0.15,
  bendWidth: 0.1,
  dispersion: 0.1,
  specular: 0,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff:  1,
  frost: 1,
  brightness: 0,
  thickness: 0,
};

const PLAYER_OPTICS2 = {

  clipToShape: false,
  softEdge: true,
  strength: 0.7,
  depth: 0.15,
  curvature: 1,
  bend: 0.3,
  bendWidth: 0.1,
  dispersion: 1,
  specular: 0,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff:  1,
  frost: 1,
  brightness: 0,
  thickness: 0,
};




export default function HomeView({showTyping, setShowTyping,typingComplete, setTypingComplete}) {
    const handleAnimationComplete = useCallback(() => {
      setTimeout(() => {
        setShowTyping(true);
      }, 0);
    }, []);

    const UpSpace = () => <div className='w-full ease-in-out duration-200  tiny:h-[70px] short:h-[120px] medium:h-[200px] tall:h-[310px] grand:h-[370px]'></div>
  return (
   <>

    <div className="w-screen flex flex-col justify-center relative items-center overflow-x-hidden pt-10 z-[10000000] ">
      <UpSpace />
       <LayoutGroup>

        <motion.div className='w-full relative flex items-center justify-center mb-10  ' layout={true} transition={{type:"spring"}}>
          <AnimatedWelcome onAnimationComplete={handleAnimationComplete} />
        </motion.div>

    
        { showTyping &&
          <motion.div layout={true} transition={{type:"spring"}} className="w-full  relative flex flex-col items-center justify-center mb-10">
            <TypingAnimation onComplete={a=>setTypingComplete(a)}/>

           
          </motion.div>
        }
      </LayoutGroup>
      

     { showTyping && typingComplete && (
        <div className='w-full relative  '>
          <ArchedCarousel />
          <TextRevealSection />
          <WhatICanDo />
        </div>
      )}
     
     
      
    </div>
     

     

   </>
  );

}
