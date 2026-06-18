import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ProgressState } from '@/types';
import { storage } from '@/utils/storage';
import { diffInDays, todayKey } from '@/utils/dates';
import { achievements } from '@/data/achievements';

const STORAGE_KEY = '@kid-talk/progress-v1';

const initialState: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedScenarios: [],
  completedStories: [],
  completedTwisters: [],
  unlockedAchievements: [],
  childName: 'Bạn nhỏ',
};

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  addXp: (amount: number) => Promise<void>;
  markScenario: (id: string, xp?: number) => Promise<void>;
  markStory: (id: string, xp?: number) => Promise<void>;
  markTwister: (id: string, xp?: number) => Promise<void>;
  setChildName: (name: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function evaluateAchievements(state: ProgressState): string[] {
  const unlocked = new Set(state.unlockedAchievements);
  for (const a of achievements) {
    if (unlocked.has(a.id)) continue;
    let value = 0;
    switch (a.type) {
      case 'scenarios':
        value = state.completedScenarios.length;
        break;
      case 'stories':
        value = state.completedStories.length;
        break;
      case 'twisters':
        value = state.completedTwisters.length;
        break;
      case 'streak':
        value = state.streak;
        break;
      case 'xp':
        value = state.xp;
        break;
    }
    if (value >= a.threshold) {
      unlocked.add(a.id);
    }
  }
  return Array.from(unlocked);
}

function bumpStreak(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.lastActiveDate === today) {
    return state;
  }
  let nextStreak = 1;
  if (state.lastActiveDate) {
    const delta = diffInDays(state.lastActiveDate, today);
    if (delta === 1) {
      nextStreak = state.streak + 1;
    } else if (delta === 0) {
      nextStreak = state.streak || 1;
    } else {
      nextStreak = 1;
    }
  }
  return { ...state, streak: nextStreak, lastActiveDate: today };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await storage.get<ProgressState>(STORAGE_KEY);
      if (mounted) {
        setState(stored ?? initialState);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: ProgressState) => {
    setState(next);
    await storage.set(STORAGE_KEY, next);
  }, []);

  const update = useCallback(
    async (mutator: (prev: ProgressState) => ProgressState) => {
      const next = bumpStreak(mutator(state));
      const withAchievements = {
        ...next,
        unlockedAchievements: evaluateAchievements(next),
      };
      await persist(withAchievements);
    },
    [persist, state],
  );

  const addXp = useCallback(
    (amount: number) => update((prev) => ({ ...prev, xp: prev.xp + amount })),
    [update],
  );

  const markScenario = useCallback(
    (id: string, xp = 30) =>
      update((prev) => ({
        ...prev,
        xp: prev.xp + xp,
        completedScenarios: prev.completedScenarios.includes(id)
          ? prev.completedScenarios
          : [...prev.completedScenarios, id],
      })),
    [update],
  );

  const markStory = useCallback(
    (id: string, xp = 25) =>
      update((prev) => ({
        ...prev,
        xp: prev.xp + xp,
        completedStories: prev.completedStories.includes(id)
          ? prev.completedStories
          : [...prev.completedStories, id],
      })),
    [update],
  );

  const markTwister = useCallback(
    (id: string, xp = 15) =>
      update((prev) => ({
        ...prev,
        xp: prev.xp + xp,
        completedTwisters: prev.completedTwisters.includes(id)
          ? prev.completedTwisters
          : [...prev.completedTwisters, id],
      })),
    [update],
  );

  const setChildName = useCallback(
    (name: string) => persist({ ...state, childName: name || 'Bạn nhỏ' }),
    [persist, state],
  );

  const resetProgress = useCallback(async () => {
    await persist(initialState);
  }, [persist]);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, ready, addXp, markScenario, markStory, markTwister, setChildName, resetProgress }),
    [state, ready, addXp, markScenario, markStory, markTwister, setChildName, resetProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }
  return ctx;
}
