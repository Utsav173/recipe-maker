import * as SQLite from 'expo-sqlite';
import { Recipe } from '../types/recipe';
import { configSchema } from '../types/config';
import type { GoogleModelId } from '../types/config';

const db = SQLite.openDatabaseSync('recipes.db');

// List of database migrations
const migrations = [
  {
    version: 1,
    migrate: async () => {
      console.log('Running migration for version 1: Initial tables creation');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS recipes (
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
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS config (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          api_key TEXT NOT NULL,
          model_id TEXT NOT NULL DEFAULT 'gemini-2.0-flash-exp',
          temperature REAL NOT NULL DEFAULT 0.7,
          theme TEXT CHECK(theme IN ('system', 'dark', 'light')) DEFAULT 'system',
          language TEXT CHECK(language IN ('gujarati', 'hindi')) DEFAULT 'gujarati',
          version INTEGER NOT NULL DEFAULT 1,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
  },
];

// Function to check if a column exists in a table
const columnExists = async (
  table: string,
  column: string
): Promise<boolean> => {
  const result = await db.getAllAsync(`PRAGMA table_info(${table});`);
  return result.some((row: any) => row.name === column);
};

// Function to initialize the database
export const initDatabase = async () => {
  console.log('Initializing database and applying migrations...');
  try {
    const configTableExists = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='config';"
    );

    let currentVersion = 0;

    if (configTableExists) {
      // Ensure the `version` column exists before querying it
      const hasVersionColumn = await columnExists('config', 'version');
      if (!hasVersionColumn) {
        console.log('Adding missing "version" column to config table');
        await db.execAsync(
          `ALTER TABLE config ADD COLUMN version INTEGER NOT NULL DEFAULT 1;`
        );
      }

      // Fetch the current database version
      const versionResult = await db.getFirstAsync(
        'SELECT version FROM config WHERE id = 1;'
      );
      currentVersion = (versionResult as any)?.version || 0;
    }

    console.log(`Current DB Version: ${currentVersion}`);

    // Apply any pending migrations
    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Applying migration version ${migration.version}`);
        await migration.migrate();

        await db.runAsync(
          `INSERT OR REPLACE INTO config (id, version, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP);`,
          [migration.version]
        );
        console.log(`Database migrated to version ${migration.version}`);
      }
    }

    console.log('Database initialization and migrations complete.');
  } catch (error) {
    console.error('Database initialization or migration failed:', error);
    throw error;
  }
};

// Save config settings
export const saveConfig = async (config: {
  apiKey: string;
  modelId: GoogleModelId;
  temperature: number;
  language: 'gujarati' | 'hindi';
}) => {
  const validated = configSchema.parse(config);

  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO config (
        id, api_key, model_id, temperature, language, version, updated_at
      ) VALUES (1, ?, ?, ?, ?, (SELECT COALESCE(version, 1) FROM config WHERE id = 1), CURRENT_TIMESTAMP);`,
      [
        validated.apiKey,
        validated.modelId,
        validated.temperature,
        validated.language,
      ]
    );
    return true;
  } catch (error) {
    console.error('Failed to save config:', error);
    return false;
  }
};

// Save theme setting
export const saveTheme = async (theme: 'system' | 'dark' | 'light') => {
  await db.runAsync(
    `UPDATE config SET theme = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1;`,
    [theme]
  );
};

// Get current configuration
export const getConfig = async () => {
  try {
    const data = await db.getFirstAsync('SELECT * FROM config WHERE id = 1;');
    return data as
      | {
          api_key: string;
          model_id: GoogleModelId;
          temperature: number;
          theme: 'system' | 'dark' | 'light';
          language: 'gujarati' | 'hindi';
          version: number;
        }
      | { theme: 'system'; language: 'gujarati' };
  } catch (error) {
    console.error('Failed to get config:', error);
    return { theme: 'system', language: 'gujarati' };
  }
};

// Save a new recipe
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

// Fetch recent recipes
export const getRecentRecipes = async () => {
  try {
    const allRows = await db.getAllAsync(
      `SELECT * FROM recipes ORDER BY createdAt DESC LIMIT 10;`
    );

    return allRows.map((row: any) => ({
      title: row.title,
      description: row.description,
      ingredients: JSON.parse(row.ingredients),
      steps: JSON.parse(row.steps),
      tags: JSON.parse(row.tags),
      difficulty: row.difficulty,
      prepTime: row.prepTime,
      servings: row.servings,
    }));
  } catch (error) {
    console.error('Failed to get recent recipes:', error);
    return [];
  }
};

// Delete a recipe by title
export const deleteRecipe = async (title: string) => {
  try {
    await db.runAsync('DELETE FROM recipes WHERE title = ?;', [title]);
  } catch (error) {
    console.error('Failed to delete recipe', error);
  }
};
