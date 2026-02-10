"use client";

import { motion } from "framer-motion";

const messages = [
  "AI 大师正在观相...",
  "细看天庭饱满...",
  "再看地阁方圆...",
  "火马年运势加持中...",
  "推演流年运程...",
];

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="relative w-24 h-24">
        {/* 外圈旋转 */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-r-transparent border-b-yellow-500 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* 内圈反向旋转 */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-red-500 border-b-transparent border-l-red-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* 中心文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-2xl animate-pulse">🐴</span>
        </div>
      </div>

      <div className="h-6 relative w-64 text-center overflow-hidden">
        {messages.map((msg, i) => (
          <motion.p
            key={msg}
            className="absolute inset-0 text-yellow-100 font-medium tracking-wide text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, -10]
            }}
            transition={{
              duration: 2.5,
              delay: i * 2.5,
              repeat: Infinity,
              repeatDelay: (messages.length - 1) * 2.5,
            }}
          >
            {msg}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
