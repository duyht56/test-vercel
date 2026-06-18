export const colors = {
  primary: '#FF8A65',
  primaryDark: '#E76F51',
  secondary: '#5BC0EB',
  accent: '#FFD166',
  success: '#06D6A0',
  warning: '#F4A261',
  danger: '#EF476F',

  background: '#FFF8E7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  textPrimary: '#264653',
  textSecondary: '#5C6E7A',
  textMuted: '#9AA7B0',
  textOnPrimary: '#FFFFFF',

  border: '#F0E7D5',
  shadow: '#1F2A30',

  gradientWarm: ['#FFB199', '#FF8A65'] as const,
  gradientCool: ['#A1E3F9', '#5BC0EB'] as const,
  gradientSun: ['#FFE29A', '#FFD166'] as const,
  gradientMint: ['#9CE6C8', '#06D6A0'] as const,
  gradientPink: ['#FFB6C1', '#EF476F'] as const,
};

export type AppColors = typeof colors;
