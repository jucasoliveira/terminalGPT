const crypto = require("../bin/encrypt");
const fs = require("fs");
const { expect } = require("chai");
const path = require("path");

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

describe("saveApiKey()", () => {
  const apiKeyPath = path.resolve(__dirname, "../bin/apiKey.txt");

  beforeEach(() => {
    if (!fs.existsSync(apiKeyPath)) {
      fs.writeFileSync(apiKeyPath, "");
    }
  });
  it("should save the given API key to a file", async () => {
    const encryptedText = crypto.encrypt("test");
    await crypto.saveApiKey(encryptedText);
    const result = fs.readFileSync(apiKeyPath, "utf8");
    expect(result).to.equal(encryptedText);
  });
  afterEach(() => {
    fs.unlinkSync(apiKeyPath);
  });
});

describe("getApiKey()", () => {
  // the path to the apiKey.txt file should point to ../bin/apiKey.txt
  const apiKeyPath = path.resolve(__dirname, "../bin/apiKey.txt");
  const encryptedText = crypto.encrypt("test");

  it("should return the API key if it has been saved", () => {
    fs.writeFileSync(apiKeyPath, encryptedText);
    const result = crypto.getApiKey();
    expect(result).to.equal("test");
  });

  it("should return null if the API key has not been saved", () => {
    fs.unlinkSync(apiKeyPath);
    const result = crypto.getApiKey();
    expect(result).to.equal(null);
  });
});
