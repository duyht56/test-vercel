import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii } from '@/theme';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ value, max, color = colors.primary, height = 10 }: ProgressBarProps) {
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${ratio * 100}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.border,
    overflow: 'hidden',
    borderRadius: radii.pill,
  },
  fill: {
    height: '100%',
  },
});
