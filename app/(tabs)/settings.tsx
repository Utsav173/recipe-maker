import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Pressable,
	Alert,
	ScrollView,
} from 'react-native';

import { useEffect, useState } from 'react';
import { GoogleModelId } from '@/types/config';
import { getConfig, saveConfig } from '@/lib/db';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { ColorSchemeName } from 'react-native';

const MODEL_OPTIONS: { label: string; value: GoogleModelId }[] = [
	{ label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp' },
	{ label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
	{ label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
	{ label: 'Gemini 2.0 Pro Experimental', value: 'gemini-2.0-pro-exp-02-05' },
];

export default function SettingsScreen() {
	const [apiKey, setApiKey] = useState('');
	const [modelId, setModelId] = useState<GoogleModelId>('gemini-2.0-flash-exp');
	const [temperature, setTemperature] = useState(0.7);
	const [loading, setLoading] = useState(false);

	const { theme, setTheme } = useTheme(); // Use the context

	useEffect(() => {
		loadConfig();
	}, []);

	const loadConfig = async () => {
		try {
			const config = (await getConfig()) as any;
			if (config) {
				// Check if config exists
				setApiKey(config.apiKey || ''); // Provide default values
				setModelId(config.modelId || 'gemini-2.0-flash-exp'); // Provide default
				setTemperature(
					config.temperature === undefined ? 0.7 : config.temperature
				);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to load configuration');
		}
	};

	const handleSave = async () => {
		if (!apiKey.trim()) {
			Alert.alert('Error', 'Please enter your API key');
			return;
		}

		setLoading(true);
		try {
			await saveConfig({
				apiKey: apiKey.trim(),
				modelId,
				temperature,
			});
			Alert.alert('Success', 'Settings saved successfully');
		} catch (error) {
			Alert.alert('Error', 'Failed to save settings');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>API Configuration</Text>
					<Text style={styles.description}>
						Enter your Google AI API key and configure model settings for recipe
						generation.
					</Text>

					<Text style={styles.label}>API Key</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter API key"
						value={apiKey}
						onChangeText={setApiKey}
						secureTextEntry
					/>

					<Text style={styles.label}>Model</Text>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={modelId}
							onValueChange={(value) => setModelId(value as GoogleModelId)}
							style={styles.picker}
						>
							{MODEL_OPTIONS.map((option) => (
								<Picker.Item
									key={option.value}
									label={option.label}
									value={option.value}
								/>
							))}
						</Picker>
					</View>

					<Text style={styles.label}>
						Temperature: {temperature.toFixed(2)}
					</Text>
					<Slider
						style={styles.slider}
						value={temperature}
						onValueChange={setTemperature} // Use onValueChange instead of onSlidingComplete
						minimumValue={0}
						maximumValue={1}
						step={0.1}
						minimumTrackTintColor="#E67E22"
						maximumTrackTintColor="#D1D1D1"
					/>

					<Pressable
						style={[styles.button, loading && styles.buttonDisabled]}
						onPress={handleSave}
						disabled={loading}
					>
						<Ionicons name="save-outline" size={20} color="white" />
						<Text style={styles.buttonText}>
							{loading ? 'Saving...' : 'Save Settings'}
						</Text>
					</Pressable>
				</View>

				{/* Theme Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Theme</Text>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={theme}
							onValueChange={(value) =>
								setTheme(value as NonNullable<ColorSchemeName>)
							}
							style={styles.picker}
						>
							<Picker.Item label="System" value="system" />
							<Picker.Item label="Light" value="light" />
							<Picker.Item label="Dark" value="dark" />
						</Picker>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>About</Text>
					<Text style={styles.description}>
						This app generates traditional Gujarati recipes using Google's
						Gemini AI. All recipes are generated in pure Gujarati language while
						the app interface remains in English for better accessibility.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#F5F6FA',
	},
	section: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		margin: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		fontFamily: 'MuktaVaani_400Regular',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	description: {
		fontSize: 14,
		color: '#666',
		marginBottom: 16,
		lineHeight: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 8,
		color: '#333',
	},
	input: {
		height: 50,
		backgroundColor: '#F5F6FA',
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
		marginBottom: 16,
	},
	pickerContainer: {
		backgroundColor: '#F5F6FA',
		borderRadius: 8,
		marginBottom: 16,
		overflow: 'hidden',
	},
	picker: {
		height: 50,
		width: '100%',
	},
	slider: {
		width: '100%',
		height: 40,
		marginBottom: 16,
	},
	button: {
		backgroundColor: '#E67E22',
		borderRadius: 8,
		padding: 12,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: 8,
	},
});
