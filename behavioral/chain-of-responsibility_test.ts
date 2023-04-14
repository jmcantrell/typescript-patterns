import { HandlerStack } from "./chain-of-responsibility.ts";
import { assert } from "std/testing/asserts.ts";

Deno.test("HandlerStack with no handlers", () => {
  const stack = new HandlerStack();
  assert(stack.handle({}));
});

Deno.test("HandlerStack with handlers", () => {
  type Input = Record<string, unknown>;

  const stack = new HandlerStack<Input>();

  for (const key of ["foo", "bar", "baz"]) {
    stack.addHandler((input) => key in input);
  }

  const input: Input = {};
  assert(!stack.handle(input));

  input.foo = "test";
  assert(!stack.handle(input));

  input.bar = "test";
  assert(!stack.handle(input));

  // Now that input has all the keys, it will pass.
  input.baz = "test";
  assert(stack.handle(input));
});

Deno.test("Nested HandlerStack", () => {
  type Input = Record<string, Record<string, unknown>>;

  const stack = new HandlerStack<Input>();

  const keys = ["foo", "bar", "baz"];
  const sub_keys = ["a", "b", "c"];

  for (const key of keys) {
    const sub_stack = new HandlerStack<Input>();
    for (const sub_key of sub_keys) {
      sub_stack.addHandler((input) => key in input && sub_key in input[key]);
    }
    stack.addHandler(sub_stack);
  }

  const input: Input = {};
  assert(!stack.handle(input));

  for (const key of keys) {
    input[key] = {};
  }
  assert(!stack.handle(input));

  for (const key of keys) {
    for (const sub_key of sub_keys) {
      input[key][sub_key] = "test";
    }
  }
  assert(stack.handle(input));
});
