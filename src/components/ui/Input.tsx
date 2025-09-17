'use client';

import { motion } from 'framer-motion';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{icon}</div>
            </div>
          )}
          <motion.input
            ref={ref}
            className={`
              block w-full rounded-xl border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
              transition-all duration-200
              text-gray-900 placeholder-gray-400 bg-white
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
