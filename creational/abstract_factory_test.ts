import { HtmlFactory, MarkdownFactory } from "./abstract_factory.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("HtmlFactory", () => {
  const factory = new HtmlFactory();
  assertEquals(
    factory.createLink("My Cool Site", "http://cool.io/~me").render(),
    '<a href="http://cool.io/~me">My Cool Site</a>',
  );
  assertEquals(
    factory.createHeading(0, "My Cool Page").render(),
    "<h1>My Cool Page</h1>",
  );
  assertEquals(
    factory.createHeading(1, "About Me").render(),
    "<h2>About Me</h2>",
  );
});

Deno.test("MarkdownFactory", () => {
  const factory = new MarkdownFactory();
  assertEquals(
    factory.createLink("My Cool Site", "http://cool.io/~me").render(),
    "[My Cool Site](http://cool.io/~me)",
  );
  assertEquals(
    factory.createHeading(0, "My Cool Page").render(),
    "= My Cool Page",
  );
  assertEquals(
    factory.createHeading(1, "About Me").render(),
    "== About Me",
  );
});
