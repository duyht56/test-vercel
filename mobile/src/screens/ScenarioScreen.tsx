import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Pill } from '@/components/Pill';
import { DifficultyChip } from '@/components/DifficultyChip';
import { scenarios } from '@/data/scenarios';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ScenarioScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Scenario'>>();
  const navigation = useNavigation<Nav>();
  const { markScenario } = useProgress();
  const scenario = useMemo(
    () => scenarios.find((s) => s.id === route.params.scenarioId),
    [route.params.scenarioId],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!scenario) {
    return (
      <View style={styles.center}>
        <Text style={typography.body as any}>Không tìm thấy kịch bản.</Text>
      </View>
    );
  }

  const step = scenario.steps[stepIndex];
  const isLast = stepIndex === scenario.steps.length - 1;

  const handleNext = async () => {
    Haptics.selectionAsync().catch(() => undefined);
    if (isLast) {
      await markScenario(scenario.id);
      setCompleted(true);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSpeak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'vi-VN', rate: 0.9 });
  };

  if (completed) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Tuyệt vời!</Text>
        <Text style={styles.completedText}>
          Con đã hoàn thành kịch bản “{scenario.title}”. Cố gắng luyện tập với người thân thật ngoài
          đời nha!
        </Text>
        <View style={{ height: spacing.lg }} />
        <Button label="Chọn kịch bản khác" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{scenario.emoji}</Text>
        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.desc}>{scenario.description}</Text>
        <View style={styles.metaRow}>
          <DifficultyChip value={scenario.difficulty} />
          <Pill label={`${scenario.estimatedMinutes} phút`} color={colors.border} />
          <Pill label={`Tuổi ${scenario.ageRange}`} color={colors.border} />
        </View>
      </View>

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={styles.sectionLabel}>Mục tiêu</Text>
        {scenario.goals.map((g, idx) => (
          <View key={idx} style={styles.goalItem}>
            <Ionicons name="star" color={colors.accent} size={18} />
            <Text style={styles.goalText}>{g}</Text>
          </View>
        ))}
      </Card>

      <View style={{ marginBottom: spacing.lg }}>
        <ProgressBar value={stepIndex + 1} max={scenario.steps.length} />
        <Text style={styles.progressText}>
          Bước {stepIndex + 1} / {scenario.steps.length}
        </Text>
      </View>

      <Card style={[styles.stepCard, getBubbleStyle(step.speaker)]}>
        <Text style={styles.speakerLabel}>{getSpeakerLabel(step.speaker)}</Text>
        <Text style={styles.stepText}>{step.text}</Text>
        {step.hint ? (
          <View style={styles.hintBox}>
            <Ionicons name="bulb" size={16} color={colors.warning} />
            <Text style={styles.hintText}>{step.hint}</Text>
          </View>
        ) : null}
        <View style={styles.actionsRow}>
          <Button
            label="Nghe đọc"
            variant="ghost"
            icon={<Ionicons name="volume-high" size={18} color={colors.primary} />}
            onPress={() => handleSpeak(step.text)}
          />
          <Button
            label={isLast ? 'Hoàn thành' : 'Tiếp theo'}
            variant="primary"
            icon={
              <Ionicons
                name={isLast ? 'checkmark' : 'arrow-forward'}
                size={18}
                color={colors.textOnPrimary}
              />
            }
            onPress={handleNext}
          />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.sectionLabel}>Mẹo nhỏ cho bé</Text>
        {scenario.tips.map((t, idx) => (
          <View key={idx} style={styles.goalItem}>
            <Text style={styles.tipDot}>•</Text>
            <Text style={styles.goalText}>{t}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function getSpeakerLabel(speaker: 'partner' | 'me' | 'narrator'): string {
  switch (speaker) {
    case 'me':
      return 'Bé nói';
    case 'partner':
      return 'Người đối diện nói';
    default:
      return 'Tình huống';
  }
}

function getBubbleStyle(speaker: 'partner' | 'me' | 'narrator') {
  switch (speaker) {
    case 'me':
      return { backgroundColor: '#FFF1E6', borderColor: colors.primary };
    case 'partner':
      return { backgroundColor: '#E6F4FB', borderColor: colors.secondary };
    default:
      return { backgroundColor: '#FFFBEA', borderColor: colors.accent };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: spacing.lg },
  emoji: { fontSize: 44 },
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.xs },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  sectionLabel: { ...typography.micro, color: colors.textMuted, marginBottom: spacing.sm },
  goalItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  goalText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  tipDot: { color: colors.primary, fontSize: 18, lineHeight: 22 },
  progressText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  stepCard: { borderWidth: 2, borderRadius: radii.lg },
  speakerLabel: { ...typography.micro, color: colors.textMuted, marginBottom: spacing.xs },
  stepText: { ...typography.subtitle, color: colors.textPrimary, lineHeight: 26 },
  hintBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFF6E0',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hintText: { ...typography.body, color: colors.textSecondary, flex: 1 },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  completedEmoji: { fontSize: 64 },
  completedTitle: { ...typography.display, color: colors.primary, marginTop: spacing.md },
  completedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
