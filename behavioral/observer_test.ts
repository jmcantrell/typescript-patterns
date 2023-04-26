import { Subject } from "./observer.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";
import { randIntBetween } from "../lib/rand.ts";
import { map, range } from "../lib/iter.ts";

Deno.test("Subject", () => {
  const subject = new Subject("a");

  const num_observers = randIntBetween(2, 5);

  const observers = Array.from(
    map(range(num_observers), () => spy(() => {})),
  );

  for (const observer of observers) {
    assertSpyCalls(observer, 0);
  }

  const unsubscribes = observers.map((observer) => subject.subscribe(observer));

  for (const observer of observers) {
    assertSpyCalls(observer, 1);
    assertSpyCall(observer, 0, { args: ["a"] });
  }

  subject.set("b");

  for (const observer of observers) {
    assertSpyCalls(observer, 2);
    assertSpyCall(observer, 1, { args: ["b"] });
  }

  for (const unsubscribe of unsubscribes) {
    unsubscribe();
  }

  subject.set("c");

  for (const observer of observers) {
    assertSpyCalls(observer, 2);
    assertSpyCall(observer, 1, { args: ["b"] });
  }
});
