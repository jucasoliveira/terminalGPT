/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import clearPlugin from "../src/commands/clear";
import exitPlugin from "../src/commands/exit";
import chalk from "chalk";

// Force chalk to enable color output in test environment
chalk.level = 1;

describe("Clear Plugin", () => {
  let originalStdoutWrite: typeof process.stdout.write;

  beforeEach(() => {
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
  });

  it("should have the correct name, keyword, and description", () => {
    expect(clearPlugin.name).toBe("clear");
    expect(clearPlugin.keyword).toBe("@clear");
    expect(clearPlugin.description).toBe("Clears the terminal screen");
  });

  it("should clear the terminal screen when executed", async () => {
    const result = await clearPlugin.execute({});
    expect(process.stdout.write).toHaveBeenCalledWith("\x1Bc");
    expect(result).toBe("Terminal screen cleared.");
  });
});

describe("Exit Plugin", () => {
  let consoleLogSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number) => {
        throw new Error(`Process.exit called with code: ${code}`);
      });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it("should have the correct name, keyword, and description", () => {
    expect(exitPlugin.name).toBe("exit");
    expect(exitPlugin.keyword).toBe("@exit");
    expect(exitPlugin.description).toBe("Exits the application");
  });

  it("should log goodbye message and exit the process when executed", async () => {
    await expect(exitPlugin.execute({})).rejects.toThrow(
      "Process.exit called with code: 0"
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Goodbye!")
    );
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });
});
