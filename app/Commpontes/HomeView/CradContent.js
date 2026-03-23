const CardContent = memo(({ item, isArabic }) => (
  <div 
    dir={isArabic ? 'rtl' : 'ltr'}
    className={`w-full h-full flex flex-col justify-between items-start rounded-4xl p-6 md:p-8 select-none relative overflow-hidden group 
    shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${isArabic ? 'font-arabic' : 'font-sans'}`}
  >
    <img 
      className={`w-[45%] md:w-[55%] absolute my-auto hidden z-0 top-1/2 -translate-y-1/2 opacity-10 dark:opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none 
      ${isArabic ? '-left-8' : '-right-8'}`} 
      src={item.image} 
      alt={item.slogan} 
    /> 
    
    <div className="flex justify-between items-start w-full z-10">
      <div className="p-3 rounded-full bg-black/5 dark:bg-white/10 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-110">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
        </svg>
      </div>
      <span className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-bold tracking-widest text-gray-800 dark:text-white/90 uppercase bg-black/5 dark:bg-black/40 backdrop-blur-sm rounded-full border border-black/10 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
        {item.badge}
      </span>
    </div>

    <div className='flex w-full flex-col justify-center z-10 mt-4'>
      <h2 className='text-2xl md:text-3xl font-medium tracking-tight text-gray-600 dark:text-white/70'>
        {item.miniTitle}
      </h2>
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mt-1 ${isArabic?"font-arb":"font-clashDisplay"}`}>
        {item.slogan}
      </h1>
      
      <div className='flex gap-2 md:gap-3 my-4 md:my-6 flex-wrap'>
        {item.tags?.slice(0, 4).map((tag, index) => {
          const paddingStyles = ["px-4 md:px-6", "px-6 md:px-10", "px-8 md:px-12", "px-10 md:px-16"];
          const pxClass = paddingStyles[index] || "px-6";

          return (
            <span 
              key={index} 
              className={`${pxClass} py-1.5 md:py-2 text-xs md:text-sm font-semibold tracking-wide text-gray-700 dark:text-white bg-black/5 dark:bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-black/10 dark:border-white/20`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <p className='text-sm md:text-base text-gray-600 dark:text-white/80 font-light max-w-[95%] md:max-w-[85%] leading-relaxed'>
        {item.desc}
      </p>
    </div>

    <div className='w-full flex flex-col z-10 mt-auto'>
      <div className='w-full h-[1px] bg-black/10 dark:bg-white/20 mb-3 md:mb-4'></div>
      <div className='w-full flex justify-between items-end font-clashDisplay'>
        <div className='flex flex-col'>
          <h3 className='text-lg md:text-xl text-gray-800 dark:text-white font-medium'>{item.footerTitle}</h3>
          <p className='text-[10px] md:text-xs text-gray-500 dark:text-white/50 mt-1'>{item.footerNote}</p>
        </div>
        <button className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-bold tracking-wider text-white bg-gray-900 dark:text-black dark:bg-white hover:opacity-90 transition-all rounded-full shadow-lg active:scale-95">
          {item.btn}
        </button>
      </div>
    </div>
  </div>
));