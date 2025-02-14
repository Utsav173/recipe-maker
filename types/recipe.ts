import { z } from 'zod';

export const recipeSchema = z.object({
  recipe: z.object({
    title: z
      .string()
      .describe(
        'વાનગીનું નામ (ગુજરાતીમાં), જેમાં મુખ્ય સામગ્રી અથવા રસોઈ પદ્ધતિનો સમાવેશ થાય.'
      ),
    description: z
      .string()
      .describe(
        'સંક્ષિપ્ત પરિચય, જે સ્વાદ, પરંપરા અને પ્રાદેશિક મહત્વને હાઇલાઇટ કરે.'
      ),
    ingredients: z
      .array(z.string())
      .describe(
        'સામગ્રીની યાદી, ચોક્કસ માત્રા મેટ્રિક અને પરંપરાગત માપમાં આપવી.'
      ),
    steps: z
      .array(z.string())
      .describe('વિગતવાર રસોઈ સૂચનાઓ, સમય, તાપમાન અને પરંપરાગત પદ્ધતિઓ સાથે.'),
    tags: z
      .array(z.string())
      .describe(
        "શ્રેણીઓ જેવી કે 'ફરસાણ', 'શાક', 'મીઠાઈ', 'ઋતુપ્રસંગિક', 'ઉત્સવી' વગેરે."
      ),
    difficulty: z
      .enum(['સહેલું', 'મધ્યમ', 'અઘરુ'])
      .optional(),
    prepTime: z.number().optional(),
    servings: z.number().optional(),
  }),
});

export type Recipe = z.infer<typeof recipeSchema>;