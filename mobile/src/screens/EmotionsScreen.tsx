import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { emotions } from '@/data/emotions';
import { EmotionCard } from '@/types';
import { colors, radii, spacing, typography } from '@/theme';

export function EmotionsScreen() {
  const [active, setActive] = useState<EmotionCard | null>(null);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'vi-VN', rate: 0.9 });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="💖"
        title="Hôm nay bé cảm thấy thế nào?"
        subtitle="Chọn một thẻ cảm xúc để tập gọi tên cảm xúc của mình."
      />

      <View style={styles.grid}>
        {emotions.map((e) => (
          <Card
            key={e.id}
            onPress={() => setActive(e)}
            style={[
              styles.card,
              {
                backgroundColor: e.color + '33',
                borderColor: active?.id === e.id ? e.color : 'transparent',
              },
            ]}
          >
            <Text style={styles.emoji}>{e.emoji}</Text>
            <Text style={styles.name}>{e.name}</Text>
          </Card>
        ))}
      </View>

      {active ? (
        <Card style={[styles.detail, { borderColor: active.color }]}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailEmoji}>{active.emoji}</Text>
            <Text style={styles.detailName}>{active.name}</Text>
          </View>
          <Text style={styles.detailLabel}>Câu ví dụ</Text>
          <Text style={styles.detailExample}>{active.exampleSentence}</Text>
          <Text style={styles.detailLabel}>Bé cùng tập</Text>
          <Text style={styles.detailPrompt}>{active.practicePrompt}</Text>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Nghe câu ví dụ"
              variant="secondary"
              icon={<Ionicons name="volume-high" size={18} color={colors.textOnPrimary} />}
              onPress={() => speak(active.exampleSentence)}
            />
          </View>
        </Card>
      ) : (
        <Text style={styles.placeholder}>Chạm vào một thẻ cảm xúc để xem ví dụ.</Text>
      )}
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
    paddingVertical: spacing.lg,
    borderWidth: 2,
  },
  emoji: { fontSize: 40 },
  name: { ...typography.bodyBold, color: colors.textPrimary, marginTop: spacing.xs },
  detail: { marginTop: spacing.xl, borderWidth: 2, borderRadius: radii.lg },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  detailEmoji: { fontSize: 40 },
  detailName: { ...typography.title, color: colors.textPrimary },
  detailLabel: { ...typography.micro, color: colors.textMuted, marginTop: spacing.sm },
  detailExample: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs, lineHeight: 24 },
  detailPrompt: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, fontStyle: 'italic' },
  placeholder: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
