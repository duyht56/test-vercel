export type RecordingScope = 'scenario' | 'story' | 'twister' | 'free';

export interface RecordingEntry {
  id: string;
  scope: RecordingScope;
  refId: string;
  uri: string;
  durationMs: number;
  createdAt: string;
  label?: string;
}
