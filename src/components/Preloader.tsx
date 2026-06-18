import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Smoother and more organic progress timeline
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 600);
          return 100;
        }
        // Organic, modern incremental speed steps
        const diff = 100 - prev;
        const speedMultiplier = diff > 40 ? 4 : diff > 15 ? 2 : 1;
        const incr = Math.floor(Math.random() * speedMultiplier) + 1;
        return Math.min(prev + incr, 100);
      });
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] overflow-hidden select-none touch-none bg-zinc-950">
          {/* Minimal Background Panel */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -20,
              transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
            }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Ambient aesthetic glow */}
            <div className="absolute inset-x-0 top-1/4 bottom-1/4 bg-[radial-gradient(circle_at_center,rgba(242,125,38,0.04)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Premium Navbar Logo integrated on Preloader */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center mb-4 select-none"
              >
                <span className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tighter text-white">
                  aadesh
                </span>
                <div className="relative ml-1.5 mt-1.5">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3.5 h-3.5 rounded-sm bg-[#F27D26] shadow-[0_0_15px_rgba(242,125,38,0.6)]" 
                  />
                </div>
              </motion.div>

              {/* Minimal Hairline Progress Line */}
              <div className="w-24 sm:w-32 h-[1px] bg-zinc-900 overflow-hidden relative mt-4 rounded-full">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#F27D26]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Minimalist Micro counter indicator */}
              <motion.span 
                className="text-[8px] font-mono tracking-[0.25em] text-zinc-500 mt-2 block uppercase"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {progress < 100 ? `Loading · ${progress}%` : "Loaded"}
              </motion.span>
            </div>
          </motion.div>

          {/* Sweeping Parallax Parachute Curtain (keeps original premium exit feel transition) */}
          <motion.div
            initial={{ y: "100%" }}
            exit={{ 
              y: "-100%",
              transition: { duration: 0.85, delay: 0.05, ease: [0.76, 0, 0.24, 1] }
            }}
            className="absolute inset-0 z-50 bg-[#F27D26]"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
