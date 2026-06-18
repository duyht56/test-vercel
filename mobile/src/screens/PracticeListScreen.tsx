import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { DifficultyChip } from '@/components/DifficultyChip';
import { ScreenHeader } from '@/components/ScreenHeader';
import { scenarios } from '@/data/scenarios';
import { useProgress } from '@/context/ProgressContext';
import { colors, spacing, typography } from '@/theme';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PracticeListScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useProgress();

  return (
    <View style={styles.container}>
      <ScreenHeader
        emoji="💬"
        title="Luyện hội thoại"
        subtitle="Chọn một tình huống và cùng đóng vai nha!"
      />
      <FlatList
        data={scenarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => {
          const done = state.completedScenarios.includes(item.id);
          return (
            <Card onPress={() => navigation.navigate('Scenario', { scenarioId: item.id })}>
              <View style={styles.row}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {done && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    )}
                  </View>
                  <Text style={styles.desc}>{item.description}</Text>
                  <View style={styles.metaRow}>
                    <DifficultyChip value={item.difficulty} />
                    <Pill label={`${item.estimatedMinutes} phút`} color={colors.border} />
                    <Pill label={`Tuổi ${item.ageRange}`} color={colors.border} />
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
});
