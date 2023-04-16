import { Application, Copy, Cut, Paste, SelectAll, Undo } from "./command.ts";
import { assertEquals } from "std/testing/asserts.ts";

function createApp(): Application {
  const app = new Application();

  const cut = new Cut();
  app.setButton("cut", cut);
  app.addKeyBinding("ctrl+x", cut);

  const copy = new Copy();
  app.setButton("copy", copy);
  app.addKeyBinding("ctrl+c", copy);

  const paste = new Paste();
  app.setButton("paste", paste);
  app.addKeyBinding("ctrl+v", paste);

  const undo = new Undo();
  app.setButton("undo", undo);
  app.addKeyBinding("ctrl+z", undo);

  const selectAll = new SelectAll();
  app.addKeyBinding("ctrl+a", selectAll);

  app.buffers.active.setText("Hello, world!");

  return app;
}

Deno.test("Copy", () => {
  const app = createApp();

  app.pressKey("ctrl+a");
  app.pressKey("ctrl+c");
  assertEquals(app.clipboard, "Hello, world!");

  app.buffers.active.setSelection(0, 5);
  app.clickButton("copy");
  assertEquals(app.clipboard, "Hello");
});

Deno.test("Cut", () => {
  const app = createApp();

  app.buffers.active.setSelection(0, 5);
  app.pressKey("ctrl+x");
  assertEquals(app.clipboard, "Hello");
  assertEquals(app.buffers.active.getText(), ", world!");

  app.pressKey("ctrl+a");
  app.clickButton("cut");
  assertEquals(app.clipboard, ", world!");
  assertEquals(app.buffers.active.getText(), "");
});

Deno.test("Paste", () => {
  const app = createApp();

  app.pressKey("ctrl+a");
  app.pressKey("ctrl+x");
  assertEquals(app.clipboard, "Hello, world!");

  app.buffers.active.setText("><");
  app.buffers.active.setSelection(1);
  app.pressKey("ctrl+v");
  assertEquals(app.buffers.active.getText(), ">Hello, world!<");
});

Deno.test("Undo", () => {
  const app = createApp();
  assertEquals(app.buffers.active.getText(), "Hello, world!");

  app.pressKey("ctrl+a");
  app.pressKey("ctrl+x");
  assertEquals(app.buffers.active.getText(), "");

  app.pressKey("ctrl+z");
  assertEquals(app.buffers.active.getText(), "Hello, world!");

  app.buffers.active.setSelection(0, 5);
  app.pressKey("ctrl+x");
  assertEquals(app.buffers.active.getText(), ", world!");

  app.clickButton("undo");
  assertEquals(app.buffers.active.getText(), "Hello, world!");
});
