import { CharacterFactory, Theme } from "./factory-method.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("CharacterFactory", () => {
  const name = "Jane";
  assertEquals(
    new CharacterFactory(Theme.Pirate).createCharacter().greet(name),
    "Ahoy, Jane!",
  );
  assertEquals(
    new CharacterFactory(Theme.Cowboy).createCharacter().greet(name),
    "Howdy, Jane!",
  );
  assertEquals(
    new CharacterFactory(Theme.Robot).createCharacter().greet(name),
    "Beep boop. Greetings, Jane.",
  );
});
