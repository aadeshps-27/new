import { motion } from 'motion/react';

export default function Logo() {
  return (
    <motion.div 
      className="flex items-center gap-1 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center relative">
        <span className="font-display font-black text-3xl md:text-2xl uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 transition-colors">
          aadesh
        </span>
        <div className="relative ml-1 mt-1">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-3 md:w-2.5 md:h-2.5 rounded-sm bg-[#F27D26]" 
          />
          {/* Creative Grid Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-brand/30" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-brand/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

