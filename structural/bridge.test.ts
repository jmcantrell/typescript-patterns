import {
  Circle,
  EnglishRenderer,
  Rectangle,
  ShapeRenderer,
  SvgRenderer,
  Vec2,
} from "./bridge.ts";
import { assertEquals } from "std/testing/asserts.ts";

const size = new Vec2(30, 40);
const location = new Vec2(10, 20);
const circle = new Circle(location, "red", 5);
const rectangle = new Rectangle(location, "blue", size);

Deno.test("SvgRenderer", () => {
  const renderer = new SvgRenderer();
  assertEquals(
    new ShapeRenderer(circle, renderer).render(),
    '<circle cx="10" cy="20" fill="red" r="5" />',
  );
  assertEquals(
    new ShapeRenderer(rectangle, renderer).render(),
    '<rect x="10" y="20" fill="blue" width="30" height="40" />',
  );
});

Deno.test("EnglishRenderer", () => {
  const renderer = new EnglishRenderer();
  assertEquals(
    new ShapeRenderer(circle, renderer).render(),
    "a red circle with its center at x=10 y=20 and a radius of 5",
  );
  assertEquals(
    new ShapeRenderer(rectangle, renderer).render(),
    "a blue rectangle with its top-left at x=10 y=20 and width=30 height=40",
  );
});
