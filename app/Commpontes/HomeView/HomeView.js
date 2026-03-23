import { useState, useCallback } from 'react';
import { LayoutGroup, motion, useDragControls } from 'framer-motion';
import AnimatedWelcome from './AnimatedWelcome';
import TypingAnimation from './IntroductionView';
import ArchedCarousel from './ArchedCarousel'; // Import the new component
import { LiquidGlass } from '@liquidglass/react';
import { useSelector } from 'react-redux';
import CardsContent from '../../Data/CradsContent';


export default function HomeView() {
    const [typingComplete, setTypingComplete] = useState(false);
    const language = useSelector((state) => state.language);
    const isArabic = language.indice === "Ar";

    const [showTyping, setShowTyping] = useState(false);

    
    const handleAnimationComplete = useCallback(() => {
      setTimeout(() => {
        setShowTyping(true);
      }, 0); 
    }, []); 
    const content = CardsContent[1].content[language.indice];
    

  return (
   <>

    <div className="w-screen flex flex-col justify-center relative items-center overflow-x-hidden pt-10 z-[10000000] ">


      <div className='w-full ease-in-out duration-200  tiny:h-[70px] short:h-[120px] medium:h-[200px] tall:h-[310px] grand:h-[370px]  '></div>
          

      <LayoutGroup>
        <motion.div className='w-full relative flex items-center justify-center mb-10  ' layout={true} transition={{type:"spring"}}>
          <AnimatedWelcome onAnimationComplete={handleAnimationComplete} />
        </motion.div>

        {
          showTyping && <motion.div layout={true} transition={{type:"spring"}} className="w-full  ">
            <TypingAnimation onComplete={a=>setTypingComplete(a)}/>
          </motion.div>
        }
     
      </LayoutGroup>

  
      <div className='w-full relative z-0 '>
        <ArchedCarousel/>
      </div>








      

    </div>
     
   </>
  );
}


