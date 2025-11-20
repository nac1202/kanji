import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, (current / total) * 100);
  
  return (
    <div className="w-full max-w-md bg-white rounded-full h-6 mb-6 border-2 border-gray-200 p-1">
      <div 
        className="bg-kids-green h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};