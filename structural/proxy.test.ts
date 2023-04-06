import { CachingProxy } from "./proxy.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";

const data: Record<string, number> = {};
const num_items = 10;

for (let i = 0; i < num_items; i++) {
  data[`item ${i}`] = i;
}

Deno.test("CachingProxy", async () => {
  const fetcher_spy = spy((key: string): number => data[key]);
  const proxy = new CachingProxy(fetcher_spy);

  assertSpyCalls(fetcher_spy, 0);
  assertEquals(proxy.size(), 0);
  assertEquals(proxy.capacity(), Infinity);

  for (let i = 0; i < num_items; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
    assertSpyCall(fetcher_spy, fetcher_spy.calls.length - 1, {
      args: [`item ${i}`],
      returned: i,
    });
  }

  // Should have fetched every item.
  assertSpyCalls(fetcher_spy, num_items);
  assertEquals(proxy.size(), num_items);

  for (let i = 0; i < num_items; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
  }

  // Shoul not have fetched any more items, as they're all cached.
  assertSpyCalls(fetcher_spy, num_items);
  assertEquals(proxy.size(), num_items);
});

Deno.test("CachingProxy with capacity", async () => {
  const capacity = 5;

  const fetcher_spy = spy((key: string): number => data[key]);
  const proxy = new CachingProxy(fetcher_spy, capacity);

  assertSpyCalls(fetcher_spy, 0);
  assertEquals(proxy.size(), 0);
  assertEquals(proxy.capacity(), capacity);

  for (let i = 0; i < capacity; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
    assertSpyCall(fetcher_spy, fetcher_spy.calls.length - 1, {
      args: [`item ${i}`],
      returned: i,
    });
  }

  assertSpyCalls(fetcher_spy, capacity);
  assertEquals(proxy.size(), capacity);
  assertEquals(proxy.capacity(), capacity);

  for (let i = 0; i < capacity; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
  }

  // Should not have fetched any more items, up to capacity.
  assertSpyCalls(fetcher_spy, capacity);

  for (let i = capacity; i < num_items; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
    assertSpyCall(fetcher_spy, fetcher_spy.calls.length - 1, {
      args: [`item ${i}`],
      returned: i,
    });
    // Size should stay the same, as the LRU item is replaced.
    assertEquals(proxy.size(), capacity);
  }

  // Should have fetched the remaining items.
  assertSpyCalls(fetcher_spy, num_items);

  // Ensure newly added items don't refetch.
  for (let i = capacity; i < num_items; i++) {
    assertEquals(await proxy.get(`item ${i}`), i);
  }

  // Ensure no fetches were done.
  assertSpyCalls(fetcher_spy, num_items);
});
