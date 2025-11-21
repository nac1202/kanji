
import React from 'react';
import { Monster } from '../types';

interface MonsterDisplayProps {
  monster: Monster;
  exp: number;
  className?: string;
  animate?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MonsterDisplay: React.FC<MonsterDisplayProps> = ({ 
  monster, 
  exp, 
  className = '', 
  animate = true,
  showName = true,
  size = 'md'
}) => {
  // Determine current stage based on EXP
  const currentStage = [...monster.stages].reverse().find(s => exp >= s.minExp) || monster.stages[0];
  
  const sizeClasses = {
    sm: 'text-4xl w-12 h-12',
    md: 'text-6xl w-20 h-20',
    lg: 'text-8xl w-32 h-32',
    xl: 'text-9xl w-48 h-48',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`
        relative rounded-full flex items-center justify-center shadow-lg
        ${currentStage.color}
        ${sizeClasses[size]}
        ${animate ? 'animate-bounce-slow' : ''}
        transition-all duration-500
      `}>
        <span className="drop-shadow-sm filter">{currentStage.emoji}</span>
        
        {/* Exp sparkle effect if close to level up could go here */}
      </div>
      
      {showName && (
        <div className="mt-2 text-center">
          <div className="font-bold text-gray-700 text-lg">{currentStage.name}</div>
          <div className="text-xs text-gray-500 font-bold">
             Lv. {monster.stages.indexOf(currentStage) + 1}
          </div>
        </div>
      )}
    </div>
  );
};
