import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { DifficultyChip } from '@/components/DifficultyChip';
import { ScreenHeader } from '@/components/ScreenHeader';
import { tongueTwisters } from '@/data/tongueTwisters';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';

export function TongueTwistersScreen() {
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(0.8);
  const { markTwister, state } = useProgress();
  const item = tongueTwisters[index];
  const done = state.completedTwisters.includes(item.id);

  const speak = () => {
    Speech.stop();
    Speech.speak(item.text, { language: 'vi-VN', rate });
  };

  const onComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    await markTwister(item.id);
  };

  const onNext = () => setIndex((i) => (i + 1) % tongueTwisters.length);
  const onPrev = () => setIndex((i) => (i - 1 + tongueTwisters.length) % tongueTwisters.length);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="🌀"
        title="Trò chơi biến lưỡi"
        subtitle="Đọc thật rõ và thật chuẩn nhé!"
      />

      <Card style={styles.bigCard}>
        <View style={styles.metaRow}>
          <DifficultyChip value={item.difficulty} />
          <Pill label={`${index + 1}/${tongueTwisters.length}`} color={colors.border} />
        </View>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </Card>

      <View style={styles.speedRow}>
        <Text style={styles.speedLabel}>Tốc độ đọc:</Text>
        {[
          { label: '🐢 Chậm', value: 0.6 },
          { label: '🐇 Vừa', value: 0.85 },
          { label: '🚀 Nhanh', value: 1.1 },
        ].map((opt) => {
          const active = rate === opt.value;
          return (
            <Pill
              key={opt.value}
              label={opt.label}
              color={active ? colors.primary : colors.border}
              textColor={active ? colors.textOnPrimary : colors.textPrimary}
            />
          );
        })}
      </View>
      <View style={styles.speedButtons}>
        {[0.6, 0.85, 1.1].map((r) => (
          <Button
            key={r}
            label={r === 0.6 ? 'Chậm' : r === 0.85 ? 'Vừa' : 'Nhanh'}
            variant={rate === r ? 'primary' : 'ghost'}
            onPress={() => setRate(r)}
            style={styles.speedButton}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label="Nghe mẫu"
          variant="secondary"
          icon={<Ionicons name="volume-high" size={18} color={colors.textOnPrimary} />}
          onPress={speak}
        />
        <Button
          label={done ? 'Đã làm xong!' : 'Mình đọc được rồi!'}
          variant="success"
          icon={<Ionicons name="checkmark" size={18} color={colors.textOnPrimary} />}
          onPress={onComplete}
          disabled={done}
        />
      </View>

      <View style={styles.nav}>
        <Button label="Câu trước" variant="ghost" onPress={onPrev} />
        <Button label="Câu tiếp theo" variant="ghost" onPress={onNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  bigCard: {
    backgroundColor: '#FFFBEA',
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  text: { ...typography.title, color: colors.textPrimary, textAlign: 'center', lineHeight: 32 },
  meaning: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.md },
  speedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
  speedLabel: { ...typography.caption, color: colors.textSecondary },
  speedButtons: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  speedButton: { flex: 1, paddingHorizontal: 0 },
  actions: { gap: spacing.md, marginTop: spacing.md },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
});
