import { ChatServer } from "./mediator.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { randChoice, randIntBetween } from "../lib/rand.ts";
import { map, range } from "../lib/iter.ts";

Deno.test("connected clients", () => {
  const server = new ChatServer();

  assertEquals(Array.from(server.connected()), []);

  const usernames = ["pat", "leslie", "chris"];
  const clients = usernames.map((username) => server.connect(username));

  assertEquals(Array.from(server.connected()), usernames);
  assertEquals(clients.map((client) => client.username()), usernames);
});

Deno.test("client only receives updates since last update", () => {
  const server = new ChatServer();
  const usernames = ["pat", "leslie", "chris"];
  const clients = usernames.map((username) => server.connect(username));

  assertEquals(clients.map((client) => client.update()), [[], [], []]);

  for (const sender of clients) {
    const texts = Array.from(map(
      range(randIntBetween(1, 5)),
      (j: number) => `message #${j + 1} from ${sender.username()}`,
    ));

    texts.forEach((text) => sender.send(text));

    for (const receiver of clients) {
      const received = receiver.update();
      assertEquals(received.length, texts.length);

      for (let j = 0; j < received.length; j++) {
        // Ensure the username of sender.
        assertEquals(received[j][1], sender.username());
        // Enusre the message received.
        assertEquals(received[j][2], texts[j]);
      }

      // Ensure no more updates.
      assertEquals(receiver.update(), []);
    }
  }
});

Deno.test("client receives updates in the order they are sent", () => {
  const server = new ChatServer();
  const usernames = ["pat", "leslie", "chris"];
  const clients = usernames.map((username) => server.connect(username));

  const expectedUsernames = [];
  const expectedTexts = [];
  const numTotalMessages = randIntBetween(5, 20);

  for (const i of range(numTotalMessages)) {
    const sender = randChoice(clients)!;
    const numMessages = randIntBetween(1, 5);
    for (const j of range(numMessages)) {
      const text = `#${i + 1}, #${j + 1} from ${sender.username()}`;
      expectedUsernames.push(sender.username());
      expectedTexts.push(text);
      sender.send(text);
    }
  }

  for (const receiver of clients) {
    const received = receiver.update();
    assertEquals(received.length, expectedTexts.length);
    for (let i = 0; i < received.length; i++) {
      // Ensure the username of sender.
      assertEquals(received[i][1], expectedUsernames[i]);
      // Enusre the message received.
      assertEquals(received[i][2], expectedTexts[i]);
    }
  }
});
