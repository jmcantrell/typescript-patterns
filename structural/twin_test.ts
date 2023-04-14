import { Twin } from "./twin.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("Twin", () => {
  const [a, b] = Twin.pair("foo");

  assertEquals(a.value, "foo");
  assertEquals(b.value, "foo");

  a.value = "bar";
  assertEquals(a.value, "bar");
  assertEquals(b.value, "foo");

  a.update();
  assertEquals(a.value, "bar");
  assertEquals(b.value, "bar");

  b.value = "baz";
  assertEquals(a.value, "bar");
  assertEquals(b.value, "baz");

  b.update();
  assertEquals(a.value, "baz");
  assertEquals(b.value, "baz");
});

Deno.test("Twin.set", () => {
  const [a, b] = Twin.pair("foo");

  a.set("bar");
  assertEquals(a.value, "bar");
  assertEquals(b.value, "bar");

  b.set("baz");
  assertEquals(a.value, "baz");
  assertEquals(b.value, "baz");
});
