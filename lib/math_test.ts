import * as math from "./math.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("clamp", () => {
  assertEquals(math.clamp(0, 0, 0), 0);
  assertEquals(math.clamp(0, 1, 0), 0);
  assertEquals(math.clamp(0, 0, 1), 0);
  assertEquals(math.clamp(0, 1, 2), 1);
  assertEquals(math.clamp(3, 1, 2), 2);
});

Deno.test("progress", () => {
  assertEquals(math.progress(0, 0, 100), 0.0);
  assertEquals(math.progress(25, 0, 100), 0.25);
  assertEquals(math.progress(50, 0, 100), 0.5);
  assertEquals(math.progress(75, 0, 100), 0.75);
  assertEquals(math.progress(100, 0, 100), 1.0);
  assertEquals(math.progress(1, 0, 2), 0.5);
  assertEquals(math.progress(0, -2, 2), 0.5);
  assertEquals(math.progress(-1, -2, 2), 0.25);
  assertEquals(math.progress(1, -2, 2), 0.75);
  assertEquals(math.progress(2, -2, 2), 1.0);
});
