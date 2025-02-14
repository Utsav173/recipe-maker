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
} from '@/lib/db';
import { Recipe } from '@/types/recipe';
import { generateRecipe } from '@/lib/ai';
import RecipeModal from '@/components/RecipeModal';
import RecipeCard from '@/components/RecipeCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe['recipe'][]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe['recipe'] | null>(
    null
  );

  useEffect(() => {
    initDatabase();
    loadRecentRecipes();
  }, []);

  const loadRecentRecipes = async () => {
    setFetching(true);
    try {
      const recentRecipes = await getRecentRecipes();
      setRecipes(recentRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'કૃપા કરીને વાનગીનું નામ દાખલ કરો');
      return;
    }

    const config = (await getConfig()) as any;

    if (!config.api_key) {
      Alert.alert('Error', 'કૃપા કરીને સેટિંગ્સમાં API કી દાખલ કરો');
      return;
    }

    setLoading(true);
    try {
      const result = await generateRecipe(prompt);
      await saveRecipe(result.recipe);
      await loadRecentRecipes();
      setPrompt('');
    } catch (error) {
      Alert.alert('Error', 'વાનગી જનરેટ કરવામાં ભૂલ આવી');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="વાનગીનું નામ દાખલ કરો..."
              value={prompt}
              onChangeText={setPrompt}
              onSubmitEditing={handleGenerate}
            />
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
            >
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E67E22" />
            <Text style={styles.loadingText}>વાનગી જનરેટ થઈ રહી છે...</Text>
          </View>
        ) : fetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E67E22" />
            <Text style={styles.loadingText}>વાનગીઓ લોડ થઈ રહી છે...</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                onPress={() => setSelectedRecipe(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                કોઈ વાનગી ઉપલબ્ધ નથી. ઉપર વાનગીનું નામ દાખલ કરો.
              </Text>
            }
          />
        )}

        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            visible={!!selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
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
    backgroundColor: '#F5F6FA',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  generateButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginLeft: 8,
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
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
});