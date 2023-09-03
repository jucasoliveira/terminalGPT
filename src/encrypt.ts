import * as fs from "fs";

import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = "terminalGPT";

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(secretKey, "salt", 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

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

export function saveCustomUrl(url: string | undefined) {
    if (url === undefined) {
        fs.unlinkSync(`${__dirname}/customUrl.txt`);
    } else {
        fs.writeFileSync(`${__dirname}/customUrl.txt`, url);
    }
}

export function getCustomUrl(): string | undefined {
    if (fs.existsSync(`${__dirname}/customUrl.txt`)) {
        return fs.readFileSync(
            `${__dirname}/customUrl.txt`,
            "utf8"
        );
    }
    return undefined
}

export function saveApiKey(apiKey: string) {
    fs.writeFileSync(`${__dirname}/apiKey.txt`, apiKey);
}

export function deleteApiKey() {
    fs.unlinkSync(`${__dirname}/apiKey.txt`);
}

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