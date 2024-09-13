import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

const algorithm = "aes-256-cbc";
const secretKeyFile = path.join(__dirname, "secret_key.txt");

// Function to generate and save a secret key
function generateAndSaveSecretKey(): string {
  const secretKey = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(secretKeyFile, secretKey, "utf8");
  return secretKey;
}

// Function to get or create the secret key
function getSecretKey(): string {
  if (fs.existsSync(secretKeyFile)) {
    return fs.readFileSync(secretKeyFile, "utf8");
  } else {
    return generateAndSaveSecretKey();
  }
}

const secretKey = getSecretKey();

function isEncrypted(text: string): boolean {
  return text.includes(":") && /^[0-9a-f]+:[0-9a-f]+$/.test(text);
}

/**
 * Encrypts the given text using the specified algorithm, secret key, and initialization vector.
 *
 * @param {string} text - The text to be encrypted.
 * @return {string} The encrypted text in the format: IV:encryptedText.
 */
export function encrypt(text: string): string {
  if (isEncrypted(text)) {
    return text;
  }
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts the given text using a specific algorithm and secret key.
 *
 * @param {string} text - The text to be decrypted.
 * @return {string} - The decrypted text.
 */
export function decrypt(text: string | undefined): string | null {
  if (!text) {
    return null;
  }

  if (!isEncrypted(text)) {
    return text;
  }

  const [ivHex, encryptedHex] = text.split(":");
  if (!ivHex || !encryptedHex) {
    return null;
  }

  try {
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const key = crypto.scryptSync(secretKey, "salt", 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const result = decrypted.toString("utf8");
    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

/**
 * Retrieves the API engine from the "engine.txt" file.
 *
 * @return {string | null} The API engine if the file exists, otherwise null.
 */
export function getEngine(): string | null {
  if (fs.existsSync(`${__dirname}/engine.txt`)) {
    const getEngine = fs.readFileSync(`${__dirname}/engine.txt`, "utf8");
    return getEngine;
  }
  return null;
}

/**
 * Saves the API key and engine to a JSON file.
 *
 * @param {string} apiKey - The API key to save.
 * @param {string} engine - The API engine to save.
 * @return {void} This function does not return anything.
 */
export function saveCredentials(
  apiKey: string,
  engine: string,
  model: string,
  tavilyApiKey?: string
) {
  const credentials = {
    apiKey: encrypt(apiKey),
    engine,
    tavilyApiKey: tavilyApiKey ? encrypt(tavilyApiKey) : undefined,
    model,
  };
  fs.writeFileSync(
    `${__dirname}/credentials.json`,
    JSON.stringify(credentials, null, 2)
  );
  console.log("Credentials saved successfully");
}

/**
 * Retrieves the API key and engine from the "credentials.json" file.
 *
 * @return {{ apiKey: string | null, engine: string | null, tavilyApiKey: string | null }} The API key and engine, or null if the file does not exist.
 */
export function getCredentials(): {
  apiKey: string | null;
  engine: string | null;
  tavilyApiKey: string | null;
  model: string | null;
} {
  if (fs.existsSync(`${__dirname}/credentials.json`)) {
    try {
      const data = fs.readFileSync(`${__dirname}/credentials.json`, "utf8");
      const { apiKey, engine, tavilyApiKey, model } = JSON.parse(data);
      return {
        apiKey: apiKey ? decrypt(apiKey) : null,
        engine: engine || null,
        tavilyApiKey: tavilyApiKey ? decrypt(tavilyApiKey) : null,
        model: model || null,
      };
    } catch (error) {
      console.error("Error reading or parsing credentials:", error);
      return { apiKey: null, engine: null, tavilyApiKey: null, model: null };
    }
  }
  console.log("Credentials file not found");
  return { apiKey: null, engine: null, tavilyApiKey: null, model: null };
}

/**
 * Deletes the credentials file if it exists.
 *
 * @return {boolean} Returns true if the credentials file was deleted, false otherwise.
 */
export function deleteCredentials() {
  const credentialsFilePath = `${__dirname}/credentials.json`;
  if (fs.existsSync(credentialsFilePath)) {
    fs.unlinkSync(credentialsFilePath);
    return true;
  }
  return false;
}
