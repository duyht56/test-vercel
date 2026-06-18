import { applyCors } from '../../lib/cors';
import { isGeminiConfigured } from '../../lib/gemini';

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  res.status(200).json({
    ok: true,
    name: 'kid-talk-backend',
    version: '0.1.0',
    aiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
  });
}
