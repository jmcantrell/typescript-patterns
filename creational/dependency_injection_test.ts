import { Logger, Service } from "./dependency_injection.ts";
import { assertEquals } from "std/testing/asserts.ts";

class MockLogger implements Logger {
  entries: Array<[string, string]>;

  constructor() {
    this.entries = [];
  }

  info(text: string) {
    this.entries.push(["info", text]);
  }

  warn(text: string) {
    this.entries.push(["warn", text]);
  }

  error(text: string) {
    this.entries.push(["error", text]);
  }
}

Deno.test("Service", () => {
  const logger = new MockLogger();
  const service = new Service({ logger });
  service.run();
  assertEquals(logger.entries, [
    ["info", "did a thing"],
    ["warn", "did a questionable thing"],
    ["error", "did a dangerous thing"],
  ]);
});
