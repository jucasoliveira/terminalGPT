/* eslint-disable @typescript-eslint/no-explicit-any */
import { encoding_for_model, TiktokenModel } from "@dqbd/tiktoken";
import hnswlib from "hnswlib-node";

export interface ContextItem {
  role: string;
  content: string;
}

interface VectorStore {
  addItem: (item: ContextItem) => void;
  getRelevantContext: (query: string, k?: number) => ContextItem[];
}

const createVectorStore = (
  model: TiktokenModel = "gpt-4o",
  maxTokens: number = 4096
): VectorStore => {
  const dimension: number = 1536; // Fixed dimension size
  let index: hnswlib.HierarchicalNSW = new hnswlib.HierarchicalNSW(
    "cosine",
    dimension
  );
  const items: ContextItem[] = [];
  let encoder: any = encoding_for_model(model);
  let currentTokens: number = 0;

  try {
    encoder = encoding_for_model(model);
    index = new hnswlib.HierarchicalNSW("cosine", dimension);
    index.initIndex(1000); // Initialize index with a maximum of 1000 elements
  } catch (error) {
    console.error("Error initializing VectorStore:", error);
    throw new Error("Failed to initialize VectorStore");
  }

  const textToVector = (text: string): number[] => {
    try {
      const encoded = encoder.encode(text);
      const vector = new Array(dimension).fill(0);
      for (let i = 0; i < encoded.length && i < dimension; i++) {
        vector[i] = encoded[i] / 100; // Simple normalization
      }
      return vector;
    } catch (error) {
      console.error("Error converting text to vector:", error);
      throw new Error("Failed to convert text to vector");
    }
  };

  const addItem = (item: ContextItem) => {
    try {
      if (!item || typeof item.content !== "string") {
        console.error("Invalid item:", item);
        return;
      }
      const vector = textToVector(item.content);
      const tokenCount = encoder.encode(item.content).length;

      // Remove old items if adding this would exceed the token limit
      while (currentTokens + tokenCount > maxTokens && items.length > 0) {
        const removedItem = items.shift();
        if (removedItem) {
          currentTokens -= encoder.encode(removedItem.content).length;
        }
      }

      const id = items.length;
      index.addPoint(vector, id);
      items.push(item);
      currentTokens += tokenCount;
    } catch (error) {
      console.error("Error adding item to VectorStore:", error);
    }
  };

  const getRelevantContext = (query: string, k: number = 5): ContextItem[] => {
    try {
      if (items.length === 0) {
        return [];
      }
      const queryVector = textToVector(query);
      const results = index.searchKnn(queryVector, Math.min(k, items.length));
      if (!results || !Array.isArray(results.neighbors)) {
        return [];
      }
      return results.neighbors.map(
        (id) =>
          items[id] || {
            role: "system",
            content: "Context item not found",
          }
      );
    } catch (error) {
      console.error("Error getting relevant context:", error);
      return [];
    }
  };

  return { addItem, getRelevantContext };
};

let vectorStore: VectorStore;

try {
  vectorStore = createVectorStore();
} catch (error) {
  console.error("Error creating VectorStore:", error);
  throw new Error("Failed to create VectorStore");
}

export function addContext(item: ContextItem) {
  const existingItems = vectorStore.getRelevantContext(item.content);
  if (
    !existingItems.some(
      (existingItem) =>
        existingItem.role === item.role && existingItem.content === item.content
    )
  ) {
    vectorStore.addItem(item);
  }
}

export function getContext(query: string): ContextItem[] {
  return vectorStore.getRelevantContext(query);
}

export function clearContext() {
  vectorStore = createVectorStore();
}
