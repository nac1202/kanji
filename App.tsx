
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { MonsterDisplay } from './components/MonsterDisplay';
import { Zukan } from './components/Zukan';
import { generateQuizQuestion } from './services/geminiService';
import { GameState, QuizQuestion, SaveData, Monster } from './types';
import { audio } from './services/audioService';
import { storageService } from './services/storageService';
import { MONSTERS } from './constants';

const TOTAL_QUESTIONS = 5;
const EXP_PER_QUESTION = 2; // Exp gained per correct answer

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean } | null>(null);
  const [usedKanji, setUsedKanji] = useState<string[]>([]);
  
  // Save Data State
  const [saveData, setSaveData] = useState<SaveData>(storageService.load());
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [expGainedInSession, setExpGainedInSession] = useState(0);

  // Initial Load & Monster Sync
  useEffect(() => {
    if (!saveData.currentMonsterId) {
        // Will handle in UI
    } else {
        const m = MONSTERS.find(m => m.id === saveData.currentMonsterId);
        setCurrentMonster(m || MONSTERS[0]);
    }
  }, []);

  // Save whenever data changes
  useEffect(() => {
    storageService.save(saveData);
    if (saveData.currentMonsterId) {
        const m = MONSTERS.find(m => m.id === saveData.currentMonsterId);
        setCurrentMonster(m || null);
    }
  }, [saveData]);

  const startGame = useCallback(() => {
    audio.init();
    audio.playStart();

    if (!saveData.currentMonsterId) {
        setGameState(GameState.MONSTER_SELECT);
        return;
    }

    setScore(0);
    setExpGainedInSession(0);
    setQuestionCount(0);
    setUsedKanji([]);
    setGameState(GameState.LOADING_QUESTION);
    loadNextQuestion([]);
  }, [saveData.currentMonsterId]);

  const selectMonster = (monsterId: string) => {
    audio.playCorrect(); // Confirmation sound
    
    // If this is a first-time selection (unlocking), start them at Stage 1 (Child) instead of Stage 0 (Egg)
    const currentExp = saveData.monsterExps[monsterId] || 0;
    const startingExp = currentExp === 0 ? 1 : currentExp;

    const newSave = {
        ...saveData,
        currentMonsterId: monsterId,
        monsterExps: {
            ...saveData.monsterExps,
            [monsterId]: startingExp
        },
        unlockedMonsters: Array.from(new Set([...saveData.unlockedMonsters, monsterId]))
    };
    setSaveData(newSave);
    
    // If we were in selection screen, start game now
    if (gameState === GameState.MONSTER_SELECT) {
        // Small delay to show selection
        setTimeout(() => {
            setScore(0);
            setExpGainedInSession(0);
            setQuestionCount(0);
            setUsedKanji([]);
            setGameState(GameState.LOADING_QUESTION);
            loadNextQuestion([]);
        }, 500);
    } else if (gameState === GameState.ZUKAN) {
        setGameState(GameState.START_SCREEN);
    }
  };

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
    
    if (isCorrect) {
      audio.playCorrect();
      setScore(prev => prev + 1);
      setExpGainedInSession(prev => prev + EXP_PER_QUESTION);
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
      finishGame();
    } else {
      loadNextQuestion(usedKanji);
    }
  };

  const finishGame = () => {
      // Apply EXP
      if (currentMonster && expGainedInSession > 0) {
          const currentExp = saveData.monsterExps[currentMonster.id] || 0;
          const newExp = currentExp + expGainedInSession;
          
          // Check for evolution
          const oldStage = currentMonster.stages.slice().reverse().find(s => currentExp >= s.minExp);
          const newStage = currentMonster.stages.slice().reverse().find(s => newExp >= s.minExp);
          
          const hasEvolved = oldStage && newStage && oldStage.name !== newStage.name;

          const newSaveData = {
              ...saveData,
              monsterExps: {
                  ...saveData.monsterExps,
                  [currentMonster.id]: newExp
              }
          };
          setSaveData(newSaveData);

          if (hasEvolved) {
             audio.playEvolution(); 
          } else {
             if (score >= TOTAL_QUESTIONS - 1) audio.playFanfare();
             else audio.playStart();
          }
      }
      
      setGameState(GameState.RESULT_SCREEN);
  };

  // 1. Error Screen
  if (gameState === GameState.ERROR) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-6">しばらくしてから もういちど あそんでね。</p>
        <Button onClick={() => window.location.reload()} color="orange">再読み込み</Button>
      </div>
    );
  }

  // 2. Monster Select Screen (First time or switching)
  if (gameState === GameState.MONSTER_SELECT) {
    return (
        <div className="min-h-screen bg-kids-bg p-4 flex flex-col items-center">
            <h2 className="text-3xl font-black text-kids-blue mb-4 text-center">
                パートナーをえらんでね！
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {MONSTERS.map(m => (
                    <button 
                        key={m.id}
                        onClick={() => selectMonster(m.id)}
                        className="bg-white rounded-3xl p-4 shadow-lg border-4 border-white hover:border-kids-yellow transition-all flex flex-col items-center"
                    >
                        {/* Show Stage 1 (Child) instead of Egg for selection appeal */}
                        <div className="text-6xl mb-2">{m.stages[1].emoji}</div>
                        <div className="font-bold text-gray-700">{m.baseName}</div>
                        <div className="text-xs text-gray-400">{m.description}</div>
                    </button>
                ))}
            </div>
        </div>
    )
  }

  // 3. Zukan Screen
  if (gameState === GameState.ZUKAN) {
      return <Zukan saveData={saveData} onClose={() => setGameState(GameState.START_SCREEN)} onSelect={selectMonster} />;
  }

  // 4. Start Screen
  if (gameState === GameState.START_SCREEN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-kids-bg">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-kids-yellow rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kids-pink rounded-full opacity-50 blur-2xl"></div>

        <div className="z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl text-center max-w-lg w-full border-4 border-white">
          <div className="mb-6">
             <span className="inline-block bg-kids-orange text-white text-sm font-bold px-3 py-1 rounded-full mb-2">1ねんせい</span>
             <h1 className="text-5xl font-black text-kids-blue tracking-wider drop-shadow-sm mb-2">
               かんじクイズ
             </h1>
          </div>

          {currentMonster && (
              <div className="mb-8 cursor-pointer" onClick={() => setGameState(GameState.ZUKAN)}>
                  <p className="text-sm font-bold text-gray-400 mb-2">キミのパートナー</p>
                  <MonsterDisplay 
                    monster={currentMonster} 
                    exp={saveData.monsterExps[currentMonster.id] || 0} 
                    size="lg"
                  />
                  <div className="text-xs bg-gray-200 rounded-full px-3 py-1 inline-block mt-2 text-gray-500 font-bold">
                      クリックして ずかん をみる
                  </div>
              </div>
          )}

          <Button onClick={startGame} size="lg" color="green" className="w-full mb-4">
            スタート！
          </Button>

          <Button onClick={() => setGameState(GameState.ZUKAN)} size="md" color="yellow" className="w-full">
             モンスターずかん
          </Button>
        </div>
      </div>
    );
  }

  // 5. Result Screen
  if (gameState === GameState.RESULT_SCREEN) {
    const currentExp = (currentMonster && saveData.monsterExps[currentMonster.id]) || 0;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-kids-bg">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-8 border-kids-yellow">
          <h2 className="text-4xl font-black text-kids-blue mb-2">けっか</h2>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="text-5xl font-black text-gray-800">
                {score} / {TOTAL_QUESTIONS}
            </div>
          </div>

          {currentMonster && (
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <div className="text-sm font-bold text-gray-500 mb-2">パートナーのせいちょう</div>
                  <MonsterDisplay 
                    monster={currentMonster} 
                    exp={currentExp} 
                    size="md"
                  />
                  <div className="mt-2 font-bold text-kids-orange">
                      +{expGainedInSession} EXP ゲット!
                  </div>
              </div>
          )}

          <Button onClick={startGame} size="lg" color="pink" className="w-full mb-4">
            もういちど あそぶ
          </Button>
          
          <Button onClick={() => setGameState(GameState.START_SCREEN)} size="md" color="blue" className="w-full">
            タイトルへ
          </Button>
        </div>
      </div>
    );
  }

  // 6. Loading Screen
  if (gameState === GameState.LOADING_QUESTION) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-kids-bg">
        <div className="text-6xl animate-spin mb-6">🤔</div>
        <h2 className="text-2xl font-bold text-kids-blue">もんだい を つくっているよ...</h2>
      </div>
    );
  }

  // 7. Playing Screen
  return (
    <div className="min-h-screen flex flex-col items-center pt-4 pb-4 px-4 max-w-2xl mx-auto bg-kids-bg">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="text-xl font-bold text-gray-500">
          もんだい {questionCount + 1} / {TOTAL_QUESTIONS}
        </div>
        <div className="flex items-center gap-2">
            {currentMonster && (
                <MonsterDisplay 
                    monster={currentMonster} 
                    exp={saveData.monsterExps[currentMonster.id] || 0} 
                    size="sm"
                    showName={false}
                    animate={false}
                />
            )}
            <div className="bg-white px-4 py-2 rounded-full shadow-sm font-bold text-kids-orange border-2 border-kids-orange">
            ⭐️ {score}
            </div>
        </div>
      </div>

      <ProgressBar current={questionCount} total={TOTAL_QUESTIONS} />

      {currentQuestion && (
        <>
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl w-full mb-6 border-b-8 border-gray-200 min-h-[200px] flex flex-col justify-center items-center relative">
            <div className="absolute -top-6 bg-kids-blue text-white px-6 py-2 rounded-full font-bold shadow-md">
              なんとよむ？
            </div>
            <div className="text-4xl md:text-5xl font-black text-center leading-relaxed text-gray-800 mt-4">
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
                const colors: ('blue' | 'green' | 'orange' | 'pink')[] = ['blue', 'green', 'orange', 'pink'];
                return (
                    <Button 
                        key={idx} 
                        onClick={() => handleAnswer(option)}
                        size="lg"
                        color={colors[idx % 4]}
                        className="h-20 md:h-24 text-2xl md:text-3xl"
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
