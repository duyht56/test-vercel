import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { achievements } from '@/data/achievements';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';
import { Achievement } from '@/types';

export function AchievementsScreen() {
  const { state } = useProgress();

  const valueFor = (a: Achievement) => {
    switch (a.type) {
      case 'scenarios':
        return state.completedScenarios.length;
      case 'stories':
        return state.completedStories.length;
      case 'twisters':
        return state.completedTwisters.length;
      case 'streak':
        return state.streak;
      case 'xp':
        return state.xp;
    }
  };

  const unlocked = achievements.filter((a) => state.unlockedAchievements.includes(a.id));
  const locked = achievements.filter((a) => !state.unlockedAchievements.includes(a.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="🏆"
        title="Bộ sưu tập của bé"
        subtitle={`Đã mở khóa ${unlocked.length}/${achievements.length} huy hiệu.`}
      />

      {unlocked.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Đã mở khóa</Text>
          {unlocked.map((a) => (
            <Card key={a.id} style={[styles.row, { borderColor: colors.success, borderWidth: 2 }]}>
              <Text style={styles.emoji}>{a.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.desc}>{a.description}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Sắp đạt được</Text>
      {locked.map((a) => {
        const value = valueFor(a);
        return (
          <Card key={a.id} style={styles.row}>
            <Text style={[styles.emoji, styles.emojiLocked]}>{a.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{a.title}</Text>
              <Text style={styles.desc}>{a.description}</Text>
              <View style={{ marginTop: spacing.sm }}>
                <ProgressBar value={value} max={a.threshold} color={colors.accent} />
                <Text style={styles.progressText}>
                  {Math.min(value, a.threshold)} / {a.threshold}
                </Text>
              </View>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.md },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radii.lg },
  emoji: { fontSize: 40 },
  emojiLocked: { opacity: 0.4 },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  progressText: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
});
