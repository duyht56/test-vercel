import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

export type RecorderStatus = 'idle' | 'recording' | 'stopped' | 'playing';

interface UseRecorderResult {
  status: RecorderStatus;
  durationMs: number;
  isPreparing: boolean;
  start: () => Promise<void>;
  stop: () => Promise<{ uri: string; durationMs: number } | null>;
  play: (uri: string) => Promise<void>;
  pause: () => Promise<void>;
  reset: () => void;
}

export function useRecorder(): UseRecorderResult {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      recordingRef.current?.stopAndUnloadAsync().catch(() => undefined);
      soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  const startTick = () => {
    startedAtRef.current = Date.now();
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setDurationMs(Date.now() - startedAtRef.current);
    }, 250);
  };

  const stopTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const start = useCallback(async () => {
    try {
      setIsPreparing(true);
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Cần quyền micro',
          'Hãy cho phép ứng dụng truy cập micro trong cài đặt thiết bị để bé có thể ghi âm.',
        );
        setIsPreparing(false);
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      setStatus('recording');
      setDurationMs(0);
      startTick();
    } catch (err) {
      console.warn('start record failed', err);
      Alert.alert('Lỗi', 'Không thể bắt đầu ghi âm. Vui lòng thử lại.');
    } finally {
      setIsPreparing(false);
    }
  }, []);

  const stop = useCallback(async (): Promise<{ uri: string; durationMs: number } | null> => {
    const rec = recordingRef.current;
    if (!rec) return null;
    stopTick();
    try {
      await rec.stopAndUnloadAsync();
      const tempUri = rec.getURI();
      recordingRef.current = null;
      const final = Date.now() - startedAtRef.current;
      setStatus('stopped');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      if (!tempUri) return null;
      const dir = (FileSystem.documentDirectory ?? '') + 'kid-talk-recordings/';
      try {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      } catch {
        // directory likely exists
      }
      const ext = Platform.OS === 'ios' ? 'caf' : 'm4a';
      const targetUri = `${dir}rec-${Date.now()}.${ext}`;
      try {
        await FileSystem.moveAsync({ from: tempUri, to: targetUri });
      } catch (err) {
        console.warn('moveAsync failed, falling back to original uri', err);
        return { uri: tempUri, durationMs: final };
      }
      return { uri: targetUri, durationMs: final };
    } catch (err) {
      console.warn('stop record failed', err);
      return null;
    }
  }, []);

  const play = useCallback(async (uri: string) => {
    try {
      await soundRef.current?.unloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
      soundRef.current = sound;
      setStatus('playing');
      sound.setOnPlaybackStatusUpdate((s) => {
        if ('didJustFinish' in s && s.didJustFinish) {
          setStatus('stopped');
        }
      });
    } catch (err) {
      console.warn('play failed', err);
      Alert.alert('Lỗi', 'Không phát được bản ghi này.');
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      await soundRef.current?.pauseAsync();
      setStatus('stopped');
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    stopTick();
    setStatus('idle');
    setDurationMs(0);
  }, []);

  return { status, durationMs, isPreparing, start, stop, play, pause, reset };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
