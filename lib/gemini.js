// Server-only helper for talking to Google's Gemini REST API.
// IMPORTANT: This file must NEVER be imported from client-side bundles.
// The API key lives only in process.env.GEMINI_API_KEY which is read on the server.

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Call Gemini's generateContent endpoint with a single text prompt.
 * Returns the parsed text payload (which we expect to be JSON when
 * `response_mime_type` is set).
 *
 * @param {string} prompt
 * @param {{
 *   model?: string,
 *   temperature?: number,
 *   maxOutputTokens?: number,
 *   responseMimeType?: string,
 *   timeoutMs?: number,
 * }} [options]
 */
export async function generateText(prompt, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.7;
  const maxOutputTokens = options.maxOutputTokens ?? 1024;
  const timeoutMs = options.timeoutMs ?? 12000;

  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(options.responseMimeType
        ? { responseMimeType: options.responseMimeType }
        : {}),
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  };

  let res;
  try {
    res = await fetch(
      `${ENDPOINT_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller ? controller.signal : undefined,
      },
    );
  } catch (err) {
    if (timeout) clearTimeout(timeout);
    if (err && err.name === 'AbortError') {
      const timeoutErr = new Error('Gemini request timed out.');
      timeoutErr.code = 'UPSTREAM_TIMEOUT';
      throw timeoutErr;
    }
    const networkErr = new Error('Failed to reach Gemini.');
    networkErr.code = 'UPSTREAM_NETWORK';
    networkErr.cause = err;
    throw networkErr;
  }
  if (timeout) clearTimeout(timeout);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const upstreamErr = new Error(
      `Gemini responded ${res.status}: ${text.slice(0, 200)}`,
    );
    upstreamErr.code = 'UPSTREAM_ERROR';
    upstreamErr.status = res.status;
    throw upstreamErr;
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    const noCandidateErr = new Error('Gemini returned no candidates.');
    noCandidateErr.code = 'NO_CANDIDATES';
    throw noCandidateErr;
  }
  const finishReason = candidate.finishReason;
  if (finishReason === 'SAFETY' || finishReason === 'BLOCKED') {
    const safetyErr = new Error('Response blocked by safety filters.');
    safetyErr.code = 'SAFETY_BLOCK';
    throw safetyErr;
  }
  const parts = candidate.content?.parts ?? [];
  const text = parts.map((p) => p.text).filter(Boolean).join('').trim();
  return text;
}

/**
 * Try to parse a JSON object from the model output. Strips common
 * markdown code fences and is tolerant of leading/trailing prose.
 *
 * @param {string} text
 * @returns {unknown}
 */
export function safeParseJson(text) {
  if (!text) throw new Error('Empty model output.');
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error('Model output is not JSON.');
  }
  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
}
