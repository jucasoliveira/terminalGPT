import * as path from "path";

import fs from "fs";

import { expect } from "chai";

import { apiKeyPrompt /*, generateResponse*/ } from "../src/utils";

import { encrypt } from "../src/creds";

describe("apiKeyPrompt()", () => {
  const credentialsPath = path.resolve(__dirname, "../src/credentials.json");

  beforeEach(() => {
    if (!fs.existsSync(credentialsPath)) {
      fs.writeFileSync(
        credentialsPath,
        JSON.stringify({
          apiKey: encrypt("test"),
          engine: "test",
          model: "test",
          tavilyApiKey: encrypt("test"),
        })
      );
    }
  });

  it("the api key prompt to user should return an object with apiKey and engine", async () => {
    const result = await apiKeyPrompt();
    expect(result).to.be.an("object");
    expect(result).to.have.property("apiKey");
    expect(result).to.have.property("engine");
    expect(result).to.have.property("model");
  });
});

// FIXME cannot be executed without a real api key
// describe("generateResponse()", () => {
//     //generate response will receive a input and generate a respone
//     beforeEach(() => {
//         jest.mock("openai", () => {
//             const Configuration = jest.fn().mockImplementation(() => {
//                 return {
//                     apiKey: "abc",
//                 };
//             });
//             const OpenAIApi = jest.fn().mockImplementation(() => {
//                 return {
//                     createCompletion: jest.fn().mockImplementation(() => {
//                         return {
//                             data: {
//                                 choices: [
//                                     {
//                                         text: "abc",
//                                     },
//                                 ],
//                             },
//                         };
//                     }),
//                 };
//             });
//             return {
//                 Configuration,
//                 OpenAIApi,
//             };
//         });
//
//         jest.mock("ora", () => {
//             return jest.fn().mockImplementation(() => {
//                 return {
//                     start: jest.fn(),
//                     stop: jest.fn(),
//                 };
//             });
//         });
//     });

// it("Should create a instance of Configuration", async () => {
//     const
//         apiKey = "abx",
//         prompt = jest.fn(),
//         options = {},
//         response = {
//             data: {
//                 choices: ["abc", "def"],
//             },
//         }
//
//     const getResponse = await generateResponse(
//         apiKey,
//         prompt,
//         options,
//         response
//     )
//
//     // expect(getResponse).throw(Error)
//     expect(getResponse).to.be.a("string");
// });
// });
