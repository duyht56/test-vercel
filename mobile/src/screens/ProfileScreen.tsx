import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProgress } from '@/context/ProgressContext';
import { useT } from '@/i18n/useT';
import { colors, radii, spacing, typography } from '@/theme';

export function ProfileScreen() {
  const { state, setChildName, setLanguage, resetProgress } = useProgress();
  const { t, lang } = useT();
  const [name, setName] = useState(state.childName);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await setChildName(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(t('profile.resetTitle'), t('profile.resetMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirmReset'), style: 'destructive', onPress: () => resetProgress() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader emoji="🧒" title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <Card>
        <Text style={styles.label}>{t('profile.nameLabel')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('profile.namePlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          maxLength={24}
        />
        <Button
          label={saved ? t('profile.saved') : t('profile.save')}
          onPress={handleSave}
          icon={<Ionicons name="save" size={18} color={colors.textOnPrimary} />}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.label}>{t('profile.languageLabel')}</Text>
        <View style={styles.langRow}>
          <Button
            label="🇻🇳 Tiếng Việt"
            variant={lang === 'vi' ? 'primary' : 'ghost'}
            onPress={() => setLanguage('vi')}
            style={styles.langBtn}
          />
          <Button
            label="🇬🇧 English"
            variant={lang === 'en' ? 'primary' : 'ghost'}
            onPress={() => setLanguage('en')}
            style={styles.langBtn}
          />
        </View>
        <Text style={styles.note}>{t('profile.languageNote')}</Text>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>{t('profile.tipsTitle')}</Text>
        <Text style={styles.cardBody}>{t('profile.tipsBody')}</Text>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>{t('profile.advanced')}</Text>
        <Button
          label={t('profile.reset')}
          variant="ghost"
          onPress={handleReset}
          icon={<Ionicons name="refresh" size={18} color={colors.primary} />}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <View style={{ height: spacing.xl }} />
      <Text style={styles.version}>KidTalk · v0.2.0 · Bản dùng thử</Text>
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
  langRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  langBtn: { flex: 1, paddingHorizontal: 0 },
  note: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  cardTitle: { ...typography.subtitle, color: colors.textPrimary, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textSecondary },
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
