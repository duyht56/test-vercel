import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface PillProps {
  label: string;
  color?: string;
  textColor?: string;
}

export function Pill({ label, color = colors.accent, textColor = colors.textPrimary }: PillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
  },
});
