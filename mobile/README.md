# KidTalk – Bé tự tin giao tiếp 🌟

Ứng dụng React Native (Expo SDK 51 + TypeScript) giúp trẻ em luyện kỹ năng
giao tiếp tự tin thông qua đóng vai, đọc truyện, biến lưỡi, gọi tên cảm xúc và
ghi âm tự đánh giá.

> Phiên bản hiện tại: **v0.2.0** – đã triển khai trọn 5 hạng mục đầu tiên trong
> roadmap (ghi âm, sticker, kịch bản tự tạo, bảng phụ huynh, đa ngôn ngữ).

## ✨ Tính năng

| Module                    | Mô tả                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| 🏠 Trang chính             | Lời chào theo tên bé, streak, thanh XP, thử thách trong ngày, lưới tính năng và shortcut nhanh.          |
| 💬 Luyện hội thoại         | 6 kịch bản dựng sẵn + **kịch bản tự tạo** từ template (đối tượng, bối cảnh, mục tiêu, độ khó).            |
| 🛠️ Tự tạo kịch bản        | Form dạng Chip – tự sinh hội thoại 7 bước theo lựa chọn của bé / phụ huynh, lưu vào kho riêng.            |
| 📖 Đọc truyện              | 3 truyện ngắn, TTS đọc cả truyện hoặc từng đoạn, câu hỏi gợi mở phản hồi.                              |
| 🌀 Biến lưỡi              | 6 câu biến lưỡi tiếng Việt với 3 mức tốc độ TTS.                                                       |
| 💖 Thẻ cảm xúc             | 8 cảm xúc cơ bản kèm câu ví dụ và prompt thực hành.                                                    |
| 🎤 Ghi âm & phát lại      | Hồ sơ ghi âm cho từng kịch bản và truyện, dùng `expo-av`. Phát lại / xóa từng bản ghi.                   |
| 🪄 Bộ sưu tập sticker     | 12 sticker (3 độ hiếm) tự mở khoá theo XP / streak / số bài. Có **modal mở khóa** đẹp mắt.              |
| 🏆 Huy hiệu & XP           | 8 huy hiệu mở khoá theo nhiều nhóm chỉ số.                                                            |
| 🧑‍👧 Góc của ba mẹ         | Heatmap 14 ngày, thống kê tổng quan, tiến độ theo nội dung, **nhật ký quan sát** với mood + xóa.        |
| 🌐 Đa ngôn ngữ             | Toggle UI **Tiếng Việt / English** trong Hồ sơ; nội dung học giữ tiếng Việt để bé luyện đúng.          |
| 🧒 Hồ sơ bé                | Đặt tên, lời khuyên cho bố mẹ, đặt lại tiến độ.                                                       |

Toàn bộ dữ liệu (XP, streak, achievements, stickers, ghi âm, ghi chú phụ huynh,
kịch bản tự tạo, ngôn ngữ, lịch hoạt động) được lưu cục bộ qua `AsyncStorage`
và `FileSystem` – không cần Internet sau khi cài app.

## 🧱 Kiến trúc thư mục

```
mobile/
├── App.tsx                       # SafeArea + GestureHandler + Provider + Navigation + UnlockToast
├── app.json                      # Cấu hình Expo (tsconfigPaths experiment, plugins)
├── package.json                  # Dependencies
├── tsconfig.json                 # TS strict + alias @/ -> src/*
├── babel.config.js               # babel-preset-expo + reanimated
└── src/
    ├── components/               # Card, Button, Pill, ProgressBar, ScreenHeader, DifficultyChip,
    │                             # RecorderControls, ActivityHeatmap, UnlockToast
    ├── context/                  # ProgressContext (XP, streak, achievements, stickers, activity log, language)
    ├── data/                     # Nội dung tĩnh tiếng Việt + scenarioBuilder + stickers
    ├── hooks/                    # useRecorder, useRecordings, useCustomScenarios, useParentNotes
    ├── i18n/                     # strings.ts (vi/en) + useT
    ├── navigation/               # Bottom tabs + native stack
    ├── screens/                  # 11 màn hình (xem dưới)
    ├── theme/                    # colors / typography / spacing / radii
    ├── types/                    # ProgressState, Scenario, RecordingEntry, ParentNote, …
    └── utils/                    # storage, dates
```

### Danh sách màn hình

1. `HomeScreen` – Dashboard chính cho bé.
2. `PracticeListScreen` – Danh sách kịch bản (tích hợp custom scenarios).
3. `ScenarioScreen` – Đóng vai từng bước + RecorderControls.
4. `ScenarioBuilderScreen` – Tự tạo kịch bản theo template.
5. `StoriesScreen` – Danh sách truyện.
6. `StoryReadScreen` – Đọc truyện + TTS từng đoạn + RecorderControls.
7. `TongueTwistersScreen` – Trò chơi biến lưỡi.
8. `EmotionsScreen` – Thẻ cảm xúc.
9. `AchievementsScreen` – Huy hiệu (cũ).
10. `StickerCollectionScreen` – Bộ sưu tập sticker mở khóa theo cột mốc.
11. `ParentDashboardScreen` – Heatmap, thống kê, ghi chú phụ huynh.
12. `ProfileScreen` – Hồ sơ + đa ngôn ngữ.

## 🚀 Chạy thử

```bash
cd mobile
npm install
npx expo start
```

- Quét mã QR bằng **Expo Go** trên iOS/Android.
- Bấm `i` (iOS Simulator), `a` (Android Emulator), `w` (web).

> **Lưu ý quyền microphone**: Khi bé bấm "Bắt đầu ghi", ứng dụng yêu cầu quyền
> truy cập micro. Trên iOS, cần thêm `NSMicrophoneUsageDescription` trong
> `app.json` khi build production. Hiện trong dev mode, Expo Go đã yêu cầu quyền
> tự động.

> **Asset**: Project chưa có `assets/icon.png`, `assets/splash.png`,
> `assets/adaptive-icon.png`, `assets/favicon.png`. Bổ sung khi build production.

## 🧪 Kiểm tra type

```bash
npm run tsc
```

## 📌 Phụ thuộc chính

- `expo` ~51, `react-native` 0.74, `react` 18.2
- `@react-navigation/native` + `native-stack` + `bottom-tabs`
- `expo-av` (ghi âm), `expo-file-system` (lưu file ghi âm)
- `expo-speech` (đọc to tiếng Việt)
- `expo-haptics`, `expo-linear-gradient`, `expo-status-bar`
- `@react-native-async-storage/async-storage`
- `@expo/vector-icons` (Ionicons)

## 🗺️ Roadmap

### ✅ Đã hoàn thành
1. **Ghi âm & phát lại** – `useRecorder`, `RecorderControls`, lưu file qua
   `expo-file-system`, hiển thị danh sách bản ghi theo từng kịch bản/truyện.
2. **Bộ sưu tập sticker & phần thưởng** – 12 sticker theo cột mốc, modal
   `UnlockToast` chúc mừng khi mở khoá.
3. **Cá nhân hóa kịch bản (template-based)** – `ScenarioBuilderScreen` tạo
   hội thoại 7 bước theo cấu hình; lưu trong `useCustomScenarios`.
4. **Phụ huynh & nhật ký** – `ParentDashboardScreen` với heatmap 14 ngày,
   thống kê theo danh mục, CRUD ghi chú quan sát có mood.
5. **Đa ngôn ngữ UI (vi/en)** – `i18n/strings.ts` + `useT()`, persist trong
   `ProgressContext`.

### 🚧 Tiếp theo
6. **Tích hợp AI hội thoại** – dùng LLM (qua API có cấu hình key) để mở rộng
   kịch bản ngẫu hứng theo phản hồi của bé.
7. **Chế độ ngoại tuyến hoàn toàn** – đóng gói mọi asset (TTS audio cache),
   kiểm tra mọi luồng hoạt động khi airplane mode.
8. Speech-to-text để chấm điểm phát âm.
9. Đồng bộ đám mây tuỳ chọn (Firebase/Supabase) cho gia đình nhiều thiết bị.
10. Xuất ghi âm sang chia sẻ (share sheet).
