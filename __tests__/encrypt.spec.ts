import * as crypto from "../src/encrypt";

import fs from "fs";

import * as path from "path";

import {expect} from "chai";

describe("encrypt()", () => {
    it("should return a string in the format 'IV:encrypted_text'", () => {
        const result = crypto.encrypt("test");
        expect(result).to.match(/^[a-f0-9]{32}:([a-f0-9]{2})*$/);
    });

    it("should return a different result each time it is called", () => {
        const result1 = crypto.encrypt("test");
        const result2 = crypto.encrypt("test");
        expect(result1).not.equal(result2);
    });
});

describe("decrypt()", () => {
    it("should return the original input text when given a valid encrypted string", () => {
        const encrypted = crypto.encrypt("test");
        const result = crypto.decrypt(encrypted);
        expect(result).to.equal("test");
    });

    it("should throw an error when given an invalid encrypted string", () => {
        expect(() => crypto.decrypt("invalid")).to.throw();
    });
});

describe("Api Key ", () => {
    // the path to the apiKey.txt file should point to ../src/apiKey.txt
    const apiKeyPath = path.resolve(__dirname, "../src/apiKey.txt");

    const removeLink = () => {
        try {
            fs.unlinkSync(apiKeyPath)
        } catch { /* empty */
        }
    }

    beforeEach(removeLink)
    afterEach(removeLink)

    it("should return null if the API key has not been saved", () => {
        const result = crypto.getApiKey();
        expect(result).to.equal(null);
    });

    it("should return the API key if it has been saved", () => {
        const encrypted = crypto.encrypt("test");
        crypto.saveApiKey(encrypted)
        const result = crypto.getApiKey();
        expect(result).to.equal("test");
    });

    it("should save the given API key to a file", () => {
        if (!fs.existsSync(apiKeyPath)) {
            fs.writeFileSync(apiKeyPath, "");
        }
        const encryptedText = crypto.encrypt("test");
        crypto.saveApiKey(encryptedText);
        const result = crypto.getApiKey()// fs.readFileSync(apiKeyPath, "utf8");

        expect(result).to.equal("test");
    });
});
