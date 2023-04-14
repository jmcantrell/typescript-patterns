import { createTransformingMultiplexer } from "./module.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";

Deno.test("createTransformingMultiplexer", () => {
  const transform_spy = spy((input: number) => (input * 2).toString());
  const multiplexer = createTransformingMultiplexer(transform_spy);

  assertEquals(multiplexer.size(), 0);

  multiplexer.publish(3);
  assertSpyCalls(transform_spy, 0);

  const num_subscribers = 3;
  const subscriber_spies = [];
  const unsubscribes = [];

  for (let i = 0; i < num_subscribers; i++) {
    const subscriber_spy = spy();
    subscriber_spies.push(subscriber_spy);
    unsubscribes.push(multiplexer.subscribe(subscriber_spy));
  }

  assertEquals(multiplexer.size(), num_subscribers);
  assertEquals(subscriber_spies.length, num_subscribers);
  assertEquals(unsubscribes.length, num_subscribers);

  multiplexer.publish(3);
  assertSpyCalls(transform_spy, 1);

  for (const subscriber_spy of subscriber_spies) {
    assertSpyCalls(subscriber_spy, 1);
    assertSpyCall(subscriber_spy, 0, { args: ["6"] });
  }

  unsubscribes[0]();
  assertEquals(multiplexer.size(), 2);

  multiplexer.publish(4);
  assertSpyCalls(transform_spy, 2);

  // This one is unsubscribed, so should not have been called.
  assertSpyCalls(subscriber_spies[0], 1);

  // The rest should have been called, though.
  for (let i = 1; i < num_subscribers; i++) {
    assertSpyCalls(subscriber_spies[i], 2);
    assertSpyCall(subscriber_spies[i], 1, { args: ["8"] });
    unsubscribes[i]();
  }

  assertEquals(multiplexer.size(), 0);
});
