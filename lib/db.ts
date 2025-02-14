import * as SQLite from 'expo-sqlite';
import { Recipe } from '../types/recipe';
import { configSchema } from '../types/config';
import type { GoogleModelId } from '../types/config';

const db = SQLite.openDatabaseSync('recipes.db');

export const initDatabase = async () => {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        steps TEXT NOT NULL,
        tags TEXT NOT NULL,
        difficulty TEXT,
        prepTime INTEGER,
        servings INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
  );

  // Config table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        api_key TEXT NOT NULL,
        model_id TEXT NOT NULL DEFAULT 'gemini-2.0-flash-exp',
        temperature REAL NOT NULL DEFAULT 0.7,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
  );
};

export const saveConfig = (config: {
  apiKey: string;
  modelId: GoogleModelId;
  temperature: number;
}) => {
  return new Promise((resolve, reject) => {
    const validated = configSchema.parse(config);

    db.runAsync(
      `INSERT OR REPLACE INTO config (
          id, api_key, model_id, temperature, updated_at
        ) VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP);`,
      [
        validated.apiKey,
        validated.modelId,
        validated.temperature,
      ]
    )
      .then((result) => resolve(result))
      .catch((error) => {
        reject(error);
        return false;
      });
  });
};

export const getConfig = () => {
  const data = db
    .getFirstAsync('SELECT * FROM config WHERE id = 1;')
    .then((result) => result)
    .catch((error) => {
      console.error('Failed to get config:', error);
    });

  return data;
};

export const saveRecipe = async (recipe: Recipe['recipe']) => {
  await db
    .runAsync(
      `INSERT INTO recipes (
          title, description, ingredients, steps, tags, 
          difficulty, prepTime, servings
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        recipe.title,
        recipe.description,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.steps),
        JSON.stringify(recipe.tags),
        recipe.difficulty || null,
        recipe.prepTime || null,
        recipe.servings || null,
      ]
    )
    .then((result) => result)
    .catch((error) => {
      console.error('Failed to save recipe:', error);
    });
};

export const getRecentRecipes = () => {
  const recipes = db
    .getAllAsync(`SELECT * FROM recipes ORDER BY createdAt DESC LIMIT 10;`)
    .then((allRows) => {
      const recipes = allRows.map((row: any) => ({
        title: row.title,
        description: row.description,
        ingredients: JSON.parse(row.ingredients),
        steps: JSON.parse(row.steps),
        tags: JSON.parse(row.tags),
        difficulty: row.difficulty,
        prepTime: row.prepTime,
        servings: row.servings,
      }));
      return recipes;
    })
    .catch((error) => {
      console.error('Failed to get recent recipes:', error);
      return [];
    });

  return recipes;
};
