import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DifficultyChip } from '@/components/DifficultyChip';
import {
  buildScenario,
  goalOptions,
  partnerOptions,
  settingOptions,
} from '@/data/scenarioBuilder';
import { useCustomScenarios } from '@/hooks/useCustomScenarios';
import { useProgress } from '@/context/ProgressContext';
import { Difficulty } from '@/types';
import { colors, radii, spacing, typography } from '@/theme';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ageOptions = ['5-7', '6-9', '7-10', '8-12'];
const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

export function ScenarioBuilderScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useProgress();
  const { items, add, remove } = useCustomScenarios();

  const [partner, setPartner] = useState(partnerOptions[0]);
  const [setting, setSetting] = useState(settingOptions[0]);
  const [goal, setGoal] = useState(goalOptions[0]);
  const [catchphrase, setCatchphrase] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [ageRange, setAgeRange] = useState(ageOptions[0]);

  const preview = useMemo(
    () =>
      buildScenario({
        childName: state.childName,
        partner,
        setting,
        goal,
        catchphrase,
        difficulty,
        ageRange,
      }),
    [state.childName, partner, setting, goal, catchphrase, difficulty, ageRange],
  );

  const handleSave = async () => {
    await add(preview);
    navigation.navigate('Scenario', { scenarioId: preview.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        emoji="🛠️"
        title="Tự tạo kịch bản riêng"
        subtitle="Chọn tình huống – Bé mình nói chuyện với ai, ở đâu, mục tiêu gì?"
      />

      <Section title="Người đối diện" emoji="👥">
        <ChipPicker options={partnerOptions} value={partner} onChange={setPartner} />
      </Section>

      <Section title="Bối cảnh" emoji="📍">
        <ChipPicker options={settingOptions} value={setting} onChange={setSetting} />
      </Section>

      <Section title="Mục tiêu giao tiếp" emoji="🎯">
        <ChipPicker options={goalOptions} value={goal} onChange={setGoal} />
      </Section>

      <Section title="Câu nói bé muốn luyện" emoji="🗣️">
        <TextInput
          style={styles.input}
          placeholder='VD: "Mình có thể chơi cùng bạn không?"'
          placeholderTextColor={colors.textMuted}
          value={catchphrase}
          onChangeText={setCatchphrase}
          maxLength={120}
          multiline
        />
      </Section>

      <Section title="Độ khó" emoji="🎚️">
        <View style={styles.row}>
          {difficultyOptions.map((d) => (
            <Button
              key={d}
              label={d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Thử thách'}
              variant={difficulty === d ? 'primary' : 'ghost'}
              onPress={() => setDifficulty(d)}
              style={styles.pickerBtn}
            />
          ))}
        </View>
      </Section>

      <Section title="Độ tuổi phù hợp" emoji="🧒">
        <View style={styles.row}>
          {ageOptions.map((a) => (
            <Button
              key={a}
              label={`Tuổi ${a}`}
              variant={ageRange === a ? 'primary' : 'ghost'}
              onPress={() => setAgeRange(a)}
              style={styles.pickerBtn}
            />
          ))}
        </View>
      </Section>

      <Card style={styles.preview}>
        <Text style={styles.previewLabel}>Xem trước kịch bản</Text>
        <View style={styles.previewHeader}>
          <Text style={styles.previewEmoji}>{preview.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>{preview.title}</Text>
            <Text style={styles.previewDesc}>{preview.description}</Text>
            <View style={styles.previewMeta}>
              <DifficultyChip value={preview.difficulty} />
              <Pill label={`${preview.estimatedMinutes} phút`} color={colors.border} />
              <Pill label={`Tuổi ${preview.ageRange}`} color={colors.border} />
            </View>
          </View>
        </View>
        <View style={styles.previewSteps}>
          {preview.steps.slice(0, 3).map((s, idx) => (
            <Text key={idx} style={styles.previewStep}>
              <Text style={styles.previewSpeaker}>
                {s.speaker === 'me' ? 'Bé: ' : s.speaker === 'partner' ? 'Đối phương: ' : ''}
              </Text>
              {s.text}
            </Text>
          ))}
          <Text style={styles.previewMore}>… và {preview.steps.length - 3} bước nữa</Text>
        </View>
      </Card>

      <Button
        label="Lưu và bắt đầu luyện"
        onPress={handleSave}
        icon={<Ionicons name="play" size={18} color={colors.textOnPrimary} />}
      />

      {items.length > 0 && (
        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>Kịch bản đã tạo</Text>
          {items.map((item) => (
            <Card key={item.id} style={styles.savedCard}>
              <Text style={styles.savedName}>
                {item.emoji} {item.title}
              </Text>
              <Text style={styles.savedDesc}>{item.description}</Text>
              <View style={styles.savedActions}>
                <Button
                  label="Mở"
                  variant="ghost"
                  onPress={() => navigation.navigate('Scenario', { scenarioId: item.id })}
                  style={styles.smallBtn}
                />
                <Button
                  label="Xóa"
                  variant="ghost"
                  onPress={() => remove(item.id)}
                  style={styles.smallBtn}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function Section({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {emoji} {title}
      </Text>
      {children}
    </View>
  );
}

function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => (
        <Button
          key={opt}
          label={opt}
          variant={opt === value ? 'primary' : 'ghost'}
          onPress={() => onChange(opt)}
          style={styles.chipBtn}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.subtitle, color: colors.textPrimary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chipBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  pickerBtn: { flexGrow: 1, minWidth: 90, paddingHorizontal: spacing.md },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  preview: { borderWidth: 2, borderColor: colors.primary },
  previewLabel: { ...typography.micro, color: colors.textMuted, marginBottom: spacing.sm },
  previewHeader: { flexDirection: 'row', gap: spacing.md },
  previewEmoji: { fontSize: 36 },
  previewTitle: { ...typography.subtitle, color: colors.textPrimary },
  previewDesc: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  previewMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  previewSteps: { marginTop: spacing.md, gap: spacing.sm },
  previewStep: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  previewSpeaker: { fontWeight: '700', color: colors.primary },
  previewMore: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  savedSection: { marginTop: spacing.xl, gap: spacing.sm },
  savedTitle: { ...typography.subtitle, color: colors.textPrimary, marginBottom: spacing.xs },
  savedCard: { gap: spacing.xs },
  savedName: { ...typography.bodyBold, color: colors.textPrimary },
  savedDesc: { ...typography.body, color: colors.textSecondary },
  savedActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  smallBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
