import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProgress } from '@/context/ProgressContext';
import { colors, radii, spacing, typography } from '@/theme';

export function ProfileScreen() {
  const { state, setChildName, resetProgress } = useProgress();
  const [name, setName] = useState(state.childName);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await setChildName(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      'Đặt lại tiến độ?',
      'Tất cả XP, huy hiệu và lịch sử sẽ bị xóa.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đặt lại', style: 'destructive', onPress: () => resetProgress() },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader emoji="🧒" title="Hồ sơ của bé" subtitle="Cá nhân hóa hành trình của con." />

      <Card>
        <Text style={styles.label}>Tên gọi thân thương</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="VD: Bin, Bống, Su…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          maxLength={24}
        />
        <Button
          label={saved ? 'Đã lưu! 🎉' : 'Lưu tên'}
          onPress={handleSave}
          icon={<Ionicons name="save" size={18} color={colors.textOnPrimary} />}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Lời khuyên cho bố mẹ</Text>
        <Text style={styles.cardBody}>
          Hãy ngồi cạnh bé trong vài lần đầu. Khen ngợi từng nỗ lực, dù bé chỉ nói được một câu
          ngắn. Sự cổ vũ của bố mẹ là nguồn năng lượng quan trọng nhất giúp bé tự tin hơn mỗi ngày.
        </Text>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Cài đặt nâng cao</Text>
        <Button
          label="Đặt lại tiến độ"
          variant="ghost"
          onPress={handleReset}
          icon={<Ionicons name="refresh" size={18} color={colors.primary} />}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <View style={{ height: spacing.xl }} />
      <Text style={styles.version}>KidTalk · v0.1.0 · Bản dùng thử</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  label: { ...typography.micro, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  cardTitle: { ...typography.subtitle, color: colors.textPrimary, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textSecondary },
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
