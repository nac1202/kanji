import React from 'react';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  correctReading: string;
  onNext: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ isCorrect, correctReading, onNext }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`
        bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-8 
        ${isCorrect ? 'border-kids-green' : 'border-kids-pink'}
        transform transition-all scale-100
      `}>
        <div className="text-8xl mb-4">
            {isCorrect ? '⭕' : '❌'}
        </div>
        <h2 className={`text-4xl font-black mb-4 ${isCorrect ? 'text-kids-green' : 'text-kids-pink'}`}>
          {isCorrect ? 'せいかい！' : 'ざんねん...'}
        </h2>
        
        {!isCorrect && (
          <div className="mb-6">
            <p className="text-gray-500 text-lg">せいかいは...</p>
            <p className="text-3xl font-bold text-gray-800">「{correctReading}」</p>
          </div>
        )}

        <button 
          onClick={onNext}
          className="w-full bg-kids-blue hover:bg-teal-400 text-white font-bold py-4 px-8 rounded-xl text-2xl border-b-4 border-teal-600 active:border-b-0 active:translate-y-1 transition-all"
        >
          つぎへ
        </button>
      </div>
    </div>
  );
};