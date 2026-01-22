"use client";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ActivityCapsule from "./ActiviteyCapsule";


export default function BtmScreen({ currentCapsule }) {
  const { language } = useSelector((state) => state);
  const isArabic = language.indice === "Ar";
  

  return (
    <motion.div layout transition={{type:"spring"}} className={`w-[96%] lg:w-[80%]  xl:w-[99%] ${isArabic&&"flex-row-reverse"} transition-colors ease-in-out duration-300 rounded-4xl py-5 pb-1 flex items-center fixed bottom-4 z-[99999999] text-sm md:text-lg xl:text-xl ${isArabic && "flex-row-reverse font-arb"}`}>
          
          <div className="flex-1 flex items-center justify-center relative overflow-visible">
        
          </div> 

          <div className="flex-1 flex  items-center justify-center">
            <ActivityCapsule currentCapsule={currentCapsule}/>
          </div>

          <div className="flex-1"></div>

        </motion.div>
  );
}
