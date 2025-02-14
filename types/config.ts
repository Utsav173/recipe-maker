import { z } from 'zod';

export const GoogleModelId = z.enum([
  'gemini-2.0-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-8b-latest',
  'gemini-1.5-flash-8b-001',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-pro-exp-02-05',
  'gemini-2.0-flash-thinking-exp-01-21',
  'gemini-2.0-flash-exp',
  'gemini-exp-1206',
  'learnlm-1.5-pro-experimental'
]);

export type GoogleModelId = z.infer<typeof GoogleModelId>;

export const configSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  modelId: GoogleModelId.default('gemini-2.0-flash-exp'),
  temperature: z.number().min(0).max(1).default(0.7),
});