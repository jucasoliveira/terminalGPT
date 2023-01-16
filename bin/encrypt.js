const fs = require("fs");
const crypto = require("crypto");

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
  fs.writeFileSync(`${__dirname}/apiKey.txt`, apiKey);
};

const deleteApiKey = () => {
  fs.unlinkSync(`${__dirname}/apiKey.txt`);
};

const getApiKey = () => {
  if (fs.existsSync(`${__dirname}/apiKey.txt`)) {
    const getEncryptedScript = fs.readFileSync(
      `${__dirname}/apiKey.txt`,
      "utf8"
    );
    const decryptedScript = decrypt(getEncryptedScript);
    return decryptedScript;
  }
  return null;
};

module.exports = { encrypt, decrypt, saveApiKey, getApiKey, deleteApiKey };
