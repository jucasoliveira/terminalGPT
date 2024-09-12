import { OpenAIEngine } from "./openAi"; // Import OpenAI engine
import { AnthropicEngine } from "./anthropic"; // Import Anthropic engine
import { GeminiEngine } from "./gemini"; // Import Gemini engine
import { OllamaEngine } from "./ollama"; // Import Ollama engine

export interface AiEngineConfig {
  apiKey: string;
  model: string;
  hasContext: boolean;
  maxTokensOutput: number;
  maxTokensInput: number;
  baseURL?: string;
}

export interface AiEngine {
  config: AiEngineConfig;
  engineResponse(
    prompt: string,
    options?: { temperature?: number }
  ): Promise<string | null | undefined>;
}

/**
 * Creates an AI engine instance based on the specified engine type.
 * @param engineType - The type of AI engine to create.
 * @param config - The configuration for the AI engine.
 * @returns An instance of the AI engine.
 */
const Engine = (engineType: string, config: AiEngineConfig): AiEngine => {
  const engineResponse = (prompt: string, opts?: { temperature?: number }) => {
    const engineOptions = {
      model: config.model,
      temperature: opts?.temperature,
    };

    switch (engineType) {
      case "openAI":
        return OpenAIEngine(
          config.apiKey,
          prompt,
          engineOptions,
          config.hasContext
        );
      case "anthropic":
        return AnthropicEngine(
          config.apiKey,
          prompt,
          engineOptions,
          config.hasContext
        );
      case "gemini":
        return GeminiEngine(
          config.apiKey,
          prompt,
          engineOptions,
          config.hasContext
        );
      case "ollama":
        return OllamaEngine(
          config.apiKey,
          prompt,
          engineOptions,
          config.hasContext,
          config.baseURL
        );
      default:
        throw new Error("Unsupported engine type");
    }
  };

  return { config, engineResponse };
};

/**
 * Main function to generate a response using the specified AI engine.
 * @param engineType - The type of engine to use.
 * @param apiKey - The API key for authentication.
 * @param prompt - The prompt to send to the AI engine.
 * @param opts - Additional options for generating the response.
 * @returns The generated response from the AI engine.
 */
export async function generateResponse(
  engineType: string,
  apiKey: string,
  prompt: string,
  opts: {
    model: string;
    temperature?: number;
  },
  hasContext: boolean = false
): Promise<string | null | undefined> {
  const config: AiEngineConfig = {
    apiKey,
    model: opts.model,
    maxTokensOutput: 8192,
    maxTokensInput: 4096,
    hasContext,
  };

  const engine = Engine(engineType, config);

  return await engine.engineResponse(prompt, {
    temperature: opts.temperature,
  });
}
