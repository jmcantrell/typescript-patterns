import { Config, JsonConfig, MapConfig } from "./object_adapter.ts";
import { assertEquals } from "std/testing/asserts.ts";

function testConfig(config: Config) {
  assertEquals(config.get("foo"), "a");
  assertEquals(config.get("bar"), "b");
  assertEquals(config.get("baz"), "c");
  assertEquals(config.get("qux"), undefined);
  config.set("qux", "d");
  assertEquals(config.get("qux"), "d");
}

Deno.test("JsonConfig", () => {
  testConfig(new JsonConfig('{"foo":"a","bar":"b","baz":"c"}'));
});

Deno.test("MapConfig", () => {
  const map = new Map<string, string>();
  map.set("foo", "a");
  map.set("bar", "b");
  map.set("baz", "c");
  testConfig(new MapConfig(map));
});
