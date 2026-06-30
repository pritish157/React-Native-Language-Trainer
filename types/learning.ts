export interface Language {
  id: string; // e.g. 'es', 'fr', 'zh'
  name: string;
  nativeName: string;
  flag: string; // flag emoji or key
  isActive: boolean;
  learnersCount?: string; // e.g. '28.4M learners'
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  meaning: string;
  pronunciation?: string;
  context?: string;
}

export type ActivityType =
  | 'video_lecture'
  | 'audio_dialogue'
  | 'ai_tutor_chat'
  | 'vocabulary_quiz'
  | 'phrase_matching';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  
  // Interactive / Quiz items
  vocabularyItems?: VocabularyItem[];
  phrases?: Phrase[];
  multipleChoiceOptions?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string; // e.g. correct answer id or text
  
  // AI Agent configurations
  aiTeacherPrompt?: string; // Directives for Vision Agent
  aiTutorPrompt?: string;   // Directives for Chat Agent
}

export type LessonType = 'video' | 'audio' | 'chat' | 'interactive';

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  type: LessonType;
  goals: string[];
  activities: Activity[];
  image?: any;
}

export interface Unit {
  id: string;
  languageId: string;
  number: number;
  title: string;
  description: string;
}
