import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { Button } from '@/components/Button';
import { DifficultyChip } from '@/components/DifficultyChip';
import { ScreenHeader } from '@/components/ScreenHeader';
import { scenarios } from '@/data/scenarios';
import { useCustomScenarios } from '@/hooks/useCustomScenarios';
import { useProgress } from '@/context/ProgressContext';
import { Scenario } from '@/types';
import { colors, spacing, typography } from '@/theme';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PracticeListScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useProgress();
  const { items: customScenarios } = useCustomScenarios();

  type Item =
    | { type: 'header' }
    | { type: 'scenario'; scenario: Scenario; custom: boolean };

  const data = useMemo<Item[]>(
    () => [
      { type: 'header' },
      ...customScenarios.map((scenario) => ({
        type: 'scenario' as const,
        scenario,
        custom: true,
      })),
      ...scenarios.map((scenario) => ({
        type: 'scenario' as const,
        scenario,
        custom: false,
      })),
    ],
    [customScenarios],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        emoji="💬"
        title="Luyện hội thoại"
        subtitle="Chọn một tình huống hoặc tự tạo kịch bản riêng cho bé."
      />
      <FlatList
        data={data}
        keyExtractor={(item, idx) =>
          item.type === 'header' ? `header-${idx}` : `${item.scenario.id}-${idx}`
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <Card style={styles.builderCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.builderTitle}>Tự tạo kịch bản 🛠️</Text>
                  <Text style={styles.builderDesc}>
                    Mô tả tình huống thật của bé – ứng dụng sẽ tạo lời thoại gợi ý ngay lập tức.
                  </Text>
                </View>
                <Button
                  label="Tạo ngay"
                  onPress={() => navigation.navigate('ScenarioBuilder')}
                  icon={<Ionicons name="add" size={18} color={colors.textOnPrimary} />}
                  style={{ marginTop: spacing.md }}
                />
              </Card>
            );
          }
          const { scenario, custom } = item;
          const done = state.completedScenarios.includes(scenario.id);
          return (
            <Card onPress={() => navigation.navigate('Scenario', { scenarioId: scenario.id })}>
              <View style={styles.row}>
                <Text style={styles.emoji}>{scenario.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{scenario.title}</Text>
                    {done && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                  </View>
                  <Text style={styles.desc}>{scenario.description}</Text>
                  <View style={styles.metaRow}>
                    {custom && <Pill label="Tự tạo" color={colors.accent} />}
                    <DifficultyChip value={scenario.difficulty} />
                    <Pill label={`${scenario.estimatedMinutes} phút`} color={colors.border} />
                    <Pill label={`Tuổi ${scenario.ageRange}`} color={colors.border} />
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl, paddingTop: 0 },
  row: { flexDirection: 'row', gap: spacing.md },
  emoji: { fontSize: 36 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.subtitle, color: colors.textPrimary, flexShrink: 1 },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  builderCard: {
    backgroundColor: '#FFF1E6',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  builderTitle: { ...typography.subtitle, color: colors.textPrimary },
  builderDesc: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
});
