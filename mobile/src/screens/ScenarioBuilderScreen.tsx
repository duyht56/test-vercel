import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { Difficulty, Scenario } from '@/types';
import {
  isAiBackendConfigured,
  requestAiScenario,
} from '@/services/aiClient';
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

  const [aiScenario, setAiScenario] = useState<Scenario | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiAvailable = isAiBackendConfigured();

  useEffect(() => {
    setAiScenario(null);
    setAiError(null);
  }, [partner, setting, goal, catchphrase, difficulty, ageRange]);

  const localPreview = useMemo(
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

  const preview = aiScenario ?? localPreview;
  const usingAi = aiScenario !== null;

  const handleSave = async () => {
    await add(preview);
    navigation.navigate('Scenario', { scenarioId: preview.id });
  };

  const handleAi = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await requestAiScenario({
        childName: state.childName,
        partner,
        setting,
        goal,
        catchphrase,
        difficulty,
        ageRange,
      });
      if (result.ok) {
        setAiScenario(result.scenario);
      } else {
        setAiError(result.error);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetAi = () => {
    setAiScenario(null);
    setAiError(null);
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

      <Card style={styles.aiCard}>
        <View style={styles.aiHeaderRow}>
          <Ionicons name="sparkles" size={20} color={colors.secondary} />
          <Text style={styles.aiTitle}>Trợ lý AI</Text>
          <Pill
            label={usingAi ? 'Đang dùng AI' : 'Tạo nhanh'}
            color={usingAi ? colors.success : colors.border}
            textColor={usingAi ? colors.textOnPrimary : colors.textPrimary}
          />
        </View>
        <Text style={styles.aiBody}>
          AI sẽ mở rộng các lựa chọn của bé thành một kịch bản tự nhiên, sinh động hơn. Yêu cầu được
          gửi qua backend an toàn — API key chỉ ở server, không bao giờ ở app này.
        </Text>
        {!aiAvailable ? (
          <Text style={styles.aiNote}>
            Backend chưa được cấu hình. Hãy đặt biến <Text style={styles.code}>EXPO_PUBLIC_API_BASE_URL</Text>{' '}
            (URL của Next.js backend có <Text style={styles.code}>GEMINI_API_KEY</Text>) trong file{' '}
            <Text style={styles.code}>mobile/.env</Text> và khởi động lại Expo.
          </Text>
        ) : null}
        {aiError ? (
          <View style={styles.aiErrorBox}>
            <Ionicons name="warning" size={16} color={colors.danger} />
            <Text style={styles.aiErrorText}>{aiError}</Text>
          </View>
        ) : null}
        <View style={styles.aiActions}>
          <Button
            label={
              aiLoading
                ? 'Đang tạo…'
                : usingAi
                  ? 'Tạo lại bằng AI'
                  : 'Mở rộng bằng AI'
            }
            variant="secondary"
            disabled={!aiAvailable || aiLoading}
            onPress={handleAi}
            icon={
              aiLoading ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <Ionicons name="sparkles" size={18} color={colors.textOnPrimary} />
              )
            }
          />
          {usingAi ? (
            <Button
              label="Quay về kịch bản gốc"
              variant="ghost"
              onPress={handleResetAi}
              icon={<Ionicons name="refresh" size={18} color={colors.primary} />}
            />
          ) : null}
        </View>
      </Card>

      <Card style={styles.preview}>
        <View style={styles.previewLabelRow}>
          <Text style={styles.previewLabel}>Xem trước kịch bản</Text>
          {usingAi ? (
            <Pill label="✨ Bản AI" color={colors.secondary} textColor={colors.textOnPrimary} />
          ) : null}
        </View>
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
  previewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  previewLabel: { ...typography.micro, color: colors.textMuted },
  aiCard: { borderWidth: 2, borderColor: colors.secondary, gap: spacing.sm },
  aiHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  aiTitle: { ...typography.subtitle, color: colors.textPrimary, flex: 1 },
  aiBody: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  aiNote: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radii.md,
    lineHeight: 18,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#FFF1E6',
    color: colors.primary,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  aiErrorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FCE5EC',
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  aiErrorText: { ...typography.caption, color: colors.danger, flex: 1 },
  aiActions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.xs },
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
