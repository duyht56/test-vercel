import { ConversationLine, Difficulty, Scenario } from '@/types';

export interface BuilderInput {
  childName: string;
  partner: string;
  setting: string;
  goal: string;
  catchphrase: string;
  difficulty: Difficulty;
  ageRange: string;
}

export const partnerOptions = [
  'một người bạn mới',
  'cô giáo',
  'ông bà',
  'em nhỏ hơn',
  'người bán hàng',
  'bác sĩ',
  'người lớn xa lạ',
];

export const settingOptions = [
  'sân chơi của trường',
  'lớp học',
  'siêu thị',
  'công viên',
  'bàn ăn cùng gia đình',
  'tiệc sinh nhật của bạn',
  'phòng khám',
];

export const goalOptions = [
  'làm quen và hỏi tên bạn',
  'mời bạn cùng tham gia',
  'nhờ giúp đỡ một việc nhỏ',
  'cảm ơn ai đó vì đã tốt với mình',
  'thể hiện cảm xúc khi vui hoặc buồn',
  'mượn hoặc trả đồ vật',
  'nói lời xin lỗi và làm hòa',
];

export function buildScenario(input: BuilderInput): Scenario {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const child = input.childName?.trim() || 'Bé';
  const opener = pickOpener(input.goal);
  const followUp = pickFollowUp(input.goal);
  const closing = pickClosing(input.goal);

  const steps: ConversationLine[] = [
    {
      speaker: 'narrator',
      text: `${child} đang ở ${input.setting} và muốn ${input.goal} với ${input.partner}.`,
    },
    {
      speaker: 'me',
      text: opener.replace('{partner}', input.partner),
      hint: 'Hít thở thật sâu, mỉm cười và nhìn vào người đối diện trước khi bắt đầu.',
    },
    {
      speaker: 'partner',
      text: `Ồ, chào ${child}! Bạn cần gì vậy?`,
    },
    {
      speaker: 'me',
      text: followUp.replace('{goal}', input.goal),
      hint: input.catchphrase
        ? `Nhớ dùng câu yêu thích của con: "${input.catchphrase}"`
        : 'Nói chậm, rõ và đủ thông tin để người ta hiểu.',
    },
    {
      speaker: 'partner',
      text: 'Cảm ơn con đã nói rõ ràng. Cô/chú/bạn sẵn lòng giúp con.',
    },
    {
      speaker: 'me',
      text: closing,
      hint: 'Nói cảm ơn thật chân thành nha.',
    },
    {
      speaker: 'narrator',
      text: `${child} mỉm cười và cảm thấy tự tin hơn rất nhiều!`,
    },
  ];

  return {
    id,
    title: capitalize(input.goal),
    emoji: '🛠️',
    description: `Tình huống tự tạo: tại ${input.setting}, cùng ${input.partner}.`,
    difficulty: input.difficulty,
    ageRange: input.ageRange,
    estimatedMinutes: input.difficulty === 'hard' ? 6 : input.difficulty === 'medium' ? 4 : 3,
    goals: [
      `Tự tin ${input.goal}`,
      'Lắng nghe và phản hồi đầy đủ',
      input.catchphrase
        ? `Sử dụng được câu: "${input.catchphrase}"`
        : 'Nói câu đầy đủ chủ ngữ – vị ngữ',
    ],
    steps,
    tips: [
      'Đọc trước nội dung 1 lần để làm quen.',
      'Nếu thấy hồi hộp, hít sâu 3 nhịp – mọi chuyện sẽ trở nên dễ dàng hơn.',
      'Sau khi luyện xong, thử áp dụng với người thân trong gia đình nhé!',
    ],
  };
}

function pickOpener(goal: string): string {
  if (goal.includes('xin lỗi')) {
    return 'Mình muốn nói chuyện một chút với {partner}, mình có chuyện cần xin lỗi…';
  }
  if (goal.includes('cảm ơn')) {
    return 'Chào {partner}! Mình có một điều rất muốn nói với bạn/cô/chú.';
  }
  if (goal.includes('mời')) {
    return 'Chào {partner}, mình có ý tưởng muốn chia sẻ với bạn.';
  }
  if (goal.includes('mượn') || goal.includes('trả')) {
    return 'Chào {partner}, mình có một việc nho nhỏ muốn nhờ.';
  }
  return 'Xin chào {partner}! Mình có thể trò chuyện với bạn/cô/chú một chút không?';
}

function pickFollowUp(goal: string): string {
  if (goal.includes('xin lỗi')) {
    return 'Mình rất tiếc vì việc vừa rồi. Lần sau mình sẽ cẩn thận hơn để không lặp lại.';
  }
  if (goal.includes('cảm ơn')) {
    return 'Mình muốn cảm ơn rất nhiều, vì điều đó khiến mình cảm thấy được quan tâm và tôn trọng.';
  }
  if (goal.includes('mời')) {
    return 'Mình muốn rủ bạn cùng tham gia, vì sẽ vui hơn nếu có bạn cùng làm.';
  }
  if (goal.includes('mượn')) {
    return 'Mình muốn mượn một vật trong chốc lát thôi và sẽ trả lại nguyên vẹn.';
  }
  if (goal.includes('trả')) {
    return 'Đây là đồ mình mượn hôm trước. Mình xin được gửi lại và cảm ơn rất nhiều.';
  }
  if (goal.includes('giúp')) {
    return 'Mình đang gặp một việc nhỏ, không biết bạn/cô/chú có thể giúp không ạ?';
  }
  return 'Mình muốn {goal} – mình sẽ cố gắng nói rõ ràng nhất có thể.';
}

function pickClosing(goal: string): string {
  if (goal.includes('xin lỗi')) {
    return 'Cảm ơn vì đã lắng nghe và tha lỗi cho mình.';
  }
  if (goal.includes('mời')) {
    return 'Tuyệt quá! Hẹn gặp bạn ở đó nha. Cảm ơn bạn đã đồng ý!';
  }
  return 'Mình cảm ơn rất nhiều ạ. Chúc một ngày vui vẻ!';
}

function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}
