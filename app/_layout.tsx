import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { MuktaVaani_400Regular } from '@expo-google-fonts/mukta-vaani';
import { NotoSansGujarati_400Regular } from '@expo-google-fonts/noto-sans-gujarati';
import { ThemeProvider as MyThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		MuktaVaani_400Regular,
		NotoSansGujarati_400Regular,
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const { theme } = useTheme();

	return (
		<MyThemeProvider>
			<ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style={theme} />
			</ThemeProvider>
		</MyThemeProvider>
	);
}
