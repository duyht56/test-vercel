import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProgressProvider } from '@/context/ProgressContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { UnlockToast } from '@/components/UnlockToast';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProgressProvider>
          <StatusBar style="dark" />
          <RootNavigator />
          <UnlockToast />
        </ProgressProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
