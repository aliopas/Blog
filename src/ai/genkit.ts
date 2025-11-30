'use server';

const API_KEYS = [
  process.env.GOOGLE_GENAI_API_KEY_1,
  process.env.GOOGLE_GENAI_API_KEY_2
].filter(Boolean) as string[];

// Using the model requested by the user.
const MODEL_NAME = 'gemini-2.0-flash-lite';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

/**
 * Parses a JSON string from the AI response, cleaning it first.
 * NOW ASYNC to comply with 'use server' module exports.
 */
export async function parseJson<T>(text: string): Promise<T> {
  const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    // This function doesn't perform async operations, but is marked async
    // to satisfy the 'use server' constraint on exported functions.
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', cleanedText);
    throw new Error('Invalid JSON response from AI.');
  }
}

/**
 * Calls the Gemini API with a given prompt and handles retries.
 */
export async function callGeminiAPI(prompt: string, retryCount: number = 0): Promise<string> {
  const maxRetries = 3;
  if (retryCount >= maxRetries) {
    throw new Error(`Max retries (${maxRetries}) reached for Gemini API call.`);
  }

  const apiKey = API_KEYS[retryCount % API_KEYS.length];

  if (!apiKey) {
    throw new Error('No API keys configured. Please set GOOGLE_GENAI_API_KEY_1 in .env');
  }

  const url = `${BASE_URL}?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(`API Error ${response.status}: ${JSON.stringify(errorBody)}`);
      console.error("Network/Fetch Error:", error.message);
      throw error;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn('AI response format unexpected:', data);
      throw new Error('Could not extract text from AI response.');
    }

    return text;

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('API Error')) {
       if (error.message.includes('429')) { // Specific handling for rate limits
          const delay = 15000 * (retryCount + 1);
          console.warn(`🚦 Rate limit hit. Retrying in ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
       } else { // Generic network error
          const delay = 2000 * (retryCount + 1);
          console.warn(`⚠️ Network error. Retrying in ${delay/1000}s...`);
          await new Promise(res => setTimeout(res, delay));
       }
       return callGeminiAPI(prompt, retryCount + 1);
    }
    console.error('An unexpected non-network error occurred:', error);
    throw error;
  }
}
