import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@/screens/HomeScreen';
import { PracticeListScreen } from '@/screens/PracticeListScreen';
import { ScenarioScreen } from '@/screens/ScenarioScreen';
import { ScenarioBuilderScreen } from '@/screens/ScenarioBuilderScreen';
import { StoriesScreen } from '@/screens/StoriesScreen';
import { StoryReadScreen } from '@/screens/StoryReadScreen';
import { TongueTwistersScreen } from '@/screens/TongueTwistersScreen';
import { EmotionsScreen } from '@/screens/EmotionsScreen';
import { AchievementsScreen } from '@/screens/AchievementsScreen';
import { StickerCollectionScreen } from '@/screens/StickerCollectionScreen';
import { ParentDashboardScreen } from '@/screens/ParentDashboardScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { colors } from '@/theme';
import { useT } from '@/i18n/useT';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function HomeTabs() {
  const { t } = useT();
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
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: t('tab.home') }} />
      <Tabs.Screen
        name="PracticeTab"
        component={PracticeListScreen}
        options={{ title: t('tab.practice') }}
      />
      <Tabs.Screen
        name="StoriesTab"
        component={StoriesScreen}
        options={{ title: t('tab.stories') }}
      />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: t('tab.profile') }} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { t } = useT();
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
        <Stack.Screen
          name="Practice"
          component={PracticeListScreen}
          options={{ title: t('stack.practice') }}
        />
        <Stack.Screen
          name="Scenario"
          component={ScenarioScreen}
          options={{ title: t('stack.scenario') }}
        />
        <Stack.Screen
          name="ScenarioBuilder"
          component={ScenarioBuilderScreen}
          options={{ title: t('stack.builder') }}
        />
        <Stack.Screen
          name="Stories"
          component={StoriesScreen}
          options={{ title: t('stack.stories') }}
        />
        <Stack.Screen
          name="StoryRead"
          component={StoryReadScreen}
          options={{ title: t('stack.story') }}
        />
        <Stack.Screen
          name="TongueTwisters"
          component={TongueTwistersScreen}
          options={{ title: t('stack.twisters') }}
        />
        <Stack.Screen
          name="Emotions"
          component={EmotionsScreen}
          options={{ title: t('stack.emotions') }}
        />
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{ title: t('stack.achievements') }}
        />
        <Stack.Screen
          name="Stickers"
          component={StickerCollectionScreen}
          options={{ title: t('stack.stickers') }}
        />
        <Stack.Screen
          name="ParentDashboard"
          component={ParentDashboardScreen}
          options={{ title: t('stack.parent') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
