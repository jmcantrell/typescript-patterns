// https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern

export type Handler<Input> = (input: Input) => boolean;

export class HandlerStack<Input> {
  #stack: Array<Handler<Input> | HandlerStack<Input>>;

  constructor() {
    this.#stack = [];
  }

  addHandler(handler: Handler<Input> | HandlerStack<Input>) {
    this.#stack.push(handler);
  }

  handle(input: Input): boolean {
    for (const handler of this.#stack) {
      if (handler instanceof HandlerStack) {
        if (!handler.handle(input)) return false;
      } else {
        if (!handler(input)) return false;
      }
    }
    return true;
  }
}
