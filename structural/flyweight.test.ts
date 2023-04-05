import { Forest } from "./flyweight.ts";
import { assertEquals } from "std/testing/asserts.ts";

function renderedTree(name: string, id: number): string {
  return `${name} tree: much data so expensive: ${id}`;
}

Deno.test("Forest", () => {
  const forest = new Forest();

  forest.plant_tree("fir");
  forest.plant_tree("redwood");
  forest.plant_tree("fir");
  forest.plant_tree("fir");
  forest.plant_tree("redwood");

  assertEquals(
    forest.render(),
    [
      renderedTree("fir", 1),
      renderedTree("redwood", 2),
      renderedTree("fir", 1), // should reuse type id
      renderedTree("fir", 1), // should reuse type id
      renderedTree("redwood", 2), // should reuse type id
    ].join("\n"),
  );
});
