export type NoteMood = 'happy' | 'neutral' | 'tough';

export interface ParentNote {
  id: string;
  text: string;
  mood: NoteMood;
  createdAt: string;
}
