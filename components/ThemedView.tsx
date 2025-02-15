//Themed View
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
	lightColor?: string;
	darkColor?: string;
};

export function ThemedView({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ThemedViewProps) {
	const { theme } = useTheme();
	const backgroundColor =
		lightColor && theme === 'light'
			? lightColor
			: darkColor && theme === 'dark'
			? darkColor
			: Colors[theme].background;

	return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
