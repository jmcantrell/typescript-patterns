import {
  BananaSplit,
  Cone,
  ConeType,
  Flavor,
  IceCreamDessert,
  Topping,
} from "./builder.ts";
import { assertEquals, assertStrictEquals } from "std/testing/asserts.ts";

function testIceCreamDessert(ctor: () => IceCreamDessert, expected: string) {
  assertEquals(ctor().build(), expected);

  assertStrictEquals(
    ctor().addScoops(Flavor.Vanilla, 1).build(),
    `${expected} with 1 scoop of vanilla`,
  );

  assertStrictEquals(
    ctor().addScoops(Flavor.Chocolate, 2).build(),
    `${expected} with 2 scoops of chocolate`,
  );

  assertStrictEquals(
    ctor().addScoops(Flavor.Strawberry, 3).build(),
    `${expected} with 3 scoops of strawberry`,
  );

  assertEquals(
    ctor().addScoops(Flavor.Vanilla, 1).addScoops(Flavor.Chocolate, 2).build(),
    `${expected} with 1 scoop of vanilla and 2 scoops of chocolate`,
  );

  assertEquals(
    ctor().addScoops(Flavor.Vanilla, 1).addScoops(Flavor.Chocolate, 2)
      .addScoops(Flavor.Strawberry, 3).build(),
    `${expected} with 1 scoop of vanilla and 2 scoops of chocolate and 3 scoops of strawberry`,
  );

  assertStrictEquals(
    ctor().addTopping(Topping.HotFudge).build(),
    `${expected} with hot fudge`,
  );

  assertStrictEquals(
    ctor().addTopping(Topping.Sprinkles).build(),
    `${expected} with sprinkles`,
  );

  assertStrictEquals(
    ctor().addTopping(Topping.WhipCream).build(),
    `${expected} with whip cream`,
  );

  assertEquals(
    ctor().addTopping(Topping.HotFudge).addTopping(Topping.Sprinkles).build(),
    `${expected} with hot fudge and sprinkles`,
  );

  assertEquals(
    ctor().addTopping(Topping.HotFudge).addTopping(Topping.Sprinkles)
      .addTopping(Topping.WhipCream).build(),
    `${expected} with hot fudge and sprinkles and whip cream`,
  );

  assertEquals(
    ctor().addScoops(Flavor.Chocolate, 1).addTopping(Topping.Sprinkles)
      .addScoops(Flavor.Strawberry, 2).build(),
    `${expected} with 1 scoop of chocolate and 2 scoops of strawberry and sprinkles`,
  );
}

Deno.test("BananaSplit", () => {
  for (let n = 1; n < 4; n++) {
    testIceCreamDessert(() => new BananaSplit(n), `a ${n}-banana split`);
  }
});

Deno.test("Cone", () => {
  testIceCreamDessert(() => new Cone(ConeType.Sugar), "a sugar cone");
  testIceCreamDessert(() => new Cone(ConeType.Waffle), "a waffle cone");
});
