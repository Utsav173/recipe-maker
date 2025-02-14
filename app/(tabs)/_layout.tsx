import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import {
	ThemeProvider as NavigationThemeProvider,
	DarkTheme,
	DefaultTheme,
} from '@react-navigation/native';

export default function TabLayout() {
	//const colorScheme = useColorScheme(); // No longer needed
	const { theme } = useTheme(); // Use the context

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
						tabBarBackground: TabBarBackground,
						tabBarStyle: Platform.select({
							ios: {
								// Use a transparent background on iOS to show the blur effect
								position: 'absolute',
							},
							default: {},
						}),
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: 'વાનગીઓ',
							tabBarIcon: ({ size, color }) => (
								<Ionicons name="restaurant" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							title: 'સેટિંગ્સ',
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
