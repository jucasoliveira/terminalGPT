import { GoogleGenerativeAI } from "@google/generative-ai";
import { addContext, getContext } from "../context";
import { loadWithRocketGradient } from "../gradient";

export const GeminiEngine = async (
  apiKey: string | Promise<string>,
  prompt: string,
  opts: {
    model: string; // Specify the model to use
    temperature?: number; // Optional temperature setting
    filePath?: string; // Optional file path for uploads
    mimeType?: string; // Optional MIME type for the file
  },
  hasContext: boolean = false
) => {
  const apiKeyValue = await apiKey;
  const genAI = new GoogleGenerativeAI(apiKeyValue);
  const spinner = loadWithRocketGradient("Thinking...").start();

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: opts.model || "gemini-1.5-flash",
    });

    // Generate response
    const generationConfig = {
      temperature: opts.temperature || 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    // Prepare chat history with context
    const relevantContext = getContext(prompt);
    const chatHistory = relevantContext.map((context) => ({
      role: context.role as "user" | "model",
      parts: [{ text: context.content }],
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    if (responseText) {
      if (hasContext) {
        addContext({ role: "user", content: prompt });
        addContext({ role: "assistant", content: responseText });
      }
      spinner.stop();
      return responseText;
    } else {
      throw new Error("Undefined messages received");
    }
  } catch (err) {
    spinner.stop();
    console.error(err);
    throw new Error("An error occurred while generating content");
  }
};
