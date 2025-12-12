export enum PromptCategory {
  GENERAL = 'General Assistant',
  CODING = 'Coding & Development',
  JSON = 'JSON Data & Structure',
  IMAGE_GEN = 'Image Generation (Midjourney/DALL-E)',
  CREATIVE_WRITING = 'Creative Writing',
  BUSINESS = 'Business & Professional',
  ACADEMIC = 'Academic & Research',
  MARKETING = 'Marketing & Copywriting'
}

export interface GeneratedPromptData {
  refinedPrompt: string;
  explanation: string;
  tips: string[];
  suggestedFollowUp?: string;
}

export interface HistoryItem extends GeneratedPromptData {
  id: string;
  timestamp: number;
  originalInput: string;
  category: PromptCategory;
  tone: string;
}

export interface PromptRequest {
  rawInput: string;
  category: PromptCategory;
  tone?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ThemeId = 'nebula' | 'ocean' | 'forest' | 'sunset' | 'amber';

export interface Theme {
  id: ThemeId;
  name: string;
  primaryRgb: string;
  secondaryRgb: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}
