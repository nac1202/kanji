import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'pink' | 'yellow' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const colorClasses = {
  blue: 'bg-kids-blue hover:bg-teal-400 text-white border-b-4 border-teal-600 active:border-b-0 active:translate-y-1',
  green: 'bg-kids-green hover:bg-green-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1',
  pink: 'bg-kids-pink hover:bg-pink-400 text-white border-b-4 border-pink-600 active:border-b-0 active:translate-y-1',
  yellow: 'bg-kids-yellow hover:bg-yellow-300 text-yellow-900 border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1',
  orange: 'bg-kids-orange hover:bg-orange-400 text-white border-b-4 border-orange-600 active:border-b-0 active:translate-y-1',
};

const sizeClasses = {
  sm: 'py-2 px-4 text-lg',
  md: 'py-3 px-8 text-xl',
  lg: 'py-4 px-12 text-2xl',
};

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  color = 'blue', 
  size = 'md',
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-bold rounded-2xl transition-all duration-100
        ${colorClasses[color]} 
        ${sizeClasses[size]} 
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer shadow-lg'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};