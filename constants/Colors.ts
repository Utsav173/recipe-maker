/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const orange = {
	50: '#FFF7ED',
	100: '#FFE4CA',
	200: '#FFD1A7',
	300: '#FFB77D',
	400: '#FF9E54',
	500: '#F97316',
	600: '#EA580C',
	700: '#C2410C',
	800: '#9A3412',
	900: '#7C2D12',
};

export const Colors = {
	light: {
		text: '#1A1A1A',
		background: '#FFFFFF',
		surface: '#F8F9FA',
		tint: orange[500],
		accent: orange[600],
		muted: orange[100],
		icon: '#4A5568',
		tabIconDefault: '#A0AEC0',
		tabIconSelected: orange[500],
		inputBorder: orange[700],
		cardShadow: '#00000010',
	},
	dark: {
		text: '#F7FAFC',
		background: '#1A202C',
		surface: '#2D3748',
		tint: orange[400],
		accent: orange[300],
		muted: orange[800],
		icon: '#F7FAFC',
		tabIconDefault: '#718096',
		tabIconSelected: orange[400],
		inputBorder: orange[300],
		cardShadow: '#00000030',
	},
};
