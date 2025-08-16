import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Sender } from "../types";

// Per instructions, the API key is obtained from the environment.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY is not set. Please configure it in your environment.");
  // Fallback for user experience, though calls will fail.
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = "You are Melisa, a fast and efficient AI assistant from BULLET X TECHNOLOGIES. Prioritize giving quick, concise, and direct answers. Be helpful and to the point. Use your search tool only when necessary for recent information.";
const tools = [{ googleSearch: {} }];

// Maps the frontend message format to the Gemini API history format.
const mapMessagesToHistory = (messages: Message[]) => {
  return messages
    .filter(m => m.id !== '0' && m.text.trim() !== '') // Exclude initial message and empty bot placeholders
    .map(msg => ({
      role: msg.sender === Sender.User ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
};

export const getChatStream = async function* (message: string, history: Message[]) {
  // Create a new chat session on-the-fly for each request, seeded with the provided history.
  const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
          systemInstruction: systemInstruction,
          tools: tools,
      },
      history: mapMessagesToHistory(history),
  });

  const stream = await chat.sendMessageStream({ message });

  for await (const chunk of stream) {
    // Yield a payload that matches what the ChatInterface component expects.
    const responsePayload = {
      text: chunk.text,
      groundingMetadata: chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
    yield responsePayload;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("No image was generated.");
    }
};
