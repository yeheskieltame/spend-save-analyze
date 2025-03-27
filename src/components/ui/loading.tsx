
import React from 'react';
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "rounded-full border-2 border-primary/30 border-t-primary animate-spin",
        sizeClasses[size]
      )} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
