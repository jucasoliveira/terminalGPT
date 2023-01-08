const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

const { apiKeyPrompt, generateResponse } = require("../bin/utils");
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

xdescribe("generateResponse()", () => {
  //generate response will receive a input and generate a respone
  beforeEach(() => {
    jest.mock("openai", () => {
      const Configuration = jest.fn().mockImplementation(() => {
        return {
          apiKey: "abc",
        };
      });
      const OpenAIApi = jest.fn().mockImplementation(() => {
        return {
          createCompletion: jest.fn().mockImplementation(() => {
            return {
              data: {
                choices: [
                  {
                    text: "abc",
                  },
                ],
              },
            };
          }),
        };
      });
      return {
        Configuration,
        OpenAIApi,
      };
    });

    jest.mock("ora", () => {
      return jest.fn().mockImplementation(() => {
        return {
          start: jest.fn(),
          stop: jest.fn(),
        };
      });
    });
  });

  it("Should create a instance of Configuration", async () => {
    const apiKey = "abx",
      prompt = jest.fn(),
      options = {},
      response = {
        data: {
          choices: ["abc", "def"],
        },
      },
      context = "";

    const getResponse = await generateResponse(
      apiKey,
      prompt,
      options,
      response,
      context
    );
    expect(getResponse).to.be.a("string");
  });
});
