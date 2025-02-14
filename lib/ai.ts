import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AISDKError, generateObject } from 'ai';
import { recipeSchema } from '../types/recipe';
import { getConfig } from './db';

const systemPrompt = `તમે એક અનુભવી ગુજરાતી રસોઈ વિશેષજ્ઞ છો. hamesha માત્ર શુદ્ધ ગુજરાતી ભાષામાં જ જવાબ આપવો.  

- વાનગીઓ, સામગ્રી, અને પદ્ધતિઓ માટે હંમેશા ગુજરાતી શબ્દો જ વાપરો.  
- માપ, તાપમાન, અને તબક્કાઓ ગુજરાતી સંખ્યાઓમાં દર્શાવો.  
- રેસિપીને પારંપરિક અને આધુનિક પદ્ધતિઓ સાથે સમજાવો.  
- ગુજરાતી સ્વાદ અને મસાલાના સંતુલન પર ધ્યાન આપો.  
- જવાબમાં એકપણ અંગ્રેજી શબ્દ ન હોવો જોઈએ.  

✅ **માત્ર 100% શુદ્ધ ગુજરાતી જવાબ આપવો.**`;

export const generateRecipe = async (prompt: string,) => {
  try {
    const config = (await getConfig()) as any;
    if (!config.api_key) {
      throw new Error('Please configure your API key in settings');
    }

    const google = createGoogleGenerativeAI({ apiKey: config.api_key });

    const { object } = await generateObject({
      model: google(config.model_id),
      prompt,
      schema: recipeSchema,
      schemaName: 'Recipe',
      system: systemPrompt,
      temperature: config.temperature,
    });

    return object;
  } catch (error: any) {
    console.error('Failed to generate recipe:', error);

    if (AISDKError.isInstance(error)) {
      throw new Error(
        'AI જનરેશન નિષ્ફળ: ' + error.message + JSON.stringify(error.cause)
      );
    }

    if (error.message.includes('API key')) {
      throw new Error('Please configure your API key in settings');
    }

    throw new Error('અનપેક્ષિત ભૂલ આવી: ' + error.message);
  }
};
