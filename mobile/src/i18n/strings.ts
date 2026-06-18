export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    'tab.home': 'Trang chính',
    'tab.practice': 'Hội thoại',
    'tab.stories': 'Truyện',
    'tab.profile': 'Bé',
    'stack.practice': 'Luyện hội thoại',
    'stack.scenario': 'Đóng vai',
    'stack.builder': 'Tự tạo kịch bản',
    'stack.stories': 'Đọc truyện',
    'stack.story': 'Truyện hay',
    'stack.twisters': 'Biến lưỡi',
    'stack.emotions': 'Cảm xúc',
    'stack.achievements': 'Huy hiệu',
    'stack.stickers': 'Sticker',
    'stack.parent': 'Góc của ba mẹ',

    'home.greeting': 'Xin chào, {name}! 👋',
    'home.subgreeting': 'Hôm nay mình cùng tự tin nói nhé!',
    'home.streakUnit': 'ngày',
    'home.xpTitle': 'Kho sao của bé',
    'home.xpGoal': 'Mục tiêu: {target}',
    'home.dailyKicker': 'Thử thách hôm nay',
    'home.featureTitle': 'Hôm nay con muốn luyện gì?',
    'home.feature.practice': 'Luyện hội thoại',
    'home.feature.practice.sub': 'Đóng vai các tình huống đời thường',
    'home.feature.stories': 'Đọc truyện',
    'home.feature.stories.sub': 'Đọc to và trả lời câu hỏi',
    'home.feature.twisters': 'Biến lưỡi',
    'home.feature.twisters.sub': 'Trò chơi phát âm vui nhộn',
    'home.feature.emotions': 'Thẻ cảm xúc',
    'home.feature.emotions.sub': 'Gọi tên điều con đang cảm thấy',
    'home.progressTitle': 'Tiến độ của bé',
    'home.statScenarios': 'hội thoại',
    'home.statStories': 'truyện',
    'home.statTwisters': 'biến lưỡi',
    'home.openShelf': 'Mở bộ sưu tập sticker',
    'home.openAchievements': 'Xem thành tích của bé',
    'home.openParent': 'Mở góc ba mẹ',

    'profile.title': 'Hồ sơ của bé',
    'profile.subtitle': 'Cá nhân hóa hành trình của con.',
    'profile.nameLabel': 'Tên gọi thân thương',
    'profile.namePlaceholder': 'VD: Bin, Bống, Su…',
    'profile.save': 'Lưu tên',
    'profile.saved': 'Đã lưu! 🎉',
    'profile.tipsTitle': 'Lời khuyên cho bố mẹ',
    'profile.tipsBody':
      'Hãy ngồi cạnh bé trong vài lần đầu. Khen ngợi từng nỗ lực, dù bé chỉ nói được một câu ngắn. Sự cổ vũ của bố mẹ là nguồn năng lượng quan trọng nhất giúp bé tự tin hơn mỗi ngày.',
    'profile.languageLabel': 'Ngôn ngữ giao diện',
    'profile.languageNote':
      'Nội dung học (kịch bản, truyện, biến lưỡi) vẫn bằng tiếng Việt để bé luyện đúng.',
    'profile.advanced': 'Cài đặt nâng cao',
    'profile.reset': 'Đặt lại tiến độ',
    'profile.resetTitle': 'Đặt lại tiến độ?',
    'profile.resetMessage': 'Tất cả XP, huy hiệu và lịch sử sẽ bị xóa.',
    'common.cancel': 'Hủy',
    'common.confirmReset': 'Đặt lại',
  },
  en: {
    'tab.home': 'Home',
    'tab.practice': 'Practice',
    'tab.stories': 'Stories',
    'tab.profile': 'Me',
    'stack.practice': 'Practice talks',
    'stack.scenario': 'Role-play',
    'stack.builder': 'Build a scene',
    'stack.stories': 'Stories',
    'stack.story': 'Read together',
    'stack.twisters': 'Tongue twisters',
    'stack.emotions': 'Emotions',
    'stack.achievements': 'Badges',
    'stack.stickers': 'Stickers',
    'stack.parent': "Parents' corner",

    'home.greeting': 'Hi, {name}! 👋',
    'home.subgreeting': "Let's speak with confidence today!",
    'home.streakUnit': 'days',
    'home.xpTitle': 'Star bank',
    'home.xpGoal': 'Goal: {target}',
    'home.dailyKicker': "Today's challenge",
    'home.featureTitle': 'What would you like to practice?',
    'home.feature.practice': 'Practice talks',
    'home.feature.practice.sub': 'Role-play everyday situations',
    'home.feature.stories': 'Read stories',
    'home.feature.stories.sub': 'Read aloud and answer questions',
    'home.feature.twisters': 'Tongue twisters',
    'home.feature.twisters.sub': 'Fun pronunciation game',
    'home.feature.emotions': 'Emotion cards',
    'home.feature.emotions.sub': 'Name what you are feeling',
    'home.progressTitle': 'Your progress',
    'home.statScenarios': 'talks',
    'home.statStories': 'stories',
    'home.statTwisters': 'twisters',
    'home.openShelf': 'Open sticker collection',
    'home.openAchievements': 'See achievements',
    'home.openParent': "Open parents' corner",

    'profile.title': 'My profile',
    'profile.subtitle': 'Personalize your journey.',
    'profile.nameLabel': 'Friendly name',
    'profile.namePlaceholder': 'E.g. Sam, Mia, Leo…',
    'profile.save': 'Save name',
    'profile.saved': 'Saved! 🎉',
    'profile.tipsTitle': 'Tips for parents',
    'profile.tipsBody':
      'Sit with your child the first few times. Celebrate every attempt, even short ones. Your encouragement is the most powerful confidence booster.',
    'profile.languageLabel': 'Interface language',
    'profile.languageNote':
      'Learning content (scenarios, stories, twisters) stays in Vietnamese so kids practice with correct material.',
    'profile.advanced': 'Advanced',
    'profile.reset': 'Reset progress',
    'profile.resetTitle': 'Reset progress?',
    'profile.resetMessage': 'All XP, badges and history will be cleared.',
    'common.cancel': 'Cancel',
    'common.confirmReset': 'Reset',
  },
} as const;

export type StringKey = keyof (typeof translations)['vi'];

export function translate(lang: Language, key: StringKey, vars?: Record<string, string | number>) {
  const dict = translations[lang] ?? translations.vi;
  let value: string = (dict as Record<string, string>)[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}
