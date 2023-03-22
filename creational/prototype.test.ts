import { Chromosome } from "./prototype.ts";
import { assertEquals, assertNotEquals, assertNotStrictEquals } from "std/testing/asserts.ts";

Deno.test("Chromosome", () => {
  const chromosome = new Chromosome("gattaca");
  const clone = chromosome.clone();

  assertEquals(chromosome, clone);
  assertNotStrictEquals(chromosome, clone);

  clone.splice(1, 1, "atta");

  assertEquals(clone.toString(), "GATTATTACA");
  assertNotEquals(chromosome, clone);
});
