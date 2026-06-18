import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/context/ProgressContext';
import { useParentNotes } from '@/hooks/useParentNotes';
import { NoteMood } from '@/types/notes';
import { scenarios } from '@/data/scenarios';
import { stories } from '@/data/stories';
import { tongueTwisters } from '@/data/tongueTwisters';
import { colors, radii, spacing, typography } from '@/theme';

const moodOptions: Array<{ key: NoteMood; emoji: string; label: string; color: string }> = [
  { key: 'happy', emoji: '😄', label: 'Tiến bộ', color: colors.success },
  { key: 'neutral', emoji: '🙂', label: 'Bình thường', color: colors.accent },
  { key: 'tough', emoji: '😟', label: 'Khó khăn', color: colors.danger },
];

export function ParentDashboardScreen() {
  const { state } = useProgress();
  const { items: notes, add, remove } = useParentNotes();
  const [text, setText] = useState('');
  const [mood, setMood] = useState<NoteMood>('happy');

  const submit = async () => {
    const note = await add(text, mood);
    if (note) setText('');
  };

  const totalSessions = Object.values(state.activityLog).reduce((sum, v) => sum + v, 0);
  const activeDays = Object.keys(state.activityLog).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="🧑‍👧"
        title="Góc của ba mẹ"
        subtitle="Theo dõi tiến độ và ghi lại quan sát hằng ngày của con."
      />

      <Card>
        <Text style={styles.sectionTitle}>Tổng quan tuần này</Text>
        <View style={styles.statsRow}>
          <Stat label="Streak" value={`${state.streak} ngày`} emoji="🔥" />
          <Stat label="XP đã đạt" value={state.xp} emoji="⭐" />
          <Stat label="Tổng phiên" value={totalSessions} emoji="🎯" />
          <Stat label="Ngày hoạt động" value={activeDays} emoji="📅" />
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Hoạt động 14 ngày gần nhất</Text>
        <ActivityHeatmap log={state.activityLog} days={14} />
        <Text style={styles.helper}>
          Mỗi ô là một ngày. Màu càng đậm nghĩa là ngày đó bé luyện càng nhiều lần.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Tiến độ theo nội dung</Text>
        <CategoryProgress
          emoji="💬"
          label="Hội thoại"
          value={state.completedScenarios.length}
          total={scenarios.length}
        />
        <CategoryProgress
          emoji="📖"
          label="Truyện"
          value={state.completedStories.length}
          total={stories.length}
        />
        <CategoryProgress
          emoji="🌀"
          label="Biến lưỡi"
          value={state.completedTwisters.length}
          total={tongueTwisters.length}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Ghi chú quan sát</Text>
        <Text style={styles.helper}>
          Ghi lại những điều con vừa làm tốt hoặc còn ngại ngùng – sau vài tuần ba mẹ sẽ thấy hành
          trình rõ rệt.
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="VD: Hôm nay con tự tin chào hàng xóm khi đi học về."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={400}
          style={styles.input}
        />
        <View style={styles.moodRow}>
          {moodOptions.map((m) => (
            <Button
              key={m.key}
              label={`${m.emoji} ${m.label}`}
              variant={mood === m.key ? 'primary' : 'ghost'}
              onPress={() => setMood(m.key)}
              style={styles.moodBtn}
            />
          ))}
        </View>
        <Button
          label="Lưu ghi chú"
          onPress={submit}
          disabled={!text.trim()}
          icon={<Ionicons name="save" size={18} color={colors.textOnPrimary} />}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      {notes.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Nhật ký gần đây</Text>
          {notes.map((n) => {
            const moodMeta = moodOptions.find((m) => m.key === n.mood) ?? moodOptions[1];
            return (
              <View key={n.id} style={styles.noteRow}>
                <Text style={styles.noteEmoji}>{moodMeta.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteText}>{n.text}</Text>
                  <View style={styles.noteMetaRow}>
                    <Pill
                      label={moodMeta.label}
                      color={moodMeta.color}
                      textColor={colors.textOnPrimary}
                    />
                    <Text style={styles.noteDate}>{formatRelative(n.createdAt)}</Text>
                  </View>
                </View>
                <Button
                  label="Xóa"
                  variant="ghost"
                  onPress={() => remove(n.id)}
                  style={styles.deleteBtn}
                />
              </View>
            );
          })}
        </Card>
      )}
    </ScrollView>
  );
}

function Stat({ emoji, value, label }: { emoji: string; value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CategoryProgress({
  emoji,
  label,
  value,
  total,
}: {
  emoji: string;
  label: string;
  value: number;
  total: number;
}) {
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryLabel}>
          {emoji} {label}
        </Text>
        <Text style={styles.categoryValue}>
          {value}/{total}
        </Text>
      </View>
      <ProgressBar value={value} max={total || 1} color={colors.success} />
    </View>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (sameDay) return `Hôm nay · ${time}`;
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} · ${time}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  sectionTitle: { ...typography.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  helper: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stat: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  statEmoji: { fontSize: 24 },
  statValue: { ...typography.subtitle, color: colors.textPrimary, marginTop: 2 },
  statLabel: { ...typography.caption, color: colors.textMuted },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 80,
    marginTop: spacing.md,
    textAlignVertical: 'top',
  },
  moodRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  moodBtn: { flexGrow: 1, paddingHorizontal: spacing.md },
  categoryRow: { marginBottom: spacing.md },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryLabel: { ...typography.bodyBold, color: colors.textPrimary },
  categoryValue: { ...typography.body, color: colors.textSecondary },
  noteRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  noteEmoji: { fontSize: 28 },
  noteText: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  noteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  noteDate: { ...typography.caption, color: colors.textMuted },
  deleteBtn: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
});
