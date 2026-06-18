import { applyCors } from '../../../lib/cors';
import { generateText, isGeminiConfigured, safeParseJson } from '../../../lib/gemini';
import { checkRateLimit, getClientKey } from '../../../lib/rateLimit';

const MAX_FIELD_LENGTH = 200;
const RATE_LIMIT = { windowMs: 60_000, max: 10 };
const ALLOWED_DIFFICULTY = new Set(['easy', 'medium', 'hard']);

function sanitize(value, maxLength = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
}

function buildPrompt(input) {
  const child = sanitize(input.childName, 40) || 'Bạn nhỏ';
  const partner = sanitize(input.partner, 80);
  const setting = sanitize(input.setting, 80);
  const goal = sanitize(input.goal, 120);
  const catchphrase = sanitize(input.catchphrase, 160);
  const difficulty = ALLOWED_DIFFICULTY.has(input.difficulty)
    ? input.difficulty
    : 'easy';
  const ageRange = sanitize(input.ageRange, 16) || '6-9';

  return `Bạn là chuyên gia ngôn ngữ trị liệu và giáo dục cho trẻ em Việt Nam.
Hãy soạn một kịch bản hội thoại ngắn, ấm áp, dễ hiểu để bé luyện giao tiếp tự tin.

Yêu cầu cốt lõi:
- Ngôn ngữ tiếng Việt phù hợp văn hoá Việt Nam, KHÔNG có nội dung gây sợ hãi/bạo lực/người lớn.
- Bé tên: "${child}". Đối tượng giao tiếp: "${partner}".
- Bối cảnh: "${setting}". Mục tiêu giao tiếp: "${goal}".
- Câu mà bé muốn luyện (nếu có): "${catchphrase}".
- Độ khó: ${difficulty} (easy | medium | hard) – ngắn/đơn giản hoặc dài/phức tạp tương ứng.
- Lứa tuổi: ${ageRange} – chọn từ ngữ phù hợp.

Trả về DUY NHẤT một JSON object (không kèm văn bản ngoài), tuân thủ đúng schema:
{
  "title": string (ngắn gọn, vui, tối đa 60 ký tự),
  "emoji": string (1 emoji hợp với nội dung),
  "description": string (1-2 câu mô tả tình huống, tối đa 160 ký tự),
  "goals": string[] (3 mục tiêu cụ thể bé học được, mỗi mục < 80 ký tự),
  "tips": string[] (2-3 mẹo cho bé hoặc ba mẹ, mỗi mẹo < 120 ký tự),
  "steps": Array<{ "speaker": "narrator" | "me" | "partner", "text": string, "hint"?: string }>
}

Quy tắc cho "steps":
- 6 đến 8 bước.
- Bắt đầu bằng 1 bước "narrator" mô tả bối cảnh.
- Xen kẽ "me" (bé nói) và "partner" (đối phương). Hãy có ít nhất 2 lượt bé nói.
- Với bước "me", nếu phù hợp thì thêm "hint" gợi ý ngắn cho bé (giọng điệu, cử chỉ, hơi thở).
- Kết thúc bằng "narrator" hoặc "me" với câu cảm ơn/tạm biệt tích cực.

Tuyệt đối chỉ trả JSON, không thêm \`\`\` markdown.`;
}

function validateScenario(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw badShape('payload-not-object');
  }
  const out = {};
  out.title = sanitize(parsed.title, 80) || 'Kịch bản mới';
  out.emoji = sanitize(parsed.emoji, 6) || '🛠️';
  out.description = sanitize(parsed.description, 200) || 'Tình huống tự tạo.';

  const goalsArr = Array.isArray(parsed.goals) ? parsed.goals : [];
  out.goals = goalsArr
    .map((g) => sanitize(g, 120))
    .filter(Boolean)
    .slice(0, 5);
  if (out.goals.length === 0) out.goals = ['Tự tin diễn đạt mong muốn của mình'];

  const tipsArr = Array.isArray(parsed.tips) ? parsed.tips : [];
  out.tips = tipsArr
    .map((t) => sanitize(t, 200))
    .filter(Boolean)
    .slice(0, 5);

  const stepsArr = Array.isArray(parsed.steps) ? parsed.steps : [];
  out.steps = stepsArr
    .map((step) => {
      if (!step || typeof step !== 'object') return null;
      const speaker = step.speaker;
      if (speaker !== 'narrator' && speaker !== 'me' && speaker !== 'partner') {
        return null;
      }
      const text = sanitize(step.text, 320);
      if (!text) return null;
      const hint = step.hint ? sanitize(step.hint, 200) : undefined;
      return hint ? { speaker, text, hint } : { speaker, text };
    })
    .filter(Boolean)
    .slice(0, 12);

  if (out.steps.length < 4) {
    throw badShape('not-enough-steps');
  }
  return out;
}

function badShape(why) {
  const err = new Error(`Bad shape: ${why}`);
  err.code = 'BAD_SHAPE';
  return err;
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  if (!isGeminiConfigured()) {
    res.status(503).json({
      ok: false,
      error: 'AI chưa được cấu hình trên server. Vui lòng thử lại sau.',
      code: 'NO_API_KEY',
    });
    return;
  }

  const ip = getClientKey(req);
  const limit = checkRateLimit(`ai:scenario:${ip}`, RATE_LIMIT);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    res.status(429).json({
      ok: false,
      error: `Bạn vừa gửi quá nhiều yêu cầu. Thử lại sau ${limit.retryAfterSec}s.`,
      code: 'RATE_LIMITED',
    });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const prompt = buildPrompt(body);

  try {
    const text = await generateText(prompt, {
      temperature: 0.8,
      maxOutputTokens: 900,
      responseMimeType: 'application/json',
    });
    const parsed = safeParseJson(text);
    const scenario = validateScenario(parsed);
    res.status(200).json({ ok: true, scenario });
  } catch (err) {
    const code = err && err.code;
    if (code === 'SAFETY_BLOCK') {
      res.status(400).json({
        ok: false,
        error: 'Yêu cầu bị bộ lọc an toàn từ chối. Hãy thử lại với mô tả khác.',
        code,
      });
      return;
    }
    if (code === 'RATE_LIMITED' || code === 'UPSTREAM_TIMEOUT') {
      res.status(504).json({
        ok: false,
        error: 'AI phản hồi chậm. Vui lòng thử lại.',
        code,
      });
      return;
    }
    if (code === 'BAD_SHAPE') {
      res.status(502).json({
        ok: false,
        error: 'AI trả về định dạng không hợp lệ. Hãy thử lại.',
        code,
      });
      return;
    }
    console.error('[api/ai/scenario] error', err);
    res.status(500).json({
      ok: false,
      error: 'Có lỗi không mong muốn. Vui lòng thử lại sau ít phút.',
      code: code || 'INTERNAL',
    });
  }
}
