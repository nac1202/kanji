
import React from 'react';
import { MONSTERS } from '../constants';
import { SaveData } from '../types';
import { Button } from './Button';

interface ZukanProps {
  saveData: SaveData;
  onClose: () => void;
  onSelect: (monsterId: string) => void;
}

export const Zukan: React.FC<ZukanProps> = ({ saveData, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-kids-bg z-50 overflow-y-auto flex flex-col">
      <div className="p-4 bg-white shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-3xl font-black text-kids-blue">モンスターずかん</h2>
        <Button onClick={onClose} size="sm" color="orange">とじる</Button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full pb-20">
        {MONSTERS.map((monster) => {
          const exp = saveData.monsterExps[monster.id] || 0;
          const unlocked = saveData.unlockedMonsters.includes(monster.id);
          const isCurrent = saveData.currentMonsterId === monster.id;

          // Find highest unlocked stage
          const currentStageIndex = monster.stages.slice().reverse().findIndex(s => exp >= s.minExp);
          const actualStageIndex = currentStageIndex >= 0 ? monster.stages.length - 1 - currentStageIndex : 0;
          const currentStage = monster.stages[actualStageIndex];

          return (
            <div 
              key={monster.id} 
              className={`
                relative rounded-3xl p-4 border-4 transition-all
                ${unlocked ? 'bg-white border-kids-blue' : 'bg-gray-200 border-gray-300'}
                ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
              `}
            >
              {isCurrent && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  いっしょにいるよ
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className={`
                  w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-inner
                  ${unlocked ? currentStage.color : 'bg-gray-300'}
                `}>
                  {unlocked ? currentStage.emoji : '❓'}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-800 mb-1">
                    {unlocked ? monster.baseName : '？？？'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {unlocked ? monster.description : 'まだ みつけていないよ'}
                  </p>
                  
                  {unlocked && (
                    <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
                       <div 
                         className="bg-kids-green h-full rounded-full"
                         style={{ width: `${Math.min(100, (actualStageIndex / (monster.stages.length - 1)) * 100)}%` }}
                       ></div>
                    </div>
                  )}
                  
                  {unlocked ? (
                    !isCurrent && (
                      <Button 
                        onClick={() => onSelect(monster.id)} 
                        size="sm" 
                        color="blue"
                        className="w-full text-sm py-1"
                      >
                        いっしょにいく
                      </Button>
                    )
                  ) : (
                    <Button 
                        onClick={() => onSelect(monster.id)} 
                        size="sm" 
                        color="green"
                        className="w-full text-sm py-1"
                      >
                        このタマゴをそだてる
                      </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
