import { useCallback, useEffect, useState } from 'react';
import { Scenario } from '@/types';
import { storage } from '@/utils/storage';

const STORAGE_KEY = '@kid-talk/custom-scenarios-v1';

let cache: Scenario[] | null = null;
const subscribers = new Set<(items: Scenario[]) => void>();

async function load(): Promise<Scenario[]> {
  if (cache) return cache;
  cache = (await storage.get<Scenario[]>(STORAGE_KEY)) ?? [];
  return cache;
}

async function persist(items: Scenario[]): Promise<void> {
  cache = items;
  await storage.set(STORAGE_KEY, items);
  subscribers.forEach((cb) => cb(items));
}

export function useCustomScenarios() {
  const [items, setItems] = useState<Scenario[]>([]);
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
    const sub = (next: Scenario[]) => {
      if (mounted) setItems(next);
    };
    subscribers.add(sub);
    return () => {
      mounted = false;
      subscribers.delete(sub);
    };
  }, []);

  const add = useCallback(async (scenario: Scenario) => {
    const list = await load();
    await persist([scenario, ...list]);
  }, []);

  const remove = useCallback(async (id: string) => {
    const list = await load();
    await persist(list.filter((s) => s.id !== id));
  }, []);

  const findById = useCallback((id: string) => items.find((s) => s.id === id), [items]);

  return { items, ready, add, remove, findById };
}
