'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden';
  
  return (
    <motion.div
      className={`${baseClasses} ${hover ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      layout
    >
      {children}
    </motion.div>
  );
}
