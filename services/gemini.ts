import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedPromptData, PromptCategory } from "../types";

const SYSTEM_INSTRUCTION = `
You are PromptSmith, an expert Prompt Engineer AI. 
Your goal is to take a user's raw, often vague idea and transform it into a highly effective, structured, and "perfect" prompt optimized for a specific AI model or use case.

GUIDELINES BY CATEGORY:
- **Coding**: Focus on efficiency, modern practices, error handling, and commenting.
- **JSON Data & Structure**: Focus on creating a STRICT JSON SCHEMA or JSON TEMPLATE. The 'refinedPrompt' must be valid JSON code. No markdown formatting, no comments outside the JSON. Ensure the JSON is pretty-printed with newlines and indentation for readability.
- **Image Generation**: Focus on visual descriptors, medium (e.g., oil painting, photo), lighting, camera angles, style (e.g., cyberpunk, minimalist), and aspect ratios.
- **General**: Focus on clarity, context, and specific constraints.
- **Business/Marketing**: Focus on tone, audience, and call to action.

OUTPUT FORMAT:
Return strict JSON matching the schema provided. 
- refinedPrompt: 
  - IF CATEGORY IS 'JSON Data & Structure': This field MUST be a valid, parsable JSON string. Do NOT use section headers, [ROLE] tags, or markdown fencing (no \`\`\`json). It should be the raw JSON structure/schema.
  - IF CATEGORY IS NOT JSON: STRUCTURE THIS PROMPT CLEARLY. Use clear section headers like [ROLE], [TASK], [CONTEXT], [CONSTRAINTS], [FORMAT]. Use newlines to separate sections. Use markdown bolding (**bold**) for key variables.
- explanation: A concise explanation of why you made specific changes (e.g., "Added context to reduce hallucination").
- tips: 3 bullet points on how to use this prompt effectively or variables the user might want to swap out.
- suggestedFollowUp: A suggestion for what the user might ask next after using this prompt.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    refinedPrompt: {
      type: Type.STRING,
      description: "The highly optimized prompt. For JSON category, this MUST be valid JSON string. For others, structured text.",
    },
    explanation: {
      type: Type.STRING,
      description: "Brief explanation of the prompt engineering techniques used.",
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 tips for using this prompt.",
    },
    suggestedFollowUp: {
      type: Type.STRING,
      description: "A logical follow-up question or step.",
    },
  },
  required: ["refinedPrompt", "explanation", "tips"],
};

export const generateRefinedPrompt = async (
  rawInput: string,
  category: PromptCategory,
  tone?: string
): Promise<GeneratedPromptData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Select model based on category complexity.
    // Pro preview is generally better for complex logic (coding), but Flash is excellent for structured text tasks.
    // Using Flash for speed and efficiency in this interactive tool.
    const modelId = "gemini-2.5-flash";

    const userMessage = `
      Category: ${category}
      Target Tone: ${tone || "Neutral/Optimized"}
      
      Raw User Idea:
      "${rawInput}"
      
      Please refine this into the best possible prompt.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Balance between creativity and adherence to best practices
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    return JSON.parse(text) as GeneratedPromptData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};