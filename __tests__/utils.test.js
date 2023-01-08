const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

const { apiKeyPrompt } = require("../bin/utils");
const { encrypt } = require("../bin/encrypt");

describe("apiKeyPromt()", () => {
  const apiKeyPath = path.resolve(__dirname, "../bin/apiKey.txt");

  beforeEach(() => {
    if (!fs.existsSync(apiKeyPath)) {
      fs.writeFileSync(apiKeyPath, encrypt("test"));
    }
  });

  it("should return a string", async () => {
    const result = await apiKeyPrompt().then((res) =>
      expect(res).to.be.a("string")
    );
  });
});
