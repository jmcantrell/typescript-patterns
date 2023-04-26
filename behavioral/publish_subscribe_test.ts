import { Broker } from "./publish_subscribe.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";

Deno.test("Subscribers only receive messages on requested channels", () => {
  const broker = new Broker<string>();

  const subscriber_spy = spy(() => {});
  const unsubscribe_b = broker.subscribe("b", subscriber_spy);
  const unsubscribe_c = broker.subscribe("c", subscriber_spy);

  const expected = "hey there";

  broker.publish("a", expected);
  assertSpyCalls(subscriber_spy, 0);

  broker.publish("b", expected);
  assertSpyCalls(subscriber_spy, 1);
  assertSpyCall(subscriber_spy, 0, { args: ["b", expected] });

  broker.publish("c", expected);
  assertSpyCalls(subscriber_spy, 2);
  assertSpyCall(subscriber_spy, 1, { args: ["c", expected] });

  unsubscribe_b();
  broker.publish("b", expected);
  assertSpyCalls(subscriber_spy, 2);

  unsubscribe_c();
  broker.publish("c", expected);
  assertSpyCalls(subscriber_spy, 2);
});
