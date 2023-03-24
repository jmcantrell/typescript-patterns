import { Circle, Rectangle, Scaled, Vector } from "./delegate.ts";
import { assertAlmostEquals, assertEquals } from "std/testing/asserts.ts";

const origin: Vector = [0, 0];
const circle = new Circle(origin, 5);
const rectangle = new Rectangle(origin, [10, 20]);

Deno.test("Circle", () => {
  assertAlmostEquals(circle.area(), 78.53981633974483);
  assertAlmostEquals(circle.perimeter(), 31.41592653589793);
});

Deno.test("Rectangle", () => {
  assertEquals(rectangle.area(), 200);
  assertEquals(rectangle.perimeter(), 60);
});

Deno.test("Scaled", () => {
  const factor = 10;
  const scaled_circle = new Scaled(circle, factor);
  const scaled_rectangle = new Scaled(rectangle, factor);
  assertAlmostEquals(scaled_circle.area(), 785.3981633974483);
  assertAlmostEquals(scaled_circle.perimeter(), 314.1592653589793);
  assertEquals(scaled_rectangle.area(), 2000);
  assertEquals(scaled_rectangle.perimeter(), 600);
});
