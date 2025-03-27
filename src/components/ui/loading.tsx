
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'md', className, text, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const spinnerAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const textAnimation = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.1
      }
    }
  };

  const ContentComponent = (
    <motion.div 
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-[70vh]" : "",
        className
      )}
    >
      <motion.div 
        variants={spinnerAnimation}
        className={cn(
          "rounded-full border-2 border-primary/30 border-t-primary animate-spin",
          sizeClasses[size]
        )} 
      />
      {text && (
        <motion.p 
          variants={textAnimation} 
          className="mt-2 text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  return ContentComponent;
}
