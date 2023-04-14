import { Cache } from "./multiton.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("Cache", () => {
  const max_items = 3;

  const data = new Map();
  data.set("foo", 1);
  data.set("bar", 2);
  data.set("baz", 3);
  data.set("qux", 4);

  const fetcher = spy((key: string) => data.get(key));
  const cache = new Cache(max_items, fetcher);

  function assertValue(key: string) {
    const value = data.get(key);
    assertEquals(cache.get(key), value);
    return value;
  }

  function assertNoFetch(key: string) {
    const numCalls = fetcher.calls.length;
    assertValue(key);
    assertSpyCalls(fetcher, numCalls);
  }

  function assertNoFetches() {
    cache.keys.forEach(assertNoFetch);
  }

  function assertFetch(key: string) {
    const numCalls = fetcher.calls.length;
    const value = assertValue(key);
    assertSpyCalls(fetcher, numCalls + 1);
    assertSpyCall(fetcher, numCalls, { args: [key], returned: value });
  }

  function assertSingleFetch(key: string) {
    assertFetch(key);
    assertNoFetches();
  }

  assertEquals(cache.size, 0);
  assertEquals(cache.keys, []);

  assertSingleFetch("foo");
  assertEquals(cache.size, 1);
  assertEquals(cache.keys, ["foo"]);

  assertSingleFetch("bar");
  assertEquals(cache.size, 2);
  assertEquals(cache.keys, ["foo", "bar"]);

  assertSingleFetch("baz");
  assertEquals(cache.size, 3);
  assertEquals(cache.keys, ["foo", "bar", "baz"]);

  assertSingleFetch("qux");
  assertEquals(cache.size, 3);
  assertEquals(cache.keys, ["bar", "baz", "qux"]);
});