{
  /*

style 1/
     <div className='w-full h-full flex flex-col items-center justify-center  '>

            <div className='h-[25%] md:h-[20%]  font-bold text-center md:mt-[10px] p-[10px]'>
              <p className='text-xs text-darGray lg:text-sm xl:text-base'>{CardsContent[0].content[language.indice].description}</p>
              <h1 className='  font-black xl:text-[40px] text-2xl 2xl:text-[45px] md:text-3xl lg:text-4x mt-0 '>{CardsContent[0].content[language.indice].title}</h1>
              
             </div>
             <div className='h-[75%] md:h-[80%] w-full  flex items-end'>
              <img className='w-full ' src={'/images/Platfroming.png'}/>
              <div className='absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-white/10 to-transparent '></div>
             </div>
    </div>
style 2/

          <div className='w-full h-full flex flex-col items-center justify-center p-[10px]'>
              <div className='w-full h-full flex flex-col justify-end items-center lg:pb-[10px]'>
              <img className='absolute top-0 w-full z-20 dark:hidden' src={'/images/bot.png'} alt='Revolutionizing Technology'/>
              <img className='absolute top-0 w-full z-20 hidden dark:block' src={'/images/botDr.png'} alt='Revolutionizing Technology'/>
              <div className={`relative ${isArabic?"w-[40%]":"w-[70%]"} font-black text-2xl md:text-3xl lg:text-[40px] 2xl:text-[45px] text-center`}>
                <h1 className="relative z-10"> { CardsContent[1].content[language.indice].title}</h1>
                <div className='absolute inset-0 z-50 flex items-center justify-center hdMob1 md:hdMob pointer-events-none'>
                  { CardsContent[1].content[language.indice].title}
                </div>
            </div>
            <p className='text-xs text-darGray lg:text-sm xl:text-base font-bold lg:mt-1'>
              { CardsContent[1].content[language.indice].description}
            </p>
          </div>
        </div>




style3/
 <div className='w-full h-full flex flex-col items-center justify-center p-[10px] '>

            <img className='absolute w-[100%] bottom-[-15%] z-10 hidden dark:block ' src={'images/i.png'}/>
            <img className='absolute w-[100%] bottom-[-15%] z-10 dark:hidden light:block ' src={'images/ii.png'}/>
            <div className='w-full h-full flex flex-col p-[10px] text-center '>
              <p className=' mb-2 text-xs text-darGray lg:text-sm xl:text-base font-bold lg:mt-1 z-10'>{CardsContent[2].content[language.indice].title}</p>
              <div className='w-full whitespace-pre-line h-10 flex justify-center relative font-black text-2xl md:text-3xl lg:text-[40px] 2xl:text-[45px]'>
                <h1>{CardsContent[2].content[language.indice].description}</h1>
                <div className=' absolute whitespace-pre-line h-full hdMob1 z-20'>{CardsContent[2].content[language.indice].description}</div>
              </div></div>
            </div>


style4/
  <img className='w-full h-full m-2 dark:hidden' src={`/images/graphic${language.indice}.png`}/>
            <img className='w-full h-full m-2 hidden dark:block' src={`/images/graphic${language.indice}Dr.png`}/>



style5/
 <div className='w-full h-full flex flex-col items-center justify-center gap-2 '>
           <div className={`w-[86%] h-[25%] flex  justify-between items-end ${isArabic ? "flex-row-reverse " : ""}`}>
            <p className='text-xs text-darGray lg:text-sm xl:text-base font-bold'>{CardsContent[3].content[language.indice].title}</p>
            <h1 className='font-black  text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-[35px] '>{CardsContent[3].content[language.indice].description}</h1>
           </div>
           <div className='w-[88%] h-[75%]'>
            <img className='w-full dark:hidden  ' src={"/images/data.png"} />
            <img className='w-full hidden dark:block ' src={"/images/dataDr.png"} />

           </div>
          </div>

  style6/

          <div className='w-full h-full flex flex-col items-center justify-center gap-2 '>
          <div className="w-[86%] aspect-square bg-black hidden dark:block z-0 absolute rounded-full blur-3xl "/>
          <img className='w-full dark:hidden z-10' src={`/images/frontEnd${language.indice}.png`}/>
          <img className='w-full hidden z-10 dark:block' src={`/images/frontEnd${language.indice}Dr.png`}/>
          </div>


  Style 7/
<div className='w-full h-full flex flex-col items-center justify-center relative '>
            <img className='w-full dark:hidden ' src={"/images/Cross.png"}/>
            <img className='w-full hidden dark:block ' src={"/images/CrossDr.png"}/>
            <div className='w-[70%] h-[40%]  absolute flex items-center justify-center flex-col gap-1 mb-5'>
              <img className='w-4 md:w-6 lg:w-[30px] mt-2 xl:w-[33px] dark:invert-100' src={"/images/CrossLogo.png"}/>
              {language.indice==="Ar" ? <img className='dark:invert-100 w-[70%]' src={"/images/CrossAr.png"}/> : <h1 className='font-black  text-center tracking-tighter leading-tighter whitespace-pre-line text-2xl md:text-3xl lg:text-[40px] 2xl:text-[45px] '>{CardsContent[4].content[language.indice].title}</h1>}
              <p className='text-[10px] sm:text-xs  text-darGray lg:text-sm xl:text-base font-bold text-center  xl:mt-1'>{CardsContent[4].content[language.indice].description}</p>
            </div>
        </div>



  Style 8/
  <div className='w-full h-full flex flex-col items-center justify-end relative '>
           {language.indice!=="Ar"&& <div className='w-full absolute top-0 flex flex-col items-center justify-center pt-10'>
              <p className='text-sm text-theBlue dark:text-theOrange font-bold'>Dynamic and flexible</p>
              <h2 className='text-6xl font-black'>And More</h2>
            </div>}
            <img className='w-full dark:hidden   ' src={`/images/${isArabic?"moreAr.png":"more.png"}`}/>
            <img className='w-full hidden dark:block  ' src={`/images/${isArabic?"moreArDr.png":"moreDr.png"}`}/>
          </div>

  */







  
}

