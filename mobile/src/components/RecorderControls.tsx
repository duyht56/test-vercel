import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { Card } from './Card';
import { Pill } from './Pill';
import { formatDuration, useRecorder } from '@/hooks/useRecorder';
import { useRecordings } from '@/hooks/useRecordings';
import { RecordingScope, RecordingEntry } from '@/types/recording';
import { colors, radii, spacing, typography } from '@/theme';

interface Props {
  scope: RecordingScope;
  refId: string;
  label?: string;
  emptyHint?: string;
}

export function RecorderControls({ scope, refId, label, emptyHint }: Props) {
  const recorder = useRecorder();
  const { items, add, remove } = useRecordings({ scope, refId });

  const handleStart = async () => {
    await recorder.start();
  };

  const handleStop = async () => {
    const result = await recorder.stop();
    if (result?.uri) {
      await add({ scope, refId, uri: result.uri, durationMs: result.durationMs, label });
      recorder.reset();
    }
  };

  const handlePlay = async (entry: RecordingEntry) => {
    if (recorder.status === 'playing') {
      await recorder.pause();
      return;
    }
    await recorder.play(entry.uri);
  };

  const handleDelete = (entry: RecordingEntry) => {
    Alert.alert('Xóa bản ghi?', 'Bản ghi này sẽ bị xóa vĩnh viễn.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => remove(entry.id) },
    ]);
  };

  const isRecording = recorder.status === 'recording';
  const liveDuration = formatDuration(recorder.durationMs);

  return (
    <Card style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="mic" size={20} color={colors.primary} />
          <Text style={styles.title}>Ghi âm giọng bé</Text>
        </View>
        {isRecording ? (
          <Pill label={`● ${liveDuration}`} color={colors.danger} textColor={colors.textOnPrimary} />
        ) : (
          <Pill label={`${items.length} bản`} color={colors.border} />
        )}
      </View>

      <Text style={styles.hint}>
        {emptyHint ?? 'Đọc to câu vừa luyện và ghi âm để nghe lại nha! Bé sẽ tự tin hơn theo từng lần.'}
      </Text>

      <View style={styles.actionsRow}>
        {isRecording ? (
          <Button
            label="Dừng và lưu"
            variant="success"
            icon={<Ionicons name="stop" size={18} color={colors.textOnPrimary} />}
            onPress={handleStop}
          />
        ) : (
          <Button
            label={recorder.isPreparing ? 'Đang chuẩn bị…' : 'Bắt đầu ghi'}
            variant="primary"
            disabled={recorder.isPreparing}
            icon={<Ionicons name="mic" size={18} color={colors.textOnPrimary} />}
            onPress={handleStart}
          />
        )}
      </View>

      {items.length > 0 && (
        <View style={styles.list}>
          <Text style={styles.listLabel}>Bản ghi của bé</Text>
          {items.map((entry) => (
            <View key={entry.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{formatRelative(entry.createdAt)}</Text>
                <Text style={styles.rowSub}>
                  {formatDuration(entry.durationMs)} · {entry.label ?? 'Bản ghi tự do'}
                </Text>
              </View>
              <Button
                label="Phát"
                variant="ghost"
                icon={
                  <Ionicons
                    name={recorder.status === 'playing' ? 'pause' : 'play'}
                    size={16}
                    color={colors.primary}
                  />
                }
                onPress={() => handlePlay(entry)}
                style={styles.smallBtn}
              />
              <Button
                label="Xóa"
                variant="ghost"
                icon={<Ionicons name="trash" size={16} color={colors.primary} />}
                onPress={() => handleDelete(entry)}
                style={styles.smallBtn}
              />
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (sameDay) return `Hôm nay, ${time}`;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm} · ${time}`;
}

const styles = StyleSheet.create({
  container: {},
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.subtitle, color: colors.textPrimary },
  hint: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  list: { marginTop: spacing.lg, gap: spacing.sm },
  listLabel: { ...typography.micro, color: colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  rowTitle: { ...typography.bodyBold, color: colors.textPrimary },
  rowSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  smallBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
