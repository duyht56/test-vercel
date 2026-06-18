import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { todayKey } from '@/utils/dates';

interface Props {
  log: Record<string, number>;
  days?: number;
}

export function ActivityHeatmap({ log, days = 14 }: Props) {
  const today = new Date();
  const cells: { key: string; count: number; label: string }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = todayKey(d);
    cells.push({
      key,
      count: log[key] ?? 0,
      label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
    });
  }

  const max = Math.max(1, ...cells.map((c) => c.count));

  const intensity = (count: number) => {
    if (count === 0) return colors.border;
    const ratio = count / max;
    if (ratio < 0.34) return '#FFD9C5';
    if (ratio < 0.67) return '#FFB199';
    return colors.primary;
  };

  return (
    <View>
      <View style={styles.row}>
        {cells.map((c) => (
          <View key={c.key} style={styles.cellBox}>
            <View style={[styles.cell, { backgroundColor: intensity(c.count) }]} />
            <Text style={styles.label}>{c.label.slice(0, 2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Ít</Text>
        <View style={[styles.legendCell, { backgroundColor: colors.border }]} />
        <View style={[styles.legendCell, { backgroundColor: '#FFD9C5' }]} />
        <View style={[styles.legendCell, { backgroundColor: '#FFB199' }]} />
        <View style={[styles.legendCell, { backgroundColor: colors.primary }]} />
        <Text style={styles.legendText}>Nhiều</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  cellBox: { alignItems: 'center', flex: 1 },
  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.sm,
    minHeight: 18,
  },
  label: { ...typography.micro, color: colors.textMuted, marginTop: 4, fontSize: 9 },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: spacing.sm,
  },
  legendText: { ...typography.caption, color: colors.textMuted },
  legendCell: { width: 14, height: 14, borderRadius: 4 },
});
