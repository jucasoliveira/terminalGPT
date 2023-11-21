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
 * Saves a custom URL to a file.
 *
 * @param {string | undefined} url - The custom URL to be saved. If undefined, the file is deleted.
 * @return {void}
 */
export function saveCustomUrl(url: string | undefined) {
  if (url === undefined) {
    fs.unlinkSync(`${__dirname}/customUrl.txt`);
  } else {
    fs.writeFileSync(`${__dirname}/customUrl.txt`, url);
  }
}

/**
 * Retrieves a custom URL from a text file if it exists.
 *
 * @return {string | undefined} The custom URL if it exists, otherwise undefined.
 */
export function getCustomUrl(): string | undefined {
  if (fs.existsSync(`${__dirname}/customUrl.txt`)) {
    return fs.readFileSync(`${__dirname}/customUrl.txt`, "utf8");
  }
  return undefined;
}

/**
 * Saves the API key to a file.
 *
 * @param {string} apiKey - The API key to save.
 * @return {void} This function does not return anything.
 */
export function saveApiKey(apiKey: string) {
  fs.writeFileSync(`${__dirname}/apiKey.txt`, apiKey);
}

/**
 * Deletes the API key file if it exists.
 *
 * @return {boolean} Returns true if the API key file was deleted, false otherwise.
 */
export function deleteApiKey() {
  const apiKeyFilePath = `${__dirname}/apiKey.txt`;
  if (fs.existsSync(apiKeyFilePath)) {
    fs.unlinkSync(apiKeyFilePath);
    return true;
  }
  return false;
}

/**
 * Retrieves the API key from the "apiKey.txt" file, decrypts it, and returns it.
 *
 * @return {string | null} The decrypted API key, or null if the file does not exist.
 */
export function getApiKey(): string | null {
  if (fs.existsSync(`${__dirname}/apiKey.txt`)) {
    const getEncryptedScript = fs.readFileSync(
      `${__dirname}/apiKey.txt`,
      "utf8"
    );
    return decrypt(getEncryptedScript);
  }
  return null;
}
