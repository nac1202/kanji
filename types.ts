export interface QuizQuestion {
  originalSentence: string; // The full sentence
  displaySentence: string; // The sentence with brackets e.g., "わたしは [花] をみました"
  targetKanji: string; // "花"
  correctReading: string; // "はな"
  options: string[]; // ["はな", "みみ", "くち", "て"] (Shuffled)
}

export enum GameState {
  START_SCREEN,
  LOADING_QUESTION,
  PLAYING,
  FEEDBACK,
  RESULT_SCREEN,
  ERROR
}
