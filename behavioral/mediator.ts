// https://en.wikipedia.org/wiki/Mediator_pattern

type Key = string;
type Index = number;

export type Username = string;
export type Message = [Date, Username, string];

export class ChatClient {
  #server: ChatServer;
  #key: Key;
  #username: Username;
  #index: Index;

  constructor(server: ChatServer, key: Key, username: Username, index: Index) {
    this.#server = server;
    this.#key = key;
    this.#username = username;
    this.#index = index;
  }

  username(): string {
    return this.#username;
  }

  toString(): string {
    return this.username();
  }

  disconnect() {
    this.#server.disconnect(this.#key);
  }

  update(): Array<Message> {
    const messages = this.#server.update(this.#key, this.#index);
    this.#index += messages.length;
    return messages;
  }

  send(text: string) {
    this.#server.send(this.#key, text);
  }
}

export class ChatServer {
  #history: Array<Message>;
  #keys: Map<Username, Key>;
  #usernames: Map<Key, Username>;

  constructor() {
    this.#history = [];
    this.#keys = new Map();
    this.#usernames = new Map();
  }

  authenticate(key: Key): Username {
    const username = this.#usernames.get(key);

    if (username === undefined) {
      throw new Error(`client key does not exist: ${key}`);
    }

    return username;
  }

  connect(username: Username): ChatClient {
    if (this.#keys.has(username)) {
      throw new Error(`username is taken: ${username}`);
    }

    const key: Key = crypto.randomUUID();

    // New clients will see messages sent after connecting.
    const client = new ChatClient(this, key, username, this.#history.length);

    this.#keys.set(username, key);
    this.#usernames.set(key, username);

    return client;
  }

  connected(): Iterable<Username> {
    return this.#usernames.values();
  }

  disconnect(key: Key) {
    const username = this.authenticate(key);
    this.#keys.delete(key);
    this.#usernames.delete(username);
  }

  update(key: Key, index: Index): Array<Message> {
    this.authenticate(key);
    return this.#history.slice(index);
  }

  send(key: Key, text: string) {
    const username = this.authenticate(key);
    this.#history.push([new Date(), username, text]);
  }
}
