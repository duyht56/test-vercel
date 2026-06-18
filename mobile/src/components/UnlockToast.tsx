import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { useProgress } from '@/context/ProgressContext';
import { stickers } from '@/data/stickers';
import { achievements } from '@/data/achievements';
import { colors, radii, spacing, typography } from '@/theme';

interface UnlockEntry {
  kind: 'sticker' | 'achievement';
  emoji: string;
  title: string;
  description: string;
}

function resolve(token: string): UnlockEntry | null {
  const [kind, id] = token.split(':');
  if (kind === 'sticker') {
    const s = stickers.find((it) => it.id === id);
    if (!s) return null;
    return { kind: 'sticker', emoji: s.emoji, title: s.name, description: s.description };
  }
  if (kind === 'achievement') {
    const a = achievements.find((it) => it.id === id);
    if (!a) return null;
    return { kind: 'achievement', emoji: a.emoji, title: a.title, description: a.description };
  }
  return null;
}

export function UnlockToast() {
  const { state, consumeRecentUnlocks } = useProgress();
  const [queue, setQueue] = useState<UnlockEntry[]>([]);
  const [active, setActive] = useState<UnlockEntry | null>(null);

  useEffect(() => {
    if (state.recentlyUnlocked.length === 0) return;
    (async () => {
      const tokens = await consumeRecentUnlocks();
      const items = tokens.map(resolve).filter((x): x is UnlockEntry => x !== null);
      if (items.length > 0) setQueue((q) => [...q, ...items]);
    })();
  }, [state.recentlyUnlocked, consumeRecentUnlocks]);

  useEffect(() => {
    if (!active && queue.length > 0) {
      setActive(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [active, queue]);

  if (!active) return null;

  const close = () => setActive(null);

  return (
    <Modal transparent animationType="fade" visible onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={
              active.kind === 'sticker' ? colors.gradientPink : colors.gradientSun
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.kickerRow}>
              <Ionicons
                name={active.kind === 'sticker' ? 'sparkles' : 'trophy'}
                size={18}
                color="#3D2C1A"
              />
              <Text style={styles.kicker}>
                {active.kind === 'sticker' ? 'Sticker mới!' : 'Huy hiệu mới!'}
              </Text>
            </View>
            <Text style={styles.emoji}>{active.emoji}</Text>
            <Text style={styles.title}>{active.title}</Text>
            <Text style={styles.desc}>{active.description}</Text>
            <Button label="Tuyệt vời!" onPress={close} style={{ marginTop: spacing.lg }} />
          </LinearGradient>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 45, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardWrap: { width: '100%', maxWidth: 340 },
  card: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  kicker: { ...typography.micro, color: '#3D2C1A' },
  emoji: { fontSize: 80, marginVertical: spacing.md },
  title: { ...typography.title, color: '#3D2C1A', textAlign: 'center' },
  desc: {
    ...typography.body,
    color: '#3D2C1A',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
