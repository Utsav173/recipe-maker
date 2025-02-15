import React, { createContext, useContext } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type ThemeContextType = {
	theme: NonNullable<ColorSchemeName>;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const systemTheme = useColorScheme() || 'light';

	return (
		<ThemeContext.Provider value={{ theme: systemTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
