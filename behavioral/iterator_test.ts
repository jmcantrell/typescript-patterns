import { createEnumerate, Enumerate, enumerate } from "./iterator.ts";
import type { Enumerated } from "./iterator.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { count, repeat, zip } from "../lib/iter.ts";
import { randIntRange } from "../lib/rand.ts";

type TestCase<T> = [Iterable<T>, Iterable<Enumerated<T>>];

const item = "test";
const numItems = randIntRange(5, 20);
const items = Array.from(repeat(item, numItems));

const testCases: Array<TestCase<unknown>> = [
  [[], []],
  ["abc", [[0, "a"], [1, "b"], [2, "c"]]],
  [["foo", "bar", "baz"], [[0, "foo"], [1, "bar"], [2, "baz"]]],
  [items, Array.from(zip(count(), items))],
];

Deno.test("enumerate", () => {
  for (const [items, expected] of testCases) {
    assertEquals(Array.from(enumerate(items)), expected);
  }
});

Deno.test("createEnumerate", () => {
  for (const [items, expected] of testCases) {
    assertEquals(Array.from(createEnumerate(items)), expected);
  }
});

Deno.test("Enumerate", () => {
  for (const [items, expected] of testCases) {
    assertEquals(Array.from(new Enumerate(items)), expected);
  }
});
