import { useCallback } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { StringKey, translate } from './strings';

export function useT() {
  const { state } = useProgress();
  const lang = state.language ?? 'vi';
  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );
  return { t, lang };
}
