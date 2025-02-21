import {
	View,
	StyleSheet,
	TextInput,
	Pressable,
	ScrollView,
  } from 'react-native';
  
  import { useEffect, useState } from 'react';
  import { GoogleModelId } from '@/types/config';
  import { getConfig, saveConfig } from '@/lib/db';
  import { Picker } from '@react-native-picker/picker';
  import Slider from '@react-native-community/slider';
  import { Ionicons } from '@expo/vector-icons';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useTheme } from '@/context/ThemeContext';
  import { Colors } from '@/constants/Colors';
  import { ThemedText } from '@/components/ThemedText';
  import ThemedAlert from '@/components/ThemedAlert';
  
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
	const [language, setLanguage] = useState<'gujarati' | 'hindi'>('gujarati');
  
	const { theme } = useTheme();
  
	useEffect(() => {
	  loadConfig();
	}, []);
  
	const loadConfig = async () => {
	  try {
		const config = (await getConfig()) as any;
		if (config) {
		  setApiKey(config.api_key || '');
		  setModelId(config.model_id || 'gemini-2.0-flash-exp');
		  setTemperature(
			config.temperature === undefined ? 0.7 : config.temperature
		  );
		  setLanguage(config.language || 'gujarati');
		}
	  } catch (error) {
		ThemedAlert('Error', 'Failed to load configuration');
	  }
	};
  
	const handleSave = async () => {
	  if (!apiKey.trim()) {
		ThemedAlert('Error', 'Please enter your API key');
		return;
	  }
  
	  setLoading(true);
	  try {
		await saveConfig({
		  apiKey: apiKey.trim(),
		  modelId,
		  temperature,
		  language,
		});
		ThemedAlert('Success', 'Settings saved successfully');
	  } catch (error) {
		ThemedAlert('Error', 'Failed to save settings');
	  } finally {
		setLoading(false);
	  }
	};
  
	const LANGUAGE_OPTIONS = [
	  { label: 'ગુજરાતી', value: 'gujarati' },
	  { label: 'हिंदी', value: 'hindi' },
	];
  
	return (
	  <SafeAreaView
		style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}
	  >
		<ScrollView
		  style={[
			styles.container,
			{ backgroundColor: Colors[theme].background },
		  ]}
		>
		  <View
			style={[
			  styles.section,
			  { backgroundColor: Colors[theme].background },
			]}
		  >
			<ThemedText
			  style={[styles.sectionTitle, { color: Colors[theme].text }]}
			>
			  API Configuration
			</ThemedText>
			<ThemedText
			  style={[styles.description, { color: Colors[theme].text }]}
			>
			  Enter your Google AI API key and configure model settings for recipe
			  generation.
			</ThemedText>
  
			<ThemedText style={[styles.label, { color: Colors[theme].text }]}>
			  API Key
			</ThemedText>
			<TextInput
			  style={[
				styles.input,
				{
				  borderColor: Colors[theme].icon,
				  color: Colors[theme].text,
				  backgroundColor: Colors[theme].background,
				},
			  ]}
			  placeholder="Enter API key"
			  placeholderTextColor={Colors[theme].icon}
			  value={apiKey}
			  onChangeText={setApiKey}
			  secureTextEntry
			/>
  
			<ThemedText style={[styles.label, { color: Colors[theme].text }]}>
			  Model
			</ThemedText>
			<View
			  style={[
				styles.pickerContainer,
				{
				  borderColor: Colors[theme].icon,
				  backgroundColor: Colors[theme].background,
				},
			  ]}
			>
			  <Picker
				selectedValue={modelId}
				onValueChange={(value) => setModelId(value as GoogleModelId)}
				style={[
				  styles.picker,
				  {
					color: Colors[theme].text,
					backgroundColor: Colors[theme].background,
				  },
				]}
				dropdownIconColor={Colors[theme].icon}
			  >
				{MODEL_OPTIONS.map((option) => (
				  <Picker.Item
					key={option.value}
					label={option.label}
					value={option.value}
					color={'#000'}
				  />
				))}
			  </Picker>
			</View>
  
			<ThemedText style={[styles.label, { color: Colors[theme].text }]}>
			  Temperature: {temperature.toFixed(2)}
			</ThemedText>
			<Slider
			  style={styles.slider}
			  value={temperature}
			  onSlidingComplete={setTemperature}
			  minimumValue={0}
			  maximumValue={1}
			  step={0.1}
			  minimumTrackTintColor={Colors[theme].tint}
			  maximumTrackTintColor={Colors[theme].icon}
			/>
  
			<ThemedText style={[styles.label, { color: Colors[theme].text }]}>
			  Language
			</ThemedText>
			<View
			  style={[
				styles.pickerContainer,
				{
				  borderColor: Colors[theme].icon,
				  backgroundColor: Colors[theme].background,
				},
			  ]}
			>
			  <Picker
				selectedValue={language}
				onValueChange={(value) =>
				  setLanguage(value as 'gujarati' | 'hindi')
				}
				style={[
				  styles.picker,
				  {
					color: Colors[theme].text,
					backgroundColor: Colors[theme].background,
				  },
				]}
				dropdownIconColor={Colors[theme].icon}
			  >
				{LANGUAGE_OPTIONS.map((option) => (
				  <Picker.Item
					key={option.value}
					label={option.label}
					value={option.value}
					color={'#000'}
				  />
				))}
			  </Picker>
			</View>
  
			<Pressable
			  style={[
				styles.button,
				loading && styles.buttonDisabled,
				{ backgroundColor: Colors[theme].tint },
			  ]}
			  onPress={handleSave}
			  disabled={loading}
			>
			  <Ionicons
				name="save-outline"
				size={20}
				color={Colors[theme].background}
			  />
			  <ThemedText
				style={[styles.buttonText, { color: Colors[theme].background }]}
			  >
				{loading ? 'Saving...' : 'Save Settings'}
			  </ThemedText>
			</Pressable>
		  </View>
  
		  <View
			style={[
			  styles.section,
			  { backgroundColor: Colors[theme].background },
			]}
		  >
			<ThemedText
			  style={[styles.sectionTitle, { color: Colors[theme].text }]}
			>
			  About
			</ThemedText>
			<ThemedText
			  style={[styles.description, { color: Colors[theme].text }]}
			>
			  This app generates traditional Gujarati recipes using Google's
			  Gemini AI. All recipes are generated in pure Gujarati language while
			  the app interface remains in English for better accessibility.
			</ThemedText>
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
	},
	section: {
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
	  marginBottom: 16,
	  lineHeight: 20,
	},
	label: {
	  fontSize: 14,
	  fontWeight: '500',
	  marginBottom: 8,
	},
	input: {
	  height: 50,
	  borderRadius: 8,
	  paddingHorizontal: 16,
	  fontSize: 16,
	  marginBottom: 16,
	  borderWidth: 1,
	},
	pickerContainer: {
	  borderRadius: 8,
	  marginBottom: 16,
	  overflow: 'hidden',
	  borderWidth: 1,
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
	  fontSize: 16,
	  fontWeight: 'bold',
	  marginLeft: 8,
	},
  });
  