import { Difficulty, Scenario } from '@/types';

export interface AiScenarioInput {
  childName: string;
  partner: string;
  setting: string;
  goal: string;
  catchphrase: string;
  difficulty: Difficulty;
  ageRange: string;
}

export type AiScenarioResult =
  | { ok: true; scenario: Scenario }
  | { ok: false; error: string; code?: string; status?: number };

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      'EXPO_PUBLIC_API_BASE_URL chưa được cấu hình. Hãy đặt URL của backend trong file .env (không bao giờ đặt API key ở mobile).',
    );
    this.name = 'AiNotConfiguredError';
  }
}

function getBaseUrl(): string | null {
  const raw = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

export function isAiBackendConfigured(): boolean {
  return getBaseUrl() !== null;
}

interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

async function postJson<T>(path: string, payload: unknown, options: RequestOptions = {}): Promise<T> {
  const base = getBaseUrl();
  if (!base) throw new AiNotConfiguredError();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client': 'kid-talk-mobile',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // ignore parse error – will surface as status check below
    }
    if (!res.ok) {
      const obj = (data as Record<string, unknown>) ?? {};
      const error = new Error(
        (obj.error as string) ?? `Backend trả về lỗi ${res.status}.`,
      ) as Error & { status?: number; code?: string };
      error.status = res.status;
      error.code = (obj.code as string) ?? undefined;
      throw error;
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

interface BackendScenarioStep {
  speaker: 'narrator' | 'me' | 'partner';
  text: string;
  hint?: string;
}

interface BackendScenarioPayload {
  ok: true;
  scenario: {
    title: string;
    emoji: string;
    description: string;
    goals: string[];
    tips: string[];
    steps: BackendScenarioStep[];
  };
}

export async function requestAiScenario(
  input: AiScenarioInput,
  options: RequestOptions = {},
): Promise<AiScenarioResult> {
  try {
    const data = await postJson<BackendScenarioPayload>('/api/ai/scenario', input, options);
    const s = data.scenario;
    if (!s || !Array.isArray(s.steps) || s.steps.length < 4) {
      return { ok: false, error: 'AI trả về dữ liệu không đầy đủ.', code: 'BAD_SHAPE' };
    }
    const scenario: Scenario = {
      id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: s.title,
      emoji: s.emoji,
      description: s.description,
      difficulty: input.difficulty,
      ageRange: input.ageRange,
      estimatedMinutes: estimateMinutes(s.steps.length, input.difficulty),
      goals: s.goals,
      tips: s.tips,
      steps: s.steps,
    };
    return { ok: true, scenario };
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      return { ok: false, error: err.message, code: 'NO_BACKEND' };
    }
    if (err && (err as { name?: string }).name === 'AbortError') {
      return { ok: false, error: 'Yêu cầu bị huỷ hoặc quá thời gian.', code: 'ABORT' };
    }
    const e = err as Error & { status?: number; code?: string };
    return { ok: false, error: e.message ?? 'Không gọi được AI.', code: e.code, status: e.status };
  }
}

function estimateMinutes(stepCount: number, difficulty: Difficulty): number {
  const base = Math.max(3, Math.round(stepCount * 0.6));
  if (difficulty === 'hard') return base + 1;
  if (difficulty === 'easy') return Math.max(3, base - 1);
  return base;
}

export interface AiHealthResult {
  reachable: boolean;
  aiConfigured: boolean;
  error?: string;
}

export async function checkAiHealth(timeoutMs = 6000): Promise<AiHealthResult> {
  const base = getBaseUrl();
  if (!base) return { reachable: false, aiConfigured: false, error: 'NO_BACKEND' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}/api/health`, { signal: controller.signal });
    if (!res.ok) return { reachable: false, aiConfigured: false, error: `HTTP ${res.status}` };
    const data = (await res.json()) as { aiConfigured?: boolean };
    return { reachable: true, aiConfigured: Boolean(data.aiConfigured) };
  } catch (err) {
    return {
      reachable: false,
      aiConfigured: false,
      error: (err as Error).message,
    };
  } finally {
    clearTimeout(timer);
  }
}
