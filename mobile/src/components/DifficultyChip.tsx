import React from 'react';
import { Difficulty } from '@/types';
import { Pill } from './Pill';
import { colors } from '@/theme';

const labels: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Vừa',
  hard: 'Thử thách',
};

const palette: Record<Difficulty, { color: string; textColor: string }> = {
  easy: { color: colors.success, textColor: colors.textOnPrimary },
  medium: { color: colors.accent, textColor: colors.textPrimary },
  hard: { color: colors.danger, textColor: colors.textOnPrimary },
};

export function DifficultyChip({ value }: { value: Difficulty }) {
  return <Pill label={labels[value]} {...palette[value]} />;
}
