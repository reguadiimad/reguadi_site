import { useState, useCallback } from 'react';
import { LayoutGroup, motion, useDragControls } from 'framer-motion';
import AnimatedWelcome from './AnimatedWelcome';
import TypingAnimation from './IntroductionView';
import ArchedCarousel from './ArchedCarousel'; // Import the new component


export default function HomeView() {
    const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [showTyping, setShowTyping] = useState(false);
    const controls = useDragControls()
    
    const handleAnimationComplete = useCallback(() => {
      setIsWelcomeComplete(true);
      setTimeout(() => {
        setShowTyping(true);
      }, 0); 
    }, []); 
    

  return (
   <>
    <div className="w-screen flex flex-col justify-center items-center overflow-x-hidden pt-10 z-[10000000]">


      <div className='w-full ease-in-out duration-200 tiny:h-[70px] short:h-[120px] medium:h-[200px] tall:h-[310px] grand:h-[500px] '></div>
      <LayoutGroup>

        <motion.div className='w-full relative flex items-center justify-center' layout={true} transition={{type:"spring"}}>
          <AnimatedWelcome onAnimationComplete={handleAnimationComplete} />
        </motion.div>

        {
          showTyping && <motion.div layout={true} transition={{type:"spring"}} className="w-full mt-2 mb-20">
            <TypingAnimation onComplete={()=>setTypingComplete(true)}/>
          </motion.div>
        }
     
      </LayoutGroup>

      {/* Gemini work here - The Arched Carousel */}
      <div className='w-full relative z-0'>
         <ArchedCarousel /> 
      </div>

    </div>
   </>
  );
}