import { Lazy } from "./lazy_initialization.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { assertSpyCalls, spy } from "std/testing/mock.ts";

Deno.test("Lazy", () => {
  const result = 5;
  const init = spy(() => result);
  const lazy = new Lazy(init);

  assertEquals(lazy.value, result);
  assertEquals(lazy.value, result);

  assertSpyCalls(init, 1);
});
