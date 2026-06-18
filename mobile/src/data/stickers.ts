import { Achievement } from '@/types';

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlock: {
    type: Achievement['type'];
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic';
}

export const stickers: Sticker[] = [
  {
    id: 'sticker-mic',
    name: 'Micro vàng',
    emoji: '🎤',
    description: 'Hoàn thành 1 kịch bản đầu tiên.',
    unlock: { type: 'scenarios', threshold: 1 },
    rarity: 'common',
  },
  {
    id: 'sticker-star',
    name: 'Ngôi sao nhỏ',
    emoji: '⭐',
    description: 'Đạt 50 XP – bước khởi đầu vững vàng!',
    unlock: { type: 'xp', threshold: 50 },
    rarity: 'common',
  },
  {
    id: 'sticker-rocket',
    name: 'Tên lửa khởi động',
    emoji: '🚀',
    description: 'Đạt 150 XP – tăng tốc nào!',
    unlock: { type: 'xp', threshold: 150 },
    rarity: 'rare',
  },
  {
    id: 'sticker-rainbow',
    name: 'Cầu vồng tự tin',
    emoji: '🌈',
    description: 'Đạt 300 XP – muôn màu sắc tự tin.',
    unlock: { type: 'xp', threshold: 300 },
    rarity: 'rare',
  },
  {
    id: 'sticker-crown',
    name: 'Vương miện kể chuyện',
    emoji: '👑',
    description: 'Đọc xong 3 truyện.',
    unlock: { type: 'stories', threshold: 3 },
    rarity: 'rare',
  },
  {
    id: 'sticker-trophy',
    name: 'Cúp vàng',
    emoji: '🏆',
    description: 'Hoàn thành 5 kịch bản giao tiếp.',
    unlock: { type: 'scenarios', threshold: 5 },
    rarity: 'epic',
  },
  {
    id: 'sticker-fire',
    name: 'Lửa bền bỉ',
    emoji: '🔥',
    description: 'Luyện tập 3 ngày liên tiếp.',
    unlock: { type: 'streak', threshold: 3 },
    rarity: 'common',
  },
  {
    id: 'sticker-diamond',
    name: 'Kim cương 7 ngày',
    emoji: '💎',
    description: 'Luyện tập 7 ngày liên tiếp.',
    unlock: { type: 'streak', threshold: 7 },
    rarity: 'epic',
  },
  {
    id: 'sticker-heart',
    name: 'Trái tim ấm áp',
    emoji: '❤️',
    description: 'Hoàn thành 5 câu biến lưỡi.',
    unlock: { type: 'twisters', threshold: 5 },
    rarity: 'rare',
  },
  {
    id: 'sticker-magic',
    name: 'Phép thuật ngôn từ',
    emoji: '✨',
    description: 'Đạt 500 XP – ma thuật giao tiếp!',
    unlock: { type: 'xp', threshold: 500 },
    rarity: 'epic',
  },
  {
    id: 'sticker-medal',
    name: 'Huân chương vàng',
    emoji: '🥇',
    description: 'Hoàn thành 10 kịch bản.',
    unlock: { type: 'scenarios', threshold: 10 },
    rarity: 'epic',
  },
  {
    id: 'sticker-balloon',
    name: 'Bóng bay vui vẻ',
    emoji: '🎈',
    description: 'Đạt 100 XP – đầu tiên đáng nhớ!',
    unlock: { type: 'xp', threshold: 100 },
    rarity: 'common',
  },
];
