const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const algorithm = "aes-256-cbc";
const secretKey = "terminalGPT";

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const saveApiKey = (apiKey) => {
  const scriptPath = process.argv[1];
  const apiKeyPath = path.resolve(path.dirname(scriptPath), "apiKey.txt");
  fs.writeFileSync(apiKeyPath, apiKey);
};

const getApiKey = () => {
  const scriptPath = process.argv[1];
  const apiKeyPath = path.resolve(path.dirname(scriptPath), "apiKey.txt");
  if (fs.existsSync(apiKeyPath)) {
    const getEncryptedScript = fs.readFileSync(apiKeyPath, "utf8");
    const decryptedScript = decrypt(getEncryptedScript);
    return decryptedScript;
  }
  return null;
};

module.exports = { encrypt, decrypt, saveApiKey, getApiKey };
