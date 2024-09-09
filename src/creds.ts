import * as fs from "fs";

import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = "terminalGPT";

/**
 * Encrypts the given text using the specified algorithm, secret key, and initialization vector.
 *
 * @param {string} text - The text to be encrypted.
 * @return {string} The encrypted text in the format: IV:encryptedText.
 */
export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypts the given text using a specific algorithm and secret key.
 *
 * @param {string} text - The text to be decrypted.
 * @return {string} - The decrypted text.
 */
export function decrypt(text: string) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
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
  tavilyApiKey: string
) {
  const credentials = { apiKey: encrypt(apiKey), engine, tavilyApiKey };
  fs.writeFileSync(
    `${__dirname}/credentials.json`,
    JSON.stringify(credentials)
  );
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
} {
  if (fs.existsSync(`${__dirname}/credentials.json`)) {
    const data = fs.readFileSync(`${__dirname}/credentials.json`, "utf8");
    const { apiKey, engine, tavilyApiKey } = JSON.parse(data);
    return {
      apiKey: apiKey ? decrypt(apiKey) : null,
      engine,
      tavilyApiKey: tavilyApiKey || null,
    };
  }
  return { apiKey: null, engine: null, tavilyApiKey: null };
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
