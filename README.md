# KidTalk

Monorepo gồm hai phần:

| Thư mục | Vai trò |
| --- | --- |
| `/` (root) | **Next.js backend** – các endpoint `/api/*` dùng làm proxy gọi Gemini và các dịch vụ AI khác. |
| `/mobile` | Ứng dụng **React Native (Expo)** giúp trẻ em luyện kỹ năng giao tiếp tự tin. |

> Nguyên tắc bảo mật: AI API key (Gemini) **chỉ tồn tại ở server** (`process.env.GEMINI_API_KEY`).
> Mobile app KHÔNG bao giờ chứa key – nó chỉ gọi đến endpoint `/api/ai/*` của backend này.

## 🚀 Backend (Next.js proxy)

### Cấu trúc

```
.
├── lib/
│   ├── gemini.js        # Wrapper REST API của Google Gemini (server only)
│   ├── rateLimit.js     # Sliding-window rate limit theo IP
│   └── cors.js          # CORS cho mobile / web preview
├── pages/
│   ├── api/
│   │   ├── health.js                    # GET /api/health
│   │   └── ai/scenario.js               # POST /api/ai/scenario
│   ├── _app.js
│   └── index.js
└── .env.example                         # Template biến môi trường
```

### Setup local

```bash
cp .env.example .env.local
# Mở .env.local và dán GEMINI_API_KEY (lấy ở https://aistudio.google.com/app/apikey)
npm install
npm run dev
```

Server sẽ chạy ở `http://localhost:3000`. Test:

```bash
curl http://localhost:3000/api/health
# {"ok":true,"name":"kid-talk-backend","aiConfigured":true,...}
```

### Setup trên Vercel

1. Push repo lên GitHub → import vào Vercel.
2. Vào **Project Settings → Environment Variables**.
3. Thêm `GEMINI_API_KEY` với scope **Production** (và **Preview** nếu muốn dùng AI ở preview).
4. (Tuỳ chọn) thêm `GEMINI_MODEL` nếu muốn đổi model mặc định.
5. Re-deploy.

> Vercel sẽ tự inject các biến này vào lúc runtime của serverless function. Mobile chỉ cần biết URL deployment.

### API endpoints

#### `GET /api/health`

Health check + cho biết AI đã được cấu hình chưa.

```json
{ "ok": true, "name": "kid-talk-backend", "version": "0.1.0", "aiConfigured": true, "timestamp": "..." }
```

#### `POST /api/ai/scenario`

Sinh kịch bản hội thoại tiếng Việt cho bé.

Body:

```json
{
  "childName": "Bin",
  "partner": "cô giáo",
  "setting": "lớp học",
  "goal": "nhờ giúp đỡ một việc nhỏ",
  "catchphrase": "Cô ơi, con có thể nhờ cô giúp được không ạ?",
  "difficulty": "easy",
  "ageRange": "6-9"
}
```

Response 200:

```json
{
  "ok": true,
  "scenario": {
    "title": "...",
    "emoji": "🎒",
    "description": "...",
    "goals": ["..."],
    "tips": ["..."],
    "steps": [
      { "speaker": "narrator", "text": "..." },
      { "speaker": "me", "text": "...", "hint": "..." }
    ]
  }
}
```

Mã lỗi:

| HTTP | code | Ý nghĩa |
| --- | --- | --- |
| 405 | – | Sai method (chỉ chấp nhận POST/OPTIONS). |
| 429 | `RATE_LIMITED` | Vượt 10 request/phút mỗi IP. |
| 503 | `NO_API_KEY` | Server chưa cấu hình `GEMINI_API_KEY`. |
| 504 | `UPSTREAM_TIMEOUT` | Gemini phản hồi quá chậm. |
| 400 | `SAFETY_BLOCK` | Bị safety filter từ chối. |
| 502 | `BAD_SHAPE` | AI trả về JSON không đúng schema. |
| 500 | `INTERNAL` | Lỗi không mong muốn. |

### Rate limit & bảo mật

- 10 request / phút / IP (cấu hình trong `pages/api/ai/scenario.js`).
- `lib/gemini.js` set `safetySettings = BLOCK_LOW_AND_ABOVE` cho 4 nhóm có hại.
- Input mọi field bị cắt độ dài và lọc ký tự control trước khi đưa vào prompt.
- Response từ AI được validate lại schema trước khi trả cho client.

## 📱 Mobile app

Toàn bộ source ở [`mobile/`](./mobile/README.md). Mobile gọi backend qua biến
`EXPO_PUBLIC_API_BASE_URL` (KHÔNG có API key). Xem chi tiết trong
[`mobile/README.md`](./mobile/README.md).

## ⚠️ Tại sao key phải ở server?

- Bundle React Native sau khi build có thể được giải nén và đọc string thường
  trong vài giây. Bất cứ key nào nằm trong `EXPO_PUBLIC_*` hay hard-code trong
  source đều coi như public.
- Nếu key Gemini lộ, người khác có thể dùng đốt quota / chi phí của bạn và bạn
  có thể phải gánh hoá đơn.
- Đặt key trên server (Vercel env var) cho phép bạn:
  - Rotate key bất kỳ lúc nào, mobile không cần update.
  - Áp rate limit, logging, abuse detection ở một chỗ.
  - Thay nhà cung cấp AI (OpenAI, Anthropic…) chỉ cần đổi backend, không phải
    đẩy bản app mới lên store.
