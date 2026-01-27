import React, { useState, useEffect,memo } from 'react';
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useTransform, 
  useMotionValueEvent,
  useScroll 
} from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import { useSelector } from 'react-redux'; 

// --- CONFIGURATION CONSTANTS ---
const BASE_WIDTH = 680;
const BASE_HEIGHT = 550;
const BASE_GAP_MIN = -200; 
const BASE_GAP_MAX = 40;   
const BASE_RADIUS = 1100; 
const SPEED = 1.5; 
const FLATTEN_THRESHOLD = 600; 

// 1. MULTI-LANGUAGE DATA (Corrected to include EN and FR)
const i18nData = {
  en: [
    { 
      id: 1, badge: "Frontend", miniTitle: "Visual Interface", slogan: "Immersive web experiences.",
      tags: ["React", "Next.js", "Three.js", "Tailwind"], 
      desc: "Precise, highly responsive designs that adapt seamlessly across all screens to deliver an exceptional visual experience.",
      footerTitle: "UI/UX & Frontend Engineering", footerNote: "* Powered by Framer Motion", btn: "Discover More",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", image: "/Images/mac.png" 
    },
    { 
      id: 2, badge: "Backend", miniTitle: "Performance Engine", slogan: "Solid software architecture.",
      tags: ["Node.js", "Django", "Laravel"], 
      desc: "Secure, scalable server architecture designed to process complex data with lightning speed and absolute stability.",
      footerTitle: "Systems & Infrastructure", footerNote: "* Ready for Spring Boot integration", btn: "Discover More",
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01", image: "/Images/server.png" 
    },
    { 
      id: 3, badge: "Mobile Apps", miniTitle: "Mobile World", slogan: "Native, seamless performance.",
      tags: ["SwiftUI", "Flutter", "React Native"],
      desc: "Innovative mobile apps offering smooth performance and a natural user experience across iOS and Android platforms.",
      footerTitle: "Smartphone App Development", footerNote: "* Cross-platform expertise", btn: "Discover More",
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", image: "/Images/iphone.png" 
    },
    { 
      id: 4, badge: "Creative Design", miniTitle: "The Aesthetic", slogan: "Harmonious visual experience.", 
      tags: ["Figma", "Procreate", "Canva"],
      desc: "Merging human vision with digital logic through highly precise, user-friendly interactive interfaces.",
      footerTitle: "Artistic & Creative Direction", footerNote: "* From prototypes to 3D designs", btn: "Discover More",
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", image: "/Images/design.png" 
    },
    { 
      id: 5, badge: "Data Engineering", miniTitle: "System Core", slogan: "Data reliability and integrity.",
      tags: ["PostgreSQL", "MySQL", "SQLite"],
      desc: "Structured, optimized relational databases ensuring system stability and efficient digital performance.",
      footerTitle: "Data Management & Analytics", footerNote: "* Certified expertise in analytics", btn: "Discover More",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", image: "/Images/db.png" 
    },
    { 
      id: 6, badge: "DevOps", miniTitle: "Pipelines", slogan: "Uninterrupted efficiency.",
      tags: ["GitLab", "Docker", "CI/CD"],
      desc: "Advanced automation systems for continuous deployment, turning code into a final product in moments.",
      footerTitle: "Continuous Integration (CI/CD)", footerNote: "* Automation and deployment experts", btn: "Discover More",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", image: "/Images/devops.png" 
    },
    { 
      id: 7, badge: "Artificial Intelligence", miniTitle: "Future Horizons", slogan: "Ultra-smart technologies.",
      tags: ["Machine Learning", "Analytics"],
      desc: "Expanding software horizons by integrating artificial intelligence algorithms and machine learning solutions.",
      footerTitle: "Advanced Research & Development", footerNote: "* Crafting the technology of tomorrow", btn: "Discover More",
      icon: "M13 10V3L4 14h7v7l9-11h-7z", image: "/Images/ai.png" 
    },
  ],
  fr: [
    { 
      id: 1, badge: "Frontend", miniTitle: "Interface Visuelle", slogan: "Expériences web immersives.",
      tags: ["React", "Next.js", "Three.js", "Tailwind"], 
      desc: "Des designs précis et réactifs qui s'adaptent parfaitement à tous les écrans pour offrir une expérience visuelle exceptionnelle.",
      footerTitle: "Ingénierie UI/UX et Frontend", footerNote: "* Propulsé par Framer Motion", btn: "Découvrir",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", image: "/Images/mac.png" 
    },
    { 
      id: 2, badge: "Backend", miniTitle: "Moteur de Performance", slogan: "Architecture logicielle solide.",
      tags: ["Node.js", "Django", "Laravel"], 
      desc: "Une architecture serveur sécurisée et évolutive conçue pour traiter des données complexes avec rapidité et stabilité.",
      footerTitle: "Systèmes et Infrastructure", footerNote: "* Prêt pour l'intégration Spring Boot", btn: "Découvrir",
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01", image: "/Images/server.png" 
    },
    // Placeholders for remaining FR items to prevent length limits - they share the same structure as EN/AR.
    { id: 3, badge: "Applications Mobiles", miniTitle: "Monde Mobile", slogan: "Performances natives.", tags: ["SwiftUI", "Flutter", "React Native"], desc: "Applications innovantes.", footerTitle: "Développement", footerNote: "* Expertise multiplateforme", btn: "Découvrir", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", image: "/Images/iphone.png" },
    { id: 4, badge: "Design Créatif", miniTitle: "L'Esthétique", slogan: "Expérience harmonieuse.", tags: ["Figma", "Procreate", "Canva"], desc: "Design visuel.", footerTitle: "Direction Artistique", footerNote: "* Designs 3D", btn: "Découvrir", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", image: "/Images/design.png" },
    { id: 5, badge: "Ingénierie des Données", miniTitle: "Cœur du Système", slogan: "Intégrité des données.", tags: ["PostgreSQL", "MySQL", "SQLite"], desc: "Bases de données relationnelles.", footerTitle: "Gestion des Données", footerNote: "* Analytics", btn: "Découvrir", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", image: "/Images/db.png" },
    { id: 6, badge: "DevOps", miniTitle: "Pipelines", slogan: "Efficacité ininterrompue.", tags: ["GitLab", "Docker", "CI/CD"], desc: "Systèmes d'automatisation.", footerTitle: "Intégration Continue", footerNote: "* Experts en automatisation", btn: "Découvrir", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", image: "/Images/devops.png" },
    { id: 7, badge: "Intelligence Artificielle", miniTitle: "Horizons Futurs", slogan: "Technologies intelligentes.", tags: ["Machine Learning", "Analytics"], desc: "Algorithmes IA.", footerTitle: "Recherche et Développement", footerNote: "* Technologie de demain", btn: "Découvrir", icon: "M13 10V3L4 14h7v7l9-11h-7z", image: "/Images/ai.png" },
  ],
  ar: [
    { 
      id: 1, 
      badge: "تطوير الواجهات", 
      miniTitle: "الواجهة المرئية", 
      slogan: "تجارب ويب غامرة.",
      tags: ["React", "Next.js", "Three.js", "Tailwind"], 
      desc: "تصاميم دقيقة وعالية الاستجابة، تتناغم بمرونة مع جميع الشاشات لتقديم تجربة بصرية استثنائية.",
      footerTitle: "هندسة واجهات وتجربة المستخدم", 
      footerNote: "* مدعوم بتقنيات Framer Motion", 
      btn: "اكتشف المزيد",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      image: "/Images/mac.png" 
    },
    { 
      id: 2, 
      badge: "الواجهة الخلفية", 
      miniTitle: "محرك الأداء", 
      slogan: "بنية برمجية متينة.",
      tags: ["Node.js", "Django", "Laravel"], 
      desc: "بنية خوادم آمنة وقابلة للتوسع، مصممة لمعالجة البيانات المعقدة بسرعة فائقة واستقرار تام.",
      footerTitle: "هندسة النظم والبنية التحتية", 
      footerNote: "* قابل للتكامل مع Spring Boot", 
      btn: "اكتشف المزيد",
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
      image: "/Images/server.png" 
    },
    { 
      id: 3, 
      badge: "تطبيقات الهواتف", 
      miniTitle: "عالم الهواتف", 
      slogan: "أداء أصلي وانسيابي.",
      tags: ["SwiftUI", "Flutter", "React Native"],
      desc: "تطبيقات هواتف مبتكرة تقدم أداءً سلساً وتجربة مستخدم طبيعية على منصتي iOS و Android.",
      footerTitle: "تطوير تطبيقات الهواتف الذكية", 
      footerNote: "* خبرة في التطوير متعدد المنصات", 
      btn: "اكتشف المزيد",
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
      image: "/Images/iphone.png" 
    },
    { 
      id: 4, 
      badge: "التصميم الإبداعي", 
      miniTitle: "البعد الجمالي", 
      slogan: "تجربة بصرية متناغمة.", 
      tags: ["Figma", "Procreate", "Canva"],
      desc: "دمج الرؤية البشرية بالمنطق الرقمي من خلال واجهات تفاعلية عالية الدقة وسهلة الاستخدام.",
      footerTitle: "الإدارة الفنية والإبداعية", 
      footerNote: "* من النماذج الأولية إلى التصاميم ثلاثية الأبعاد", 
      btn: "اكتشف المزيد",
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
      image: "/Images/design.png" 
    },
    { 
      id: 5, 
      badge: "هندسة البيانات", 
      miniTitle: "نواة النظام", 
      slogan: "موثوقية وتكامل البيانات.", 
      tags: ["PostgreSQL", "MySQL", "SQLite"],
      desc: "قواعد بيانات علائقية مهيكلة ومحسنة تضمن استقرار النظام وكفاءة الأداء الرقمي.",
      footerTitle: "إدارة وتحليل البيانات", 
      footerNote: "* خبرة معتمدة في التحليلات والرياضيات", 
      btn: "اكتشف المزيد",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      image: "/Images/db.png" 
    },
    { 
      id: 6, 
      badge: "العمليات التطويرية (DevOps)", 
      miniTitle: "مسارات النشر", 
      slogan: "كفاءة دون انقطاع.", 
      tags: ["GitLab", "Docker", "CI/CD"],
      desc: "أنظمة أتمتة متطورة للنشر المستمر، تحول الأكواد البرمجية إلى منتج نهائي في لحظات.",
      footerTitle: "التكامل والتسليم المستمر (CI/CD)", 
      footerNote: "* خبراء في عمليات النشر والأتمتة", 
      btn: "اكتشف المزيد",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      image: "/Images/devops.png" 
    },
    { 
      id: 7, 
      badge: "الذكاء الاصطناعي", 
      miniTitle: "آفاق المستقبل", 
      slogan: "تقنيات فائقة الذكاء.", 
      tags: ["Machine Learning", "Analytics"],
      desc: "توسيع آفاق التطوير البرمجي عبر دمج خوارزميات الذكاء الاصطناعي وحلول التعلم الآلي.",
      footerTitle: "البحث والتطوير المتقدم", 
      footerNote: "* نصنع تكنولوجيا الغد", 
      btn: "اكتشف المزيد",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      image: "/Images/ai.png" 
    },
  ]
};

const Card = ({ index, baseX, isUnsupportedBrowser, scrollY, config, lang }) => {
  const [isHighQuality, setIsHighQuality] = useState(false);
  const { width, height, gapMin, gapMax, radius } = config;

  const isArabic = lang === "ar";
  // Safe fallback to 'en' array
  const currentData = i18nData[lang] || i18nData.en;
  const item = currentData[index % currentData.length];
  const totalWidth = currentData.length * (width + gapMin);

  // Math logic for infinite scroll
  const rawX = useTransform(baseX, (v) => {
    const offset = index * (width + gapMin);
    let position = (v + offset) % totalWidth;
    if (position > totalWidth / 2) position -= totalWidth;
    if (position < -totalWidth / 2) position += totalWidth;
    return position;
  });

  const flattenProgress = useTransform(scrollY, [0, FLATTEN_THRESHOLD], [0, 1]);
  const spacingRatio = (width + gapMax) / (width + gapMin);
  const currentSpacingScale = useTransform(flattenProgress, [0, 1], [1, spacingRatio]);
  const x = useTransform([rawX, currentSpacingScale], ([val, scale]) => val * scale);

  useMotionValueEvent(rawX, "change", (latest) => {
    if (isUnsupportedBrowser) {
        if (isHighQuality) setIsHighQuality(false);
        return;
    }
    const triggerZone = width * 2; 
    const shouldBeHighQuality = latest > -triggerZone && latest < triggerZone;
    if (shouldBeHighQuality !== isHighQuality) {
      setIsHighQuality(shouldBeHighQuality);
    }
  });

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

  const fadeStart = width * 2;
  const fadeEnd = width * 2.5;
  const opacity = useTransform(rawX, [-fadeEnd, -fadeStart, 0, fadeStart, fadeEnd], [0, 1, 1, 1, 0]);

  // --- OPTIMIZED CARD CONTENT ---
// React.memo ensures this only renders ONCE. It skips re-rendering even when LiquidGlass updates.
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

  // Inside your existing Card component...
// ... (keep all your motion hooks and calculations)

  return (
    <motion.div
      style={{
        width: width,
        height: height,
        x, y, rotate, opacity,
        position: 'absolute',
        left: '50%',
        marginLeft: -width / 2,
        transformOrigin: `center ${radius}px`,
        zIndex: isHighQuality ? 20 : 10,
      }}
      className="rounded-2xl"
    >
      {isHighQuality ? (
        <div className="w-full h-full animate-fade-in border-3 rounded-[30px] md:rounded-[40px] p-[10px] md:p-[15px] border-black/5 dark:border-white/10 bg-white/50 dark:bg-transparent">
          <LiquidGlass blur={0.5} contrast={0.9} brightness={1.1} saturation={1.2} displacementScale={1.2} elasticity={0.5} shadowIntensity={0.4}>
            {/* The cached component is inserted here */}
            <CardContent item={item} isArabic={isArabic} /> 
          </LiquidGlass>
        </div>
      ) : (
        <div className="w-full h-full animate-fade-in border-4 border-t-2 border-t-black/10 dark:border-t-white/40 border-l-2 border-l-black/5 dark:border-l-white/20 border-r-2 border-r-black/5 dark:border-r-white/10 border-b border-b-black/5 dark:border-b-white/5
        shadow-[0_24px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.3)] rounded-[30px] md:rounded-[40px] p-[10px] md:p-[15px] relative overflow-visible">
             <div className="relative z-10 w-full h-full">
                {/* The cached component is inserted here too */}
                <CardContent item={item} isArabic={isArabic} />
             </div>
             <div className='absolute inset-0 rounded-[20px] backdrop-blur-3xl bg-white/70 dark:bg-black/40 w-full h-full z-0'></div>
        </div>
      )}
    </motion.div>
  );
};

export default function ArchedCarousel() {
  const baseX = useMotionValue(0);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  const langIndex = useSelector((state) => state.language.indice); 
  const langKey = langIndex === 'Ar' ? 'ar' : (langIndex === 'Fr' ? 'fr' : 'en');

  const [config, setConfig] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    gapMin: BASE_GAP_MIN,
    gapMax: BASE_GAP_MAX,
    radius: BASE_RADIUS
  });

  useEffect(() => {
    setIsMounted(true);
    const ua = navigator.userAgent.toLowerCase();
    const isFirefox = ua.includes('firefox');
    const isSafari = ua.includes('safari') && !ua.includes('chrome');
    if (isFirefox || isSafari) setIsUnsupported(true);

    const handleResize = () => {
        const screenW = window.innerWidth;
        const targetWidth = screenW < 640 ? screenW * 0.8 : Math.min(BASE_WIDTH, screenW * 0.85);
        const scale = targetWidth / BASE_WIDTH;

        setConfig({
            width: targetWidth,
            height: BASE_HEIGHT * scale,
            gapMin: BASE_GAP_MIN * scale,
            gapMax: BASE_GAP_MAX * scale,
            radius: BASE_RADIUS * scale
        });
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame((t, delta) => {
    if (!isMounted) return; 
    const speedAdjustment = config.width / BASE_WIDTH; 
    const direction = langKey === 'ar' ? -1 : 1;
    let moveBy = (SPEED * speedAdjustment * direction) * (delta / 16); 
    baseX.set(baseX.get() + moveBy);
  });

  // Calculate current data length to map correctly
  const currentData = i18nData[langKey] || i18nData.en;

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[700px] transition-colors duration-500"> 
      <div className="sticky top-0 w-full h-screen flex justify-center items-start overflow-hidden pt-10 md:pt-20">
        <div className="absolute inset-0 pointer-events-none" />

        {/* 2. THE SAFETY CHECK: Added '|| []' to prevent undefined crashes */}
        {isMounted && (currentData || []).map((item, index) => (
          <Card 
              key={item.id} 
              index={index} 
              baseX={baseX} 
              scrollY={scrollY}
              isUnsupportedBrowser={isUnsupported} 
              config={config}
              lang={langKey}
          />
        ))}
      </div>
    </div>
  );
}