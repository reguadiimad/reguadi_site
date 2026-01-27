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

    <div className="w-screen flex flex-col justify-center relative items-center overflow-x-hidden pt-10 z-[10000000] ">


      <div className='w-full ease-in-out duration-200  tiny:h-[70px] short:h-[120px] medium:h-[200px] tall:h-[310px] grand:h-[500px] '></div>
      <LayoutGroup>
        <motion.div className='w-full relative flex items-center justify-center ' layout={true} transition={{type:"spring"}}>
          <AnimatedWelcome onAnimationComplete={handleAnimationComplete} />
        </motion.div>

        {
          showTyping && <motion.div layout={true} transition={{type:"spring"}} className="w-full mt-2 mb-20 ">
            <TypingAnimation onComplete={a=>setTypingComplete(a)}/>
          </motion.div>
        }
     
      </LayoutGroup>

     {
      typingComplete &&  
      <div className='w-full relative z-0'>
         <ArchedCarousel /> 
      </div>
     }

    </div>
     
   </>
  );
}




const GateReveal = ({ children }) => {
  return (
    <div className="relative w-full overflow-hidden animate-fadeIn">
      {/* The Content */}
      <div className="relative z-0 opacity-0 animate-contentFade">
        {children}
      </div>

      {/* Left Gate */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-black z-10 animate-gateLeft shadow-[20px_0_50px_rgba(0,0,0,1)]"></div>

      {/* Right Gate */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black z-10 animate-gateRight shadow-[-20px_0_50px_rgba(0,0,0,1)]"></div>

      {/* Custom Styles for this specific animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes contentFade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes slideRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-contentFade {
          animation: contentFade 1.5s ease-out forwards;
        }
        .animate-gateLeft {
          animation: slideLeft 1.5s ease-in-out forwards;
          animation-delay: 0.2s; /* Slight pause before opening */
        }
        .animate-gateRight {
          animation: slideRight 1.5s ease-in-out forwards;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};