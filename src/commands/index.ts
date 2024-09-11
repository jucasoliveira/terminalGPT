/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";

export interface Plugin {
  name: string;
  keyword: string;
  description: string;
  execute: (context: any) => Promise<any>; // Changed from (context: string) => Promise<void>
}

const plugins: Plugin[] = [];

const loadPlugins = () => {
  const pluginDir = path.join(__dirname);
  const files = fs.readdirSync(pluginDir);

  // Clear existing plugins to prevent duplicates on reload
  plugins.length = 0;

  const loadedPlugins = new Set<string>(); // To track loaded plugins

  files.forEach((file) => {
    if (file.endsWith(".ts") && file !== "index.ts") {
      const pluginPath = path.join(pluginDir, file);
      const pluginName = path.basename(file, ".ts");

      // Check if plugin has already been loaded
      if (!loadedPlugins.has(pluginName)) {
        try {
          const plugin = require(pluginPath).default;
          if (isValidPlugin(plugin)) {
            plugins.push(plugin);
            loadedPlugins.add(pluginName);
          } else {
            console.warn(`Invalid plugin structure in ${file}`);
          }
        } catch (error) {
          console.error(`Error loading plugin ${file}:`, error);
        }
      }
    }
  });
};

const isValidPlugin = (plugin: any): plugin is Plugin => {
  return (
    plugin &&
    typeof plugin.name === "string" &&
    typeof plugin.keyword === "string" &&
    typeof plugin.description === "string" &&
    typeof plugin.execute === "function"
  );
};

export const getPlugins = (): Plugin[] => {
  return plugins;
};

export const findPlugin = (userInput: string): Plugin | undefined => {
  return plugins.find((plugin) => userInput.startsWith(plugin.keyword));
};

export const executePlugin = async (
  plugin: Plugin,
  context: any
): Promise<any> => {
  return await plugin.execute(context);
};

export const initializePlugins = () => {
  loadPlugins();
};

// Load plugins when this module is imported
initializePlugins();
