
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { generateQuizQuestion } from './services/geminiService';
import { GameState, QuizQuestion } from './types';
import { API_KEY } from './constants';
import { audio } from './services/audioService';

const TOTAL_QUESTIONS = 5;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean } | null>(null);
  const [usedKanji, setUsedKanji] = useState<string[]>([]);

  // Initial check for API Key
  useEffect(() => {
    if (!API_KEY) {
      setGameState(GameState.ERROR);
    }
  }, []);

  const startGame = useCallback(() => {
    // Initialize audio on user interaction
    audio.init();
    audio.playStart();

    setScore(0);
    setQuestionCount(0);
    setUsedKanji([]);
    setGameState(GameState.LOADING_QUESTION);
    loadNextQuestion([]);
  }, []);

  const loadNextQuestion = async (currentUsed: string[]) => {
    setGameState(GameState.LOADING_QUESTION);
    try {
      const question = await generateQuizQuestion(currentUsed);
      setCurrentQuestion(question);
      setUsedKanji(prev => [...prev, question.targetKanji]);
      setGameState(GameState.PLAYING);
    } catch (e) {
      console.error(e);
      setGameState(GameState.ERROR);
    }
  };

  const handleAnswer = (selected: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = selected === currentQuestion.correctReading;
    
    // Play Sound Effect
    if (isCorrect) {
      audio.playCorrect();
      setScore(prev => prev + 1);
    } else {
      audio.playIncorrect();
    }
    
    setFeedback({ isCorrect });
    setGameState(GameState.FEEDBACK);
  };

  const handleNext = () => {
    audio.playPop();
    setFeedback(null);
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount >= TOTAL_QUESTIONS) {
      // Check if perfect score for fanfare
      if (score === TOTAL_QUESTIONS || (score === TOTAL_QUESTIONS - 1 && feedback?.isCorrect)) {
        audio.playFanfare();
      } else {
         // Just a normal result sound (using start sound as a generic positive jingel)
         audio.playStart();
      }
      setGameState(GameState.RESULT_SCREEN);
    } else {
      loadNextQuestion(usedKanji);
    }
  };

  // 1. Error Screen
  if (gameState === GameState.ERROR) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-6">
            APIキーが設定されていないか、通信エラーです。<br/>
            APIキーを確認してください。
        </p>
        <Button onClick={() => window.location.reload()} color="orange">再読み込み</Button>
      </div>
    );
  }

  // 2. Start Screen
  if (gameState === GameState.START_SCREEN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-kids-yellow rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kids-pink rounded-full opacity-50 blur-2xl"></div>

        <div className="z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl text-center max-w-lg w-full border-4 border-white">
          <div className="mb-6">
             <span className="inline-block bg-kids-orange text-white text-sm font-bold px-3 py-1 rounded-full mb-2">1ねんせい</span>
             <h1 className="text-5xl font-black text-kids-blue tracking-wider drop-shadow-sm mb-2">
               かんじクイズ
             </h1>
             <p className="text-xl text-gray-600 font-bold">
               よみかた を あてよう！
             </p>
          </div>

          <div className="flex justify-center my-8">
            <div className="text-8xl animate-bounce">🏫</div>
          </div>

          <Button onClick={startGame} size="lg" color="green" className="w-full">
            スタート！
          </Button>
        </div>
      </div>
    );
  }

  // 3. Result Screen
  if (gameState === GameState.RESULT_SCREEN) {
    const isPerfect = score === TOTAL_QUESTIONS;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-8 border-kids-yellow">
          <h2 className="text-4xl font-black text-kids-blue mb-6">けっか</h2>
          
          <div className="text-9xl mb-4">
            {score >= 4 ? '🏆' : score >= 2 ? '✨' : '🌱'}
          </div>

          <div className="text-5xl font-black mb-2 text-gray-800">
            {score} / {TOTAL_QUESTIONS}
          </div>
          <p className="text-xl font-bold text-gray-500 mb-8">
            {isPerfect ? 'すごい！ぜんもんせいかい！' : 'よくがんばったね！'}
          </p>

          <Button onClick={startGame} size="lg" color="pink" className="w-full">
            もういちど あそぶ
          </Button>
        </div>
      </div>
    );
  }

  // 4. Loading Screen
  if (gameState === GameState.LOADING_QUESTION) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl animate-spin mb-6">🤔</div>
        <h2 className="text-2xl font-bold text-kids-blue">もんだい を つくっているよ...</h2>
      </div>
    );
  }

  // 5. Playing Screen
  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-4 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-gray-500">
          もんだい {questionCount + 1} / {TOTAL_QUESTIONS}
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm font-bold text-kids-orange border-2 border-kids-orange">
          ⭐️ {score}
        </div>
      </div>

      <ProgressBar current={questionCount} total={TOTAL_QUESTIONS} />

      {currentQuestion && (
        <>
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl w-full mb-8 border-b-8 border-gray-200 min-h-[200px] flex flex-col justify-center items-center relative">
            <div className="absolute -top-6 bg-kids-blue text-white px-6 py-2 rounded-full font-bold shadow-md">
              なんとよむ？
            </div>
            <div className="text-4xl md:text-5xl font-black text-center leading-relaxed text-gray-800">
              {currentQuestion.displaySentence.split(/(\[.*?\])/).map((part, index) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  return (
                    <span key={index} className="text-kids-pink inline-block border-b-4 border-kids-pink px-2 mx-1">
                      {part.replace(/[\[\]]/g, '')}
                    </span>
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {currentQuestion.options.map((option, idx) => {
                // Assign different colors to buttons for fun
                const colors: ('blue' | 'green' | 'orange' | 'pink')[] = ['blue', 'green', 'orange', 'pink'];
                return (
                    <Button 
                        key={idx} 
                        onClick={() => handleAnswer(option)}
                        size="lg"
                        color={colors[idx % 4]}
                        className="h-24 text-3xl"
                    >
                        {option}
                    </Button>
                )
            })}
          </div>
        </>
      )}

      {/* Feedback Overlay */}
      {gameState === GameState.FEEDBACK && feedback && currentQuestion && (
        <FeedbackOverlay 
          isCorrect={feedback.isCorrect} 
          correctReading={currentQuestion.correctReading}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default App;
