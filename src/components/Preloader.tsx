import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const letters = "aadesh".split("");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Matrix-like Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 h-full w-full">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                  className="w-[1px] bg-white/10 mx-auto"
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <div className="flex items-center mb-8 md:mb-12">
              <div className="flex overflow-hidden">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 150 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: i * 0.08, 
                      ease: [0.33, 1, 0.68, 1] 
                    }}
                    className="text-4xl md:text-8xl font-display font-black text-white uppercase tracking-tighter"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360, 720],
                  borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 md:w-8 md:h-8 bg-[#F27D26] ml-2 md:ml-3 mt-2 md:mt-3 shadow-[0_0_30px_rgba(242,125,38,0.5)]"
              />
            </div>

            {/* Progress Container */}
            <div className="flex flex-col gap-3 items-center">
              <div className="w-40 md:w-72 h-[3px] bg-white/5 relative overflow-hidden rounded-full">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              
              <div className="flex justify-between w-full px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Loading System</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">{progress}%</span>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-12 md:bottom-20 text-[10px] font-black uppercase tracking-[0.6em] md:tracking-[1em] text-white/50"
          >
            Digital Craftsman
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
