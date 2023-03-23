import { withLogging } from "./decorator.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { assertSpyCall, spy } from "std/testing/mock.ts";

Deno.test("withLogging", () => {
  const logSpy = spy();
  console.log = logSpy;

  function add(a: number, b: number): number {
    return a + b;
  }

  assertEquals(withLogging(add)(1, 2), 3);
  assertSpyCall(logSpy, 0, { args: ["running function add..."] });
});
