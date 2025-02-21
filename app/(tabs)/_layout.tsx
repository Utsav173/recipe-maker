import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { SQLiteProvider } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import {
	ThemeProvider as NavigationThemeProvider,
	DarkTheme,
	DefaultTheme,
} from '@react-navigation/native';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<SQLiteProvider databaseName="test.db">
			<NavigationThemeProvider
				value={theme === 'dark' ? DarkTheme : DefaultTheme}
			>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: Colors[theme].tint,
						headerShown: false,
						tabBarButton: HapticTab,
						tabBarShowLabel: false,
						tabBarBackground: TabBarBackground,
						tabBarStyle: Platform.select({
							ios: {
								position: 'absolute',
							},
							default: {},
						}),
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							tabBarIcon: ({ size, color }) => (
								<Ionicons name="restaurant" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							tabBarIcon: ({ size, color }) => (
								<Ionicons name="settings" size={size} color={color} />
							),
						}}
					/>
				</Tabs>
			</NavigationThemeProvider>
		</SQLiteProvider>
	);
}
