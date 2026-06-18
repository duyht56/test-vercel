import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Pill } from '@/components/Pill';
import { colors, radii, spacing, typography } from '@/theme';
import { useProgress } from '@/context/ProgressContext';
import { dailyChallenges } from '@/data/dailyChallenges';
import { pickOfTheDay } from '@/utils/dates';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const features = [
  {
    key: 'practice',
    title: 'Luyện hội thoại',
    subtitle: 'Đóng vai các tình huống đời thường',
    emoji: '💬',
    gradient: colors.gradientWarm,
    target: 'Practice' as const,
  },
  {
    key: 'stories',
    title: 'Đọc truyện',
    subtitle: 'Đọc to và trả lời câu hỏi',
    emoji: '📖',
    gradient: colors.gradientCool,
    target: 'Stories' as const,
  },
  {
    key: 'twisters',
    title: 'Biến lưỡi',
    subtitle: 'Trò chơi phát âm vui nhộn',
    emoji: '🌀',
    gradient: colors.gradientSun,
    target: 'TongueTwisters' as const,
  },
  {
    key: 'emotions',
    title: 'Thẻ cảm xúc',
    subtitle: 'Gọi tên điều con đang cảm thấy',
    emoji: '💖',
    gradient: colors.gradientPink,
    target: 'Emotions' as const,
  },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useProgress();
  const challenge = useMemo(() => pickOfTheDay(dailyChallenges), []);
  const nextLevelXp = Math.ceil((state.xp + 1) / 100) * 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Xin chào, {state.childName}! 👋</Text>
          <Text style={styles.subgreeting}>Hôm nay mình cùng tự tin nói nhé!</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakValue}>{state.streak}</Text>
          <Text style={styles.streakLabel}>ngày</Text>
        </View>
      </View>

      <Card style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <View>
            <Text style={typography.subtitle as any}>Kho sao của bé</Text>
            <Text style={styles.xpValue}>{state.xp} XP</Text>
          </View>
          <Pill label={`Mục tiêu: ${nextLevelXp}`} color={colors.accent} />
        </View>
        <View style={{ marginTop: spacing.md }}>
          <ProgressBar value={state.xp % 100} max={100} color={colors.primary} />
        </View>
      </Card>

      <LinearGradient
        colors={colors.gradientMint as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.challengeCard}
      >
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.challengeKicker}>Thử thách hôm nay</Text>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
          </View>
          <Pill label={`+${challenge.xp} XP`} color="rgba(255,255,255,0.85)" />
        </View>
        <Text style={styles.challengeDesc}>{challenge.description}</Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Hôm nay con muốn luyện gì?</Text>

      <View style={styles.featureGrid}>
        {features.map((f) => (
          <FeatureTile
            key={f.key}
            title={f.title}
            subtitle={f.subtitle}
            emoji={f.emoji}
            gradient={f.gradient}
            onPress={() => navigation.navigate(f.target as any)}
          />
        ))}
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={typography.subtitle as any}>Tiến độ của bé</Text>
        <View style={styles.statsRow}>
          <Stat emoji="💬" value={state.completedScenarios.length} label="hội thoại" />
          <Stat emoji="📖" value={state.completedStories.length} label="truyện" />
          <Stat emoji="🌀" value={state.completedTwisters.length} label="biến lưỡi" />
        </View>
        <Button
          label="Xem thành tích của bé"
          variant="ghost"
          onPress={() => navigation.navigate('Achievements' as any)}
          icon={<Ionicons name="trophy" size={18} color={colors.primary} />}
          style={{ marginTop: spacing.md }}
        />
      </Card>
    </ScrollView>
  );
}

function FeatureTile({
  title,
  subtitle,
  emoji,
  gradient,
  onPress,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  gradient: readonly [string, string];
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={styles.tile}>
      <LinearGradient
        colors={gradient as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tileEmojiBox}
      >
        <Text style={styles.tileEmoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </Card>
  );
}

function Stat({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { ...typography.title, color: colors.textPrimary },
  subgreeting: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  streakBadge: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minWidth: 64,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  streakEmoji: { fontSize: 22 },
  streakValue: { ...typography.subtitle, color: colors.textPrimary },
  streakLabel: { ...typography.caption, color: colors.textMuted },
  xpCard: { marginBottom: spacing.lg },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpValue: { ...typography.display, color: colors.primary, marginTop: 4 },
  challengeCard: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  challengeHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  challengeEmoji: { fontSize: 36 },
  challengeKicker: { ...typography.micro, color: '#0F3D2E' },
  challengeTitle: { ...typography.subtitle, color: '#0F3D2E', marginTop: 2 },
  challengeDesc: {
    ...typography.body,
    color: '#0F3D2E',
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: '48%', flexGrow: 1 },
  tileEmojiBox: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  tileEmoji: { fontSize: 30 },
  tileTitle: { ...typography.bodyBold, color: colors.textPrimary },
  tileSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  stat: { alignItems: 'center', flex: 1 },
  statEmoji: { fontSize: 24 },
  statValue: { ...typography.subtitle, color: colors.textPrimary, marginTop: 2 },
  statLabel: { ...typography.caption, color: colors.textMuted },
});
