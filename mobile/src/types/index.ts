export type IconName = keyof typeof import('@expo/vector-icons/build/Ionicons').default.glyphMap;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ConversationLine {
  speaker: 'partner' | 'me' | 'narrator';
  text: string;
  hint?: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  difficulty: Difficulty;
  ageRange: string;
  estimatedMinutes: number;
  goals: string[];
  steps: ConversationLine[];
  tips: string[];
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  description: string;
  ageRange: string;
  estimatedMinutes: number;
  paragraphs: string[];
  questions: string[];
}

export interface TongueTwister {
  id: string;
  text: string;
  difficulty: Difficulty;
  meaning: string;
}

export interface EmotionCard {
  id: string;
  name: string;
  emoji: string;
  color: string;
  exampleSentence: string;
  practicePrompt: string;
}

export interface DailyChallenge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  xp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  threshold: number;
  type: 'scenarios' | 'stories' | 'twisters' | 'streak' | 'xp';
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  completedScenarios: string[];
  completedStories: string[];
  completedTwisters: string[];
  unlockedAchievements: string[];
  childName: string;
}
