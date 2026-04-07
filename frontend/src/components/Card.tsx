import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick
}) => {
  const Component = onClick ? motion.div : 'div';
  
  return (
    <Component
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...(onClick ? {
        whileHover: { y: -4, scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      } : {})}
    >
      {children}
    </Component>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  badge
}) => {
  return (
    <motion.div
      whileHover={disabled ? {} : { y: -8, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        group relative overflow-hidden cursor-pointer touch-target h-full
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl 
        border border-gray-100 dark:border-gray-700 transition-all duration-300
        min-h-[280px] sm:min-h-[320px] flex flex-col
        ${disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:border-primary-200 dark:hover:border-primary-700'
        }
      `}
      onClick={disabled ? undefined : onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Badge - Hidden on mobile */}
      {badge && (
        <div className="hidden sm:block absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {badge}
          </div>
        </div>
      )}
      
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
        {/* Icon and Title */}
        <div className="flex flex-col sm:flex-row sm:items-start mb-4">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="text-3xl sm:text-4xl text-primary-500 mr-4 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                {title}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Description - flexible height */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        </div>
        
        {/* Action indicator - pushed to bottom */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore →
          </div>
          {badge && (
            <div className="sm:hidden">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {badge}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-700/70 flex items-center justify-center p-4 backdrop-blur-sm z-20">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-2">
              🌐 Internet Required
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              Please check your connection
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};