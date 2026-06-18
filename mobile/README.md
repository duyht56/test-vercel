# KidTalk – Bé tự tin giao tiếp 🌟

Ứng dụng React Native (Expo) giúp trẻ em luyện kỹ năng giao tiếp tự tin thông
qua các tình huống đóng vai, đọc truyện, chơi biến lưỡi và gọi tên cảm xúc.

> Đây là phiên bản MVP đầu tiên, được viết bằng TypeScript với Expo SDK 51.
> Mọi nội dung và giao diện đều sử dụng tiếng Việt, dành cho trẻ 5–12 tuổi.

## ✨ Tính năng chính

| Module                    | Mô tả                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| 🏠 Trang chính             | Lời chào theo tên bé, streak luyện tập, thử thách trong ngày, lưới tính năng và XP.           |
| 💬 Luyện hội thoại         | 6 kịch bản đóng vai (chào bạn mới, gọi món, thuyết trình, hòa giải…) có gợi ý từng bước.       |
| 📖 Đọc truyện              | 3 truyện ngắn ngắn gọn có TTS đọc to từng đoạn và bộ câu hỏi gợi mở phản hồi.                 |
| 🌀 Biến lưỡi              | 6 câu biến lưỡi tiếng Việt với 3 mức tốc độ TTS để bé đọc theo.                              |
| 💖 Thẻ cảm xúc             | 8 cảm xúc cơ bản kèm câu ví dụ và prompt để bé gọi tên cảm xúc của mình.                      |
| 🏆 Huy hiệu & tiến độ      | Huy hiệu mở khóa theo XP, streak và số bài đã hoàn thành.                                     |
| 🧒 Hồ sơ bé                | Đặt tên, lời khuyên cho bố mẹ, đặt lại tiến độ.                                              |

Tiến độ được lưu cục bộ qua `AsyncStorage`, có streak tự động, tính XP và mở
khóa achievement khi đủ ngưỡng.

## 🧱 Kiến trúc thư mục

```
mobile/
├── App.tsx                 # Entry point (Provider + Navigation)
├── app.json                # Cấu hình Expo
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript + alias @/ -> src/
├── babel.config.js
└── src/
    ├── components/         # Card, Button, Pill, ProgressBar, ScreenHeader…
    ├── context/            # ProgressContext (XP, streak, achievements)
    ├── data/               # Nội dung tĩnh (kịch bản, truyện, biến lưỡi, cảm xúc)
    ├── navigation/         # Bottom tabs + stack navigator
    ├── screens/            # Các màn hình ứng dụng
    ├── theme/              # Màu sắc, typography, spacing
    ├── types/              # Khai báo type chung
    └── utils/              # Storage, helper ngày tháng
```

## 🚀 Chạy thử

> Lệnh chạy trong thư mục `mobile/`.

```bash
cd mobile
npm install
npx expo start
```

Sau đó:

- Quét mã QR bằng app **Expo Go** trên iOS/Android để chạy thử trên thiết bị.
- Hoặc bấm `i` để mở iOS Simulator, `a` để mở Android Emulator (cần cài sẵn).
- Bấm `w` để chạy bản web (giới hạn, dành cho test giao diện).

> Lưu ý: Project chưa có file ảnh `assets/icon.png`, `assets/splash.png`,
> `assets/adaptive-icon.png`, `assets/favicon.png`. Khi build production hãy
> bổ sung 4 ảnh này. Trong quá trình dev với Expo Go, ứng dụng vẫn chạy bình
> thường (Expo dùng ảnh mặc định).

## 🧪 Kiểm tra type

```bash
npm run tsc
```

## 📌 Phụ thuộc chính

- `expo` ~51, `react-native` 0.74
- `@react-navigation/native`, `@react-navigation/native-stack`,
  `@react-navigation/bottom-tabs`
- `expo-speech` – đọc to văn bản tiếng Việt
- `expo-haptics` – phản hồi rung khi hoàn thành
- `expo-linear-gradient` – gradient các tile/banner
- `@react-native-async-storage/async-storage` – lưu tiến độ
- `@expo/vector-icons` – Ionicons cho icon UI

## 🗺️ Roadmap đề xuất

1. **Ghi âm & phát lại** – cho phép bé ghi âm câu trả lời và nghe lại để tự đánh giá.
2. **Phụ huynh & nhật ký** – dashboard cho bố mẹ theo dõi tiến độ + ghi chú quan sát.
3. **Cá nhân hóa nội dung** – tự sinh kịch bản dựa trên độ tuổi, sở thích, điểm yếu của bé.
4. **Đa ngôn ngữ** – thêm tiếng Anh, hỗ trợ giáo viên song ngữ.
5. **Phần thưởng & sticker** – kho sticker mở khóa khi đạt mục tiêu, tăng động lực.
6. **Tích hợp AI hội thoại** – sử dụng LLM để mở rộng kịch bản ngẫu hứng theo phản hồi của bé.
7. **Chế độ ngoại tuyến hoàn toàn** – đảm bảo mọi tính năng dùng được không cần Internet.

## 📁 Lưu ý về repo này

Repo gốc đang là dự án Next.js (`/pages`, `/styles`...). Toàn bộ source code
React Native được đặt riêng trong thư mục `mobile/` để không ảnh hưởng đến phần
web. Có thể tách `mobile/` thành repo riêng khi sẵn sàng phát hành.
