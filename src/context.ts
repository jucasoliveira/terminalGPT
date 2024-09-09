/* eslint-disable @typescript-eslint/no-explicit-any */
import { encoding_for_model, TiktokenModel } from "@dqbd/tiktoken";
import hnswlib from "hnswlib-node";

export interface ContextItem {
  role: string;
  content: string;
}

class VectorStore {
  private index: hnswlib.HierarchicalNSW;
  private items: ContextItem[];
  private encoder: any;
  private maxTokens: number;
  private currentTokens: number;
  private readonly dimension: number = 1536; // Fixed dimension size

  constructor(
    model: TiktokenModel = "gpt-3.5-turbo",
    maxTokens: number = 4096
  ) {
    try {
      this.encoder = encoding_for_model(model);
      this.index = new hnswlib.HierarchicalNSW("cosine", this.dimension);
      this.index.initIndex(1000); // Initialize index with a maximum of 1000 elements
      this.items = [];
      this.maxTokens = maxTokens;
      this.currentTokens = 0;
    } catch (error) {
      console.error("Error initializing VectorStore:", error);
      throw new Error("Failed to initialize VectorStore");
    }
  }

  addItem(item: ContextItem) {
    try {
      if (!item || typeof item.content !== "string") {
        console.error("Invalid item:", item);
        return;
      }
      const vector = this.textToVector(item.content);
      const tokenCount = this.encoder.encode(item.content).length;

      // Remove old items if adding this would exceed the token limit
      while (
        this.currentTokens + tokenCount > this.maxTokens &&
        this.items.length > 0
      ) {
        const removedItem = this.items.shift();
        if (removedItem) {
          this.currentTokens -= this.encoder.encode(removedItem.content).length;
        }
      }

      const id = this.items.length;
      this.index.addPoint(vector, id);
      this.items.push(item);
      this.currentTokens += tokenCount;
    } catch (error) {
      console.error("Error adding item to VectorStore:", error);
    }
  }

  getRelevantContext(query: string, k: number = 5): ContextItem[] {
    try {
      if (this.items.length === 0) {
        // console.log("No items in context");
        return [];
      }
      const queryVector = this.textToVector(query);
      const results = this.index.searchKnn(
        queryVector,
        Math.min(k, this.items.length)
      );
      if (!results || !Array.isArray(results.neighbors)) {
        // console.error("Unexpected result from searchKnn:", results);
        return [];
      }
      return results.neighbors.map(
        (id) =>
          this.items[id] || {
            role: "system",
            content: "Context item not found",
          }
      );
    } catch (error) {
      console.error("Error getting relevant context:", error);
      return [];
    }
  }

  private textToVector(text: string): number[] {
    try {
      const encoded = this.encoder.encode(text);
      const vector = new Array(this.dimension).fill(0);
      for (let i = 0; i < encoded.length && i < this.dimension; i++) {
        vector[i] = encoded[i] / 100; // Simple normalization
      }
      return vector;
    } catch (error) {
      console.error("Error converting text to vector:", error);
      throw new Error("Failed to convert text to vector");
    }
  }
}

let vectorStore: VectorStore;

try {
  vectorStore = new VectorStore();
} catch (error) {
  console.error("Error creating VectorStore:", error);
  throw new Error("Failed to create VectorStore");
}

export function addContext(item: ContextItem) {
  // console.log("Adding context:", item); // Debug log
  const existingItems = vectorStore.getRelevantContext(item.content);
  if (
    !existingItems.some(
      (existingItem) =>
        existingItem.role === item.role && existingItem.content === item.content
    )
  ) {
    vectorStore.addItem(item);
  } else {
    // console.log("Skipping duplicate context item");
  }
}

export function getContext(query: string): ContextItem[] {
  // console.log("Getting context for query:", query); // Debug log
  return vectorStore.getRelevantContext(query);
}

export function clearContext() {
  // console.log("Clearing context"); // Debug log
  vectorStore = new VectorStore();
}
