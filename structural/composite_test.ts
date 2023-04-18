import { Container, Heading, Link, Paragraph } from "./composite.ts";
import { assertEquals } from "std/testing/asserts.ts";
import lipsum from "../lib/testing/lipsum.ts";

Deno.test("Document", () => {
  const text = lipsum();

  const body = new Container(
    new Heading(0, "About Me"),
    new Paragraph(text),
    new Heading(1, "Biography"),
    new Paragraph(text),
    new Link("http://coo.io/~me", "Home"),
  );

  const expected = [
    "<h1>About Me</h1>",
    `<p>${text}</p>`,
    "<h2>Biography</h2>",
    `<p>${text}</p>`,
    '<a href="http://coo.io/~me">Home</a>',
  ].join("\n");

  assertEquals(body.render(), expected);
});
