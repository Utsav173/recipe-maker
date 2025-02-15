import { Alert, Platform, AlertButton } from 'react-native'; // Import AlertButton

interface ThemedAlertProps {
	title: string;
	message: string;
	buttons?: {
		text: string;
		onPress?: () => void;
		style?: 'default' | 'cancel' | 'destructive';
	}[];
}

const ThemedAlert = (
	title: string,
	message: string,
	buttons?: ThemedAlertProps['buttons']
) => {
	const themedButtons: AlertButton[] = buttons
		? buttons.map((button) => ({
				text: button.text,
				onPress: button.onPress,
				style:
					button.style === 'default' ||
					button.style === 'cancel' ||
					button.style === 'destructive'
						? button.style
						: undefined,
		  }))
		: [{ text: 'OK' }]; // Default to 'OK' button

	if (Platform.OS === 'web') {
		// For web, use the native browser alert (no custom styling possible)
		window.alert(`${title}\n\n${message}`);
	} else {
		// For iOS and Android, use the React Native Alert
		Alert.alert(title, message, themedButtons);
	}
};

export default ThemedAlert;
