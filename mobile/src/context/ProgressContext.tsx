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
import { stickers } from '@/data/stickers';

const STORAGE_KEY = '@kid-talk/progress-v2';
const LEGACY_KEY_V1 = '@kid-talk/progress-v1';

const initialState: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedScenarios: [],
  completedStories: [],
  completedTwisters: [],
  unlockedAchievements: [],
  unlockedStickers: [],
  recentlyUnlocked: [],
  activityLog: {},
  childName: 'Bạn nhỏ',
  language: 'vi',
};

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  addXp: (amount: number) => Promise<void>;
  markScenario: (id: string, xp?: number) => Promise<void>;
  markStory: (id: string, xp?: number) => Promise<void>;
  markTwister: (id: string, xp?: number) => Promise<void>;
  setChildName: (name: string) => Promise<void>;
  setLanguage: (lang: 'vi' | 'en') => Promise<void>;
  consumeRecentUnlocks: () => Promise<string[]>;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function valueForType(state: ProgressState, type: string): number {
  switch (type) {
    case 'scenarios':
      return state.completedScenarios.length;
    case 'stories':
      return state.completedStories.length;
    case 'twisters':
      return state.completedTwisters.length;
    case 'streak':
      return state.streak;
    case 'xp':
      return state.xp;
    default:
      return 0;
  }
}

function evaluateAchievements(state: ProgressState): {
  achievements: string[];
  stickers: string[];
  newlyUnlocked: string[];
} {
  const prevA = new Set(state.unlockedAchievements);
  const prevS = new Set(state.unlockedStickers);
  const newlyUnlocked: string[] = [];

  const nextA = new Set(prevA);
  for (const a of achievements) {
    if (!prevA.has(a.id) && valueForType(state, a.type) >= a.threshold) {
      nextA.add(a.id);
      newlyUnlocked.push(`achievement:${a.id}`);
    }
  }

  const nextS = new Set(prevS);
  for (const s of stickers) {
    if (!prevS.has(s.id) && valueForType(state, s.unlock.type) >= s.unlock.threshold) {
      nextS.add(s.id);
      newlyUnlocked.push(`sticker:${s.id}`);
    }
  }

  return {
    achievements: Array.from(nextA),
    stickers: Array.from(nextS),
    newlyUnlocked,
  };
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

function bumpActivity(state: ProgressState): ProgressState {
  const today = todayKey();
  const log = { ...state.activityLog };
  log[today] = (log[today] ?? 0) + 1;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 60);
  const cutoffKey = todayKey(cutoff);
  const trimmed: Record<string, number> = {};
  for (const k of Object.keys(log)) {
    if (k >= cutoffKey) trimmed[k] = log[k];
  }
  return { ...state, activityLog: trimmed };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let stored = await storage.get<ProgressState>(STORAGE_KEY);
      if (!stored) {
        const legacy = await storage.get<Partial<ProgressState>>(LEGACY_KEY_V1);
        if (legacy) {
          stored = { ...initialState, ...legacy } as ProgressState;
          await storage.set(STORAGE_KEY, stored);
        }
      }
      if (mounted) {
        setState(stored ? { ...initialState, ...stored } : initialState);
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
      let next = bumpStreak(mutator(state));
      next = bumpActivity(next);
      const evaluated = evaluateAchievements(next);
      const finalState: ProgressState = {
        ...next,
        unlockedAchievements: evaluated.achievements,
        unlockedStickers: evaluated.stickers,
        recentlyUnlocked: [...next.recentlyUnlocked, ...evaluated.newlyUnlocked],
      };
      await persist(finalState);
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

  const setLanguage = useCallback(
    (lang: 'vi' | 'en') => persist({ ...state, language: lang }),
    [persist, state],
  );

  const consumeRecentUnlocks = useCallback(async () => {
    const unlocks = state.recentlyUnlocked;
    if (unlocks.length === 0) return [];
    await persist({ ...state, recentlyUnlocked: [] });
    return unlocks;
  }, [persist, state]);

  const resetProgress = useCallback(async () => {
    await persist(initialState);
  }, [persist]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      addXp,
      markScenario,
      markStory,
      markTwister,
      setChildName,
      setLanguage,
      consumeRecentUnlocks,
      resetProgress,
    }),
    [
      state,
      ready,
      addXp,
      markScenario,
      markStory,
      markTwister,
      setChildName,
      setLanguage,
      consumeRecentUnlocks,
      resetProgress,
    ],
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
