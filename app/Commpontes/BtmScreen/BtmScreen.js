"use client";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ActivityCapsule from "./ActiviteyCapsule";

export default function BtmScreen({ currentCapsule,isDocked }) {
  //  FIXED: Only select the language slice to prevent global re-renders
  const language = useSelector((state) => state.language);
  const isArabic = language?.indice === "Ar";

  return (
    <motion.div 
      layout 
      transition={{ type: "spring",duration:1,mass:1.5 }} 
      className={`w-[60%] lg:w-[80%] xl:w-[99%] pointer-events-none  rounded-4xl py-1 flex items-center fixed  z-[99999999] bottom-0 text-sm md:text-lg xl:text-xl ${isDocked ? " mb-18 lg:mb-24 xl:mb-0 xl:-mr-[35%]  2xl:-mr-[30%]":""} ${isArabic && "flex-row-reverse font-arb"}`}
    >
      <div className="flex-1 flex items-center justify-center relative overflow-visible">
        {/* Empty placeholder */}
      </div> 

      <div className="flex-1  flex items-center justify-center">
        <ActivityCapsule currentCapsule={currentCapsule} />
      </div>

      <div className="flex-1"></div>
    </motion.div>
  );
}