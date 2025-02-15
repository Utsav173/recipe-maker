import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	FlatList,
	Alert,
	TouchableOpacity,
} from 'react-native';

import { useEffect, useState } from 'react';
import {
	getConfig,
	getRecentRecipes,
	initDatabase,
	saveRecipe,
	deleteRecipe,
} from '@/lib/db';
import { Recipe } from '@/types/recipe';
import { generateRecipe } from '@/lib/ai';
import RecipeModal from '@/components/RecipeModal';
import RecipeCard from '@/components/RecipeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext'; // Import
import { Colors } from '@/constants/Colors'; // Import
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [recipes, setRecipes] = useState<Recipe['recipe'][]>([]);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe['recipe'] | null>(
		null
	);
	const { theme } = useTheme();

	useEffect(() => {
		const initialize = async () => {
			await initDatabase();
			await loadRecentRecipes();
		};

		initialize();
	}, []);

	const loadRecentRecipes = async () => {
		setFetching(true);
		try {
			const recentRecipes = await getRecentRecipes();
			setRecipes(recentRecipes);
		} catch (error) {
			console.error('Failed to load recipes:', error);
			Alert.alert('Error', 'Failed to load recent recipes.');
		} finally {
			setFetching(false);
		}
	};

	const handleGenerate = async () => {
		if (!prompt.trim()) {
			Alert.alert('Error', 'Please enter a recipe name.'); // Simplified message
			return;
		}

		const config = (await getConfig()) as any;

		if (!config?.apiKey) {
			// Corrected property name
			Alert.alert('Error', 'Please enter an API key in settings.'); // Clearer message
			return;
		}

		setLoading(true);
		try {
			const result = await generateRecipe(prompt);
			if (result && result.recipe) {
				await saveRecipe(result.recipe);
				await loadRecentRecipes();
				setPrompt('');
			} else {
				Alert.alert('Error', 'No recipe data returned from AI.');
			}
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to generate recipe.'); // More concise error
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRecipe = async (title: string) => {
		try {
			await deleteRecipe(title);
			await loadRecentRecipes();
			setSelectedRecipe(null);
		} catch (error) {
			console.error('Failed to delete recipe:', error);
			Alert.alert('Error', 'Failed to delete the recipe.');
		}
	};

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}
		>
			<View
				style={[
					styles.container,
					{ backgroundColor: Colors[theme].background },
				]}
			>
				<View style={styles.searchContainer}>
					<View style={styles.inputContainer}>
						<TextInput
							style={[
								styles.input,
								{ borderColor: Colors[theme].icon, color: Colors[theme].text },
							]} // Themed border and text
							placeholder="Enter recipe name..."
							placeholderTextColor={Colors[theme].icon}
							value={prompt}
							onChangeText={setPrompt}
							onSubmitEditing={handleGenerate}
						/>
						<TouchableOpacity
							style={[
								styles.generateButton,
								{ backgroundColor: Colors[theme].tint },
							]}
							onPress={handleGenerate}
							disabled={loading}
						>
							<Text style={styles.generateButtonText}>Generate</Text>
						</TouchableOpacity>
					</View>
				</View>

				{loading || fetching ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={Colors[theme].tint} />
						<ThemedText style={styles.loadingText}>
							{loading ? 'Generating recipe...' : 'Loading recipes...'}
						</ThemedText>
					</View>
				) : (
					<FlatList
						data={recipes}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<RecipeCard
								recipe={item}
								onPress={() => setSelectedRecipe(item)}
								key={index}
							/>
						)}
						ListEmptyComponent={
							<ThemedText style={styles.emptyText}>
								No recipes available. Enter a recipe name above.
							</ThemedText>
						}
						contentContainerStyle={styles.listContent} // Add padding to the list itself
					/>
				)}

				{selectedRecipe && (
					<RecipeModal
						recipe={selectedRecipe}
						visible={!!selectedRecipe}
						onClose={() => setSelectedRecipe(null)}
						onDelete={handleDeleteRecipe}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		fontFamily: 'MuktaVaani_400Regular',
	},
	searchContainer: {
		padding: 16,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 25,
		paddingLeft: 16,
		borderWidth: 1,
		marginRight: 8,
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
	},
	generateButton: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 25,
		marginLeft: 8,
		marginRight: 2,
	},
	generateButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
	},
	emptyText: {
		textAlign: 'center',
		marginTop: 32,
		fontSize: 16,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	listContent: {
		paddingHorizontal: 8,
		paddingBottom: 16,
	},
});
