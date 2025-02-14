import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { getConfig, saveTheme } from '@/lib/db';

type ThemeContextType = {
	theme: NonNullable<ColorSchemeName>;
	setTheme: (theme: NonNullable<ColorSchemeName>) => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<NonNullable<ColorSchemeName>>('light');
	const systemTheme = useColorScheme();

	useEffect(() => {
		const loadInitialTheme = async () => {
			const storedConfig = (await getConfig()) as any;

			console.log(storedConfig, 'storedConfig');

			setTheme(
				storedConfig?.theme === 'dark' || storedConfig?.theme === 'light'
					? storedConfig.theme
					: systemTheme
			);
		};
		loadInitialTheme();
	}, [systemTheme]); // Add systemTheme as a dependency

	useEffect(() => {
		if (theme) {
			saveTheme(theme);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
