import { ObjectPool } from "./object_pool.ts";
import {
  assertEquals,
  assertMatch,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";
import { assertSpyCalls, spy } from "std/testing/mock.ts";

Deno.test("ObjectPool", () => {
  const max_items = 3;
  const create = spy((id: number) => `object-${id}`);
  const pool = new ObjectPool(max_items, create);

  assertSpyCalls(create, max_items);

  assertEquals(pool.acquired, 0);
  assertEquals(pool.available, max_items);

  const validObject = /^object-\d+$/;

  const items = [];

  for (let i = 0; i < max_items; i++) {
    const item = pool.acquire()!;

    assertMatch(item, validObject);
    items.push(item);

    assertEquals(pool.acquired, items.length);
    assertEquals(pool.available, max_items - items.length);
  }

  assertStrictEquals(pool.acquire(), null);

  // Valid object, but an id that does not belong to the pool.
  assertThrows(() => pool.release(`object-${max_items}`));

  while (items.length > 0) {
    pool.release(items.pop()!);
    assertEquals(pool.acquired, items.length);
    assertEquals(pool.available, max_items - items.length);
  }
});
