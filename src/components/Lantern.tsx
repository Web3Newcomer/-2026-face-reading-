"use client";

import { motion } from "framer-motion";

export default function Lantern({ side, delay = 0 }: { side: "left" | "right", delay?: number }) {
  const isLeft = side === "left";
  
  return (
    <motion.div
      className="absolute top-0 z-20 pointer-events-none"
      style={{ 
        [side]: "5%",
        transformOrigin: "top center"
      }}
      initial={{ y: -100, opacity: 0, rotate: isLeft ? 5 : -5 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        rotate: [isLeft ? 5 : -5, isLeft ? -2 : 2, isLeft ? 5 : -5]
      }}
      transition={{ 
        y: { duration: 1, delay, ease: "easeOut" },
        opacity: { duration: 1, delay },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* 挂绳 */}
      <div className="w-1 h-12 bg-yellow-600 mx-auto" />
      
      {/* 灯笼主体 */}
      <div className="relative">
        {/* 顶部装饰 */}
        <div className="w-16 h-4 bg-yellow-600 rounded-t-lg mx-auto" />
        
        {/* 灯身 */}
        <div className="w-32 h-28 bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center relative overflow-hidden">
          {/* 金色骨架线 */}
          <div className="absolute inset-0 border-x-2 border-yellow-500/30 w-20 mx-auto rounded-[50%]" />
          <div className="absolute inset-0 border-x-2 border-yellow-500/30 w-10 mx-auto rounded-[50%]" />
          
          {/* "福"字 (SVG path for Fu) */}
          <svg width="40" height="40" viewBox="0 0 100 100" fill="#FCD34D" className="opacity-90">
             <path d="M40 10 L60 10 L60 20 L40 20 Z M30 30 L70 30 L70 40 L30 40 Z M20 50 L80 50 L80 90 L20 90 Z M35 60 L65 60 M35 70 L65 70 M35 80 L65 80" />
             {/* Simplified Fu character representation */}
             <text x="50" y="70" textAnchor="middle" fontSize="50" fill="#FCD34D" fontFamily="serif" fontWeight="bold">福</text>
          </svg>
        </div>
        
        {/* 底部装饰 */}
        <div className="w-16 h-4 bg-yellow-600 rounded-b-lg mx-auto" />
        
        {/* 流苏 */}
        <div className="flex justify-center gap-1 mt-0">
          <motion.div 
            className="w-1 h-16 bg-red-500"
            animate={{ skewX: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div 
            className="w-1 h-20 bg-yellow-500"
            animate={{ skewX: [0, 4, 0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="w-1 h-16 bg-red-500"
            animate={{ skewX: [0, 6, 0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
