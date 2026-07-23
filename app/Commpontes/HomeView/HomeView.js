import { useState, useCallback } from 'react';
import {  LayoutGroup, motion} from 'framer-motion';
import AnimatedWelcome from './AnimatedWelcome';
import TypingAnimation from './IntroductionView';
import ArchedCarousel from './ArchedCarousel'; // Import the new component
import WhatICanDo from './WhatICanDo';
import TextRevealSection from './ItsMe';





export default function HomeView({showTyping, setShowTyping,typingComplete, setTypingComplete,cleanSpace,setIsDocked,setShowWaves}) {
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
          <TextRevealSection setShowWaves={setShowWaves} setIsDocked={setIsDocked} cleanSpace={cleanSpace}  />
   
          <WhatICanDo />
        </div>
      )}
     
     
      
    </div>
     

     

   </>
  );

}
