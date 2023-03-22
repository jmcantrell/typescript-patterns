import { Connection } from "./singleton.ts";
import { assertStrictEquals } from "std/testing/asserts.ts";

Deno.test("Connection", () => {
  assertStrictEquals(
    (new Connection()).instance(),
    (new Connection()).instance(),
  );
});
