
import { Monster, QuizQuestion } from "./types";

// List of 80 Kanji taught in Japanese 1st grade
export const GRADE_1_KANJI = [
  "一", "右", "雨", "円", "王", "音", "下", "火", "花", "貝", 
  "学", "気", "九", "休", "玉", "金", "空", "月", "犬", "見", 
  "五", "口", "校", "左", "三", "山", "子", "四", "糸", "字", 
  "耳", "七", "車", "手", "十", "出", "女", "小", "上", "森", 
  "人", "水", "正", "生", "青", "夕", "石", "赤", "千", "川", 
  "先", "早", "草", "足", "村", "大", "男", "竹", "中", "虫", 
  "町", "天", "田", "土", "二", "日", "入", "年", "白", "八", 
  "百", "文", "木", "本", "名", "目", "立", "力", "林", "六"
];

export const MONSTERS: Monster[] = [
  {
    id: "fire",
    baseName: "ヒノコ",
    description: "げんきな ほのおの モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-red-100" },
      { name: "ヒノコ", emoji: "🔥", minExp: 1, color: "bg-red-200" },
      { name: "ヒトリザル", emoji: "🐵", minExp: 20, color: "bg-red-300" },
      { name: "ゴリラオウ", emoji: "🦍", minExp: 60, color: "bg-red-400" },
      { name: "ドラゴン", emoji: "🐉", minExp: 120, color: "bg-red-500" },
    ]
  },
  {
    id: "water",
    baseName: "ミズマル",
    description: "やさしい みずの モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-blue-100" },
      { name: "シズク", emoji: "💧", minExp: 1, color: "bg-blue-200" },
      { name: "ペンギン", emoji: "🐧", minExp: 20, color: "bg-blue-300" },
      { name: "イルカ", emoji: "🐬", minExp: 60, color: "bg-blue-400" },
      { name: "クジラ", emoji: "🐳", minExp: 120, color: "bg-blue-500" },
    ]
  },
  {
    id: "grass",
    baseName: "クサッピ",
    description: "しぜんが だいすきな モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-green-100" },
      { name: "フタバ", emoji: "🌱", minExp: 1, color: "bg-green-200" },
      { name: "カエル", emoji: "🐸", minExp: 20, color: "bg-green-300" },
      { name: "ワニ", emoji: "🐊", minExp: 60, color: "bg-green-400" },
      { name: "ダイナソー", emoji: "🦖", minExp: 120, color: "bg-green-500" },
    ]
  },
  {
    id: "electric",
    baseName: "ピカマル",
    description: "すばやい でんきの モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-yellow-100" },
      { name: "ビリリ", emoji: "⚡️", minExp: 1, color: "bg-yellow-200" },
      { name: "ネズミ", emoji: "🐭", minExp: 20, color: "bg-yellow-300" },
      { name: "キツネ", emoji: "🦊", minExp: 60, color: "bg-yellow-400" },
      { name: "ライオン", emoji: "🦁", minExp: 120, color: "bg-yellow-500" },
    ]
  },
  {
    id: "magic",
    baseName: "キララ",
    description: "ふしぎな まほうの モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-purple-100" },
      { name: "ホシ", emoji: "⭐️", minExp: 1, color: "bg-purple-200" },
      { name: "ウサギ", emoji: "🐰", minExp: 20, color: "bg-purple-300" },
      { name: "ペガサス", emoji: "🦄", minExp: 60, color: "bg-purple-400" },
      { name: "マホウツカイ", emoji: "🧙", minExp: 120, color: "bg-purple-500" },
    ]
  },
  {
    id: "rock",
    baseName: "イワオ",
    description: "ちからもちの いわ モンスター",
    stages: [
      { name: "たまご", emoji: "🥚", minExp: 0, color: "bg-stone-100" },
      { name: "イシ", emoji: "🪨", minExp: 1, color: "bg-stone-200" },
      { name: "カメ", emoji: "🐢", minExp: 20, color: "bg-stone-300" },
      { name: "クマ", emoji: "🐻", minExp: 60, color: "bg-stone-400" },
      { name: "ゴーレム", emoji: "🗿", minExp: 120, color: "bg-stone-500" },
    ]
  },
];

// Fallback questions for offline mode or error handling
export const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    originalSentence: "山へ いきます",
    displaySentence: "[山] へ いきます",
    targetKanji: "山",
    correctReading: "やま",
    options: ["やま", "かわ", "うみ", "そら"],
  },
  {
    originalSentence: "川で あそぶ",
    displaySentence: "[川] で あそぶ",
    targetKanji: "川",
    correctReading: "かわ",
    options: ["かわ", "やま", "いけ", "みず"],
  },
  {
    originalSentence: "大きな 木",
    displaySentence: "大きな [木]",
    targetKanji: "木",
    correctReading: "き",
    options: ["き", "は", "め", "ね"],
  },
  {
    originalSentence: "青い 空",
    displaySentence: "青い [空]",
    targetKanji: "空",
    correctReading: "そら",
    options: ["そら", "うみ", "くも", "あめ"],
  },
  {
    originalSentence: "白い 花",
    displaySentence: "白い [花]",
    targetKanji: "花",
    correctReading: "はな",
    options: ["はな", "くさ", "えだ", "み"],
  },
  {
    originalSentence: "雨が ふる",
    displaySentence: "[雨] が ふる",
    targetKanji: "雨",
    correctReading: "あめ",
    options: ["あめ", "ゆき", "かぜ", "くも"],
  },
  {
    originalSentence: "一ねんせい",
    displaySentence: "[一] ねんせい",
    targetKanji: "一",
    correctReading: "いち",
    options: ["いち", "に", "さん", "じゅう"],
  },
  {
    originalSentence: "学校へ いく",
    displaySentence: "[学] 校へ いく",
    targetKanji: "学",
    correctReading: "がっ",
    options: ["がっ", "がい", "かく", "ごう"],
  },
  {
    originalSentence: "先生",
    displaySentence: "[先] 生",
    targetKanji: "先",
    correctReading: "せん",
    options: ["せん", "さき", "まえ", "ちか"],
  },
  {
    originalSentence: "足が はやい",
    displaySentence: "[足] が はやい",
    targetKanji: "足",
    correctReading: "あし",
    options: ["あし", "て", "くび", "かた"],
  }
];