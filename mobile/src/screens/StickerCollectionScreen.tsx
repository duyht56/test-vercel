import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { stickers, Sticker } from '@/data/stickers';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';

const rarityColor: Record<Sticker['rarity'], string> = {
  common: colors.success,
  rare: colors.secondary,
  epic: colors.danger,
};

const rarityLabel: Record<Sticker['rarity'], string> = {
  common: 'Thường',
  rare: 'Hiếm',
  epic: 'Đặc biệt',
};

export function StickerCollectionScreen() {
  const { state } = useProgress();
  const unlockedSet = new Set(state.unlockedStickers);

  const value = (s: Sticker) => {
    switch (s.unlock.type) {
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
      default:
        return 0;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="🪄"
        title="Bộ sưu tập sticker"
        subtitle={`Đã sưu tầm ${unlockedSet.size}/${stickers.length} chiếc sticker.`}
      />

      <View style={styles.grid}>
        {stickers.map((s) => {
          const unlocked = unlockedSet.has(s.id);
          const v = value(s);
          return (
            <Card key={s.id} style={[styles.card, unlocked && { borderColor: rarityColor[s.rarity] }]}>
              <View style={styles.rarityRow}>
                <Pill
                  label={rarityLabel[s.rarity]}
                  color={rarityColor[s.rarity]}
                  textColor={colors.textOnPrimary}
                />
              </View>
              <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>
                {unlocked ? s.emoji : '❔'}
              </Text>
              <Text style={styles.name}>{unlocked ? s.name : '???'}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {s.description}
              </Text>
              {!unlocked && (
                <View style={styles.progressWrap}>
                  <ProgressBar
                    value={v}
                    max={s.unlock.threshold}
                    color={rarityColor[s.rarity]}
                    height={6}
                  />
                  <Text style={styles.progressText}>
                    {Math.min(v, s.unlock.threshold)} / {s.unlock.threshold}
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radii.lg,
  },
  rarityRow: { alignSelf: 'flex-start' },
  emoji: { fontSize: 56, marginVertical: spacing.sm },
  emojiLocked: { opacity: 0.35 },
  name: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
  desc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    minHeight: 32,
  },
  progressWrap: { width: '100%', marginTop: spacing.sm },
  progressText: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'right' },
});
