
import { SaveData } from "../types";

const STORAGE_KEY = 'kanji-quiz-monster-save-v1';

const DEFAULT_DATA: SaveData = {
  currentMonsterId: null,
  monsterExps: {},
  unlockedMonsters: [],
};

export const storageService = {
  load: (): SaveData => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;
      return { ...DEFAULT_DATA, ...JSON.parse(raw) };
    } catch (e) {
      console.error("Failed to load save data", e);
      return DEFAULT_DATA;
    }
  },

  save: (data: SaveData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }
};
