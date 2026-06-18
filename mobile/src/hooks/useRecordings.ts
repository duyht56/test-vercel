import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { storage } from '@/utils/storage';
import { RecordingEntry, RecordingScope } from '@/types/recording';

const STORAGE_KEY = '@kid-talk/recordings-v1';

let cache: RecordingEntry[] | null = null;
const subscribers = new Set<(items: RecordingEntry[]) => void>();

async function load(): Promise<RecordingEntry[]> {
  if (cache) return cache;
  cache = (await storage.get<RecordingEntry[]>(STORAGE_KEY)) ?? [];
  return cache;
}

async function persist(next: RecordingEntry[]): Promise<void> {
  cache = next;
  await storage.set(STORAGE_KEY, next);
  subscribers.forEach((cb) => cb(next));
}

export function useRecordings(filter?: { scope?: RecordingScope; refId?: string }) {
  const [items, setItems] = useState<RecordingEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const initial = await load();
      if (mounted) {
        setItems(initial);
        setReady(true);
      }
    })();
    const subscriber = (next: RecordingEntry[]) => {
      if (mounted) setItems(next);
    };
    subscribers.add(subscriber);
    return () => {
      mounted = false;
      subscribers.delete(subscriber);
    };
  }, []);

  const filtered = items.filter((entry) => {
    if (filter?.scope && entry.scope !== filter.scope) return false;
    if (filter?.refId && entry.refId !== filter.refId) return false;
    return true;
  });

  const add = useCallback(
    async (entry: Omit<RecordingEntry, 'id' | 'createdAt'>) => {
      const next: RecordingEntry = {
        ...entry,
        id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const list = await load();
      await persist([next, ...list]);
      return next;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    const list = await load();
    const target = list.find((r) => r.id === id);
    const next = list.filter((r) => r.id !== id);
    await persist(next);
    if (target?.uri) {
      try {
        await FileSystem.deleteAsync(target.uri, { idempotent: true });
      } catch {
        // ignore file errors
      }
    }
  }, []);

  const clear = useCallback(async () => {
    const list = await load();
    await Promise.all(
      list.map((r) =>
        FileSystem.deleteAsync(r.uri, { idempotent: true }).catch(() => undefined),
      ),
    );
    await persist([]);
  }, []);

  return { items: filtered, all: items, ready, add, remove, clear };
}

export function recordingsResetCache() {
  cache = null;
}
