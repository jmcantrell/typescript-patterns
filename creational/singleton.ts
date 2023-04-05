// https://en.wikipedia.org/wiki/Singleton_pattern

export class Connection {
  static #instance?: string;

  constructor() {
    if (!Connection.#instance) {
      Connection.#instance = "connected";
    }
  }

  instance(): string {
    return Connection.#instance!;
  }
}
