import { PromptCategory, Theme } from './types';

export const CATEGORY_DESCRIPTIONS: Record<PromptCategory, string> = {
  [PromptCategory.GENERAL]: "Standard LLM interaction for Q&A and general tasks.",
  [PromptCategory.CODING]: "Optimized for generating clean, efficient, and bug-free code.",
  [PromptCategory.JSON]: "Specialized in structured data extraction, schema validation, and JSON generation.",
  [PromptCategory.IMAGE_GEN]: "Descriptive prompts focused on style, lighting, and composition for AI art.",
  [PromptCategory.CREATIVE_WRITING]: "Narrative-focused prompts with attention to tone, style, and character.",
  [PromptCategory.BUSINESS]: "Professional, concise, and actionable prompts for workplace tasks.",
  [PromptCategory.ACADEMIC]: "Objective, rigorous, and citation-focused prompts for research.",
  [PromptCategory.MARKETING]: "Persuasive and engaging prompts for creating ad copy or content."
};

export const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Enthusiastic",
  "Serious",
  "Witty",
  "Instructional",
  "Empathetic"
];

export const THEMES: Theme[] = [
  { 
    id: 'nebula', 
    name: 'Dark Nebula', 
    primaryRgb: '99 102 241', // Indigo-500
    secondaryRgb: '168 85 247' // Purple-500
  },
  { 
    id: 'ocean', 
    name: 'Ocean Deep', 
    primaryRgb: '6 182 212', // Cyan-500
    secondaryRgb: '59 130 246' // Blue-500
  },
  { 
    id: 'forest', 
    name: 'Forest Canopy', 
    primaryRgb: '16 185 129', // Emerald-500
    secondaryRgb: '132 204 22' // Lime-500
  },
  { 
    id: 'sunset', 
    name: 'Sunset Glow', 
    primaryRgb: '249 115 22', // Orange-500
    secondaryRgb: '236 72 153' // Pink-500
  },
  { 
    id: 'amber', 
    name: 'Warm Ember', 
    primaryRgb: '234 179 8', // Yellow-500
    secondaryRgb: '239 68 68' // Red-500
  }
];