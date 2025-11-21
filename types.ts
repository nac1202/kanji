
export interface QuizQuestion {
  originalSentence: string;
  displaySentence: string;
  targetKanji: string;
  correctReading: string;
  options: string[];
}

export enum GameState {
  START_SCREEN,
  MONSTER_SELECT, // New: Choose a partner
  LOADING_QUESTION,
  PLAYING,
  FEEDBACK,
  RESULT_SCREEN,
  ZUKAN, // New: Encyclopedia
  EVOLUTION, // New: Evolution animation
  ERROR
}

export interface EvolutionStage {
  name: string;
  emoji: string;
  minExp: number; // EXP required to reach this stage
  color: string;
}

export interface Monster {
  id: string;
  baseName: string;
  description: string;
  stages: EvolutionStage[];
}

export interface SaveData {
  currentMonsterId: string | null;
  monsterExps: Record<string, number>; // { "fire_monster": 150, ... }
  unlockedMonsters: string[]; // List of monster IDs that have been unlocked/selected at least once
}
