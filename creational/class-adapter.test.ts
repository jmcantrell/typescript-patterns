import { Base64Decoder, ByteDecoder } from "./class-adapter.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("Base64Decoder", () => {
  assertEquals(new Base64Decoder(btoa("test")).read(), "test");
});

Deno.test("ByteDecoder", () => {
  assertEquals(
    new ByteDecoder(new TextEncoder().encode("test")).read(),
    "test",
  );
});
