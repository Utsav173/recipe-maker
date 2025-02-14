import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
	const [hasHydrated, setHasHydrated] = useState(false);
	const systemColorScheme = useRNColorScheme();

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	// Use systemColorScheme only after hydration on web to get system preference.
	// Fallback to 'light' if null (which can happen during SSR).
	return hasHydrated ? systemColorScheme ?? 'light' : 'light';
}
