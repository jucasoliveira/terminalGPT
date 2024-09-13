import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import {
  encrypt,
  decrypt,
  getCredentials,
  saveCredentials,
  deleteCredentials,
} from "../src/creds";

describe("Encryption and Decryption", () => {
  it("should return a string in the format 'IV:encrypted_text'", () => {
    const result = encrypt("test");
    expect(result).to.be.a("string");
    expect(result).to.include(":");
  });

  it("should return a different result each time it is called", () => {
    const result1 = encrypt("test");
    const result2 = encrypt("test");
    expect(result1).to.not.equal(result2);
  });

  it("should return the original input text when given a valid encrypted string", () => {
    const encrypted = encrypt("test");
    const decrypted = decrypt(encrypted);
    expect(decrypted).to.equal("test");
  });

  it("should handle invalid encrypted strings correctly", () => {
    expect(decrypt("invalid:string")).to.equal("invalid:string");
    expect(decrypt("invalidstring")).to.equal("invalidstring");
    expect(decrypt("")).to.be.null;
  });
});

describe("Credentials Management", () => {
  const credentialsPath = path.resolve(__dirname, "../src/credentials.json");

  beforeEach(() => {
    deleteCredentials();
  });

  afterEach(() => {
    deleteCredentials();
  });

  it("should return null values if credentials have not been saved", () => {
    const result = getCredentials();
    expect(result).to.deep.equal({
      apiKey: null,
      engine: null,
      model: null,
      tavilyApiKey: null,
    });
  });

  it("should save and retrieve credentials correctly", () => {
    saveCredentials("testApiKey", "testEngine", "model", "testTavilyApiKey");
    const result = getCredentials();
    expect(result).to.deep.equal({
      apiKey: "testApiKey",
      engine: "testEngine",
      model: "model",
      tavilyApiKey: "testTavilyApiKey",
    });
  });

  it("should encrypt the API key when saving", () => {
    saveCredentials("testApiKey", "testEngine", "model", "testTavilyApiKey");
    const rawData = fs.readFileSync(credentialsPath, "utf-8");
    const savedCredentials = JSON.parse(rawData);
    expect(savedCredentials.apiKey).to.not.equal("testApiKey");
    expect(decrypt(savedCredentials.apiKey)).to.equal("testApiKey");
  });
});
