import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { stories } from '@/data/stories';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function StoryReadScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'StoryRead'>>();
  const navigation = useNavigation<Nav>();
  const { markStory, state } = useProgress();
  const story = useMemo(
    () => stories.find((s) => s.id === route.params.storyId),
    [route.params.storyId],
  );
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);

  if (!story) {
    return (
      <View style={styles.center}>
        <Text style={typography.body as any}>Không tìm thấy truyện.</Text>
      </View>
    );
  }

  const speakAll = () => {
    Speech.stop();
    Speech.speak(story.paragraphs.join(' '), { language: 'vi-VN', rate: 0.9 });
  };

  const speakOne = (text: string, idx: number) => {
    Speech.stop();
    setActiveParagraph(idx);
    Speech.speak(text, {
      language: 'vi-VN',
      rate: 0.9,
      onDone: () => setActiveParagraph(null),
      onStopped: () => setActiveParagraph(null),
    });
  };

  const finish = async () => {
    await markStory(story.id);
    navigation.goBack();
  };

  const done = state.completedStories.includes(story.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>{story.emoji}</Text>
      <Text style={styles.title}>{story.title}</Text>
      <Text style={styles.desc}>{story.description}</Text>
      <View style={styles.metaRow}>
        <Pill label={`${story.estimatedMinutes} phút`} color={colors.border} />
        <Pill label={`Tuổi ${story.ageRange}`} color={colors.border} />
      </View>

      <View style={{ marginVertical: spacing.lg }}>
        <Button
          label="Nghe đọc cả truyện"
          onPress={speakAll}
          icon={<Ionicons name="play-circle" size={20} color={colors.textOnPrimary} />}
        />
      </View>

      {story.paragraphs.map((p, idx) => (
        <Card
          key={idx}
          style={[styles.paragraphCard, activeParagraph === idx && styles.paragraphActive]}
          onPress={() => speakOne(p, idx)}
        >
          <View style={styles.paragraphRow}>
            <Text style={styles.paragraphText}>{p}</Text>
            <Ionicons
              name={activeParagraph === idx ? 'volume-high' : 'volume-medium-outline'}
              size={22}
              color={activeParagraph === idx ? colors.primary : colors.textMuted}
            />
          </View>
        </Card>
      ))}

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.sectionLabel}>Câu hỏi cùng bé suy nghĩ</Text>
        {story.questions.map((q, idx) => (
          <View key={idx} style={styles.question}>
            <Text style={styles.questionIdx}>{idx + 1}</Text>
            <Text style={styles.questionText}>{q}</Text>
          </View>
        ))}
      </Card>

      <View style={{ height: spacing.xl }} />
      <Button
        label={done ? 'Đã hoàn thành 🎉' : 'Bé đọc xong rồi!'}
        variant="success"
        onPress={finish}
        disabled={done}
        icon={<Ionicons name="checkmark" size={20} color={colors.textOnPrimary} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 44 },
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.xs },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  paragraphCard: { marginBottom: spacing.md, borderWidth: 2, borderColor: 'transparent', borderRadius: radii.lg },
  paragraphActive: { borderColor: colors.primary, backgroundColor: '#FFF1E6' },
  paragraphRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  paragraphText: { ...typography.body, color: colors.textPrimary, flex: 1, lineHeight: 24 },
  sectionLabel: { ...typography.micro, color: colors.textMuted, marginBottom: spacing.sm },
  question: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', marginVertical: spacing.xs },
  questionIdx: {
    ...typography.bodyBold,
    color: colors.textOnPrimary,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  questionText: { ...typography.body, color: colors.textPrimary, flex: 1 },
});
