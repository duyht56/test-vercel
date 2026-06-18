import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@/screens/HomeScreen';
import { PracticeListScreen } from '@/screens/PracticeListScreen';
import { ScenarioScreen } from '@/screens/ScenarioScreen';
import { StoriesScreen } from '@/screens/StoriesScreen';
import { StoryReadScreen } from '@/screens/StoryReadScreen';
import { TongueTwistersScreen } from '@/screens/TongueTwistersScreen';
import { EmotionsScreen } from '@/screens/EmotionsScreen';
import { AchievementsScreen } from '@/screens/AchievementsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { colors } from '@/theme';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            PracticeTab: 'chatbubbles',
            StoriesTab: 'book',
            Profile: 'person',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chính' }} />
      <Tabs.Screen
        name="PracticeTab"
        component={PracticeListScreen}
        options={{ title: 'Hội thoại' }}
      />
      <Tabs.Screen name="StoriesTab" component={StoriesScreen} options={{ title: 'Truyện' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Bé' }} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Practice" component={PracticeListScreen} options={{ title: 'Luyện hội thoại' }} />
        <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ title: 'Đóng vai' }} />
        <Stack.Screen name="Stories" component={StoriesScreen} options={{ title: 'Đọc truyện' }} />
        <Stack.Screen name="StoryRead" component={StoryReadScreen} options={{ title: 'Truyện hay' }} />
        <Stack.Screen name="TongueTwisters" component={TongueTwistersScreen} options={{ title: 'Biến lưỡi' }} />
        <Stack.Screen name="Emotions" component={EmotionsScreen} options={{ title: 'Cảm xúc' }} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Huy hiệu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
