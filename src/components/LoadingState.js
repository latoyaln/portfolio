import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="fixed inset-0 bg-midnight flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: [0, 1, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="relative"
      >
        <img 
          src="/assets/LN-Logo-light.webp" 
          alt="LN Design Logo" 
          className="h-20 w-auto"
        />
        <motion.div
          className="absolute inset-0 bg-daylight/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingState; 