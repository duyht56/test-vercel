import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/utils/storage';
import { ParentNote, NoteMood } from '@/types/notes';

const STORAGE_KEY = '@kid-talk/parent-notes-v1';

let cache: ParentNote[] | null = null;
const subscribers = new Set<(items: ParentNote[]) => void>();

async function load(): Promise<ParentNote[]> {
  if (cache) return cache;
  cache = (await storage.get<ParentNote[]>(STORAGE_KEY)) ?? [];
  return cache;
}

async function persist(items: ParentNote[]): Promise<void> {
  cache = items;
  await storage.set(STORAGE_KEY, items);
  subscribers.forEach((cb) => cb(items));
}

export function useParentNotes() {
  const [items, setItems] = useState<ParentNote[]>([]);
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
    const sub = (next: ParentNote[]) => {
      if (mounted) setItems(next);
    };
    subscribers.add(sub);
    return () => {
      mounted = false;
      subscribers.delete(sub);
    };
  }, []);

  const add = useCallback(async (text: string, mood: NoteMood) => {
    if (!text.trim()) return null;
    const note: ParentNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: text.trim(),
      mood,
      createdAt: new Date().toISOString(),
    };
    const list = await load();
    await persist([note, ...list]);
    return note;
  }, []);

  const remove = useCallback(async (id: string) => {
    const list = await load();
    await persist(list.filter((n) => n.id !== id));
  }, []);

  return { items, ready, add, remove };
}
