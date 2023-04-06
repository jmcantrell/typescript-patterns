// https://en.wikipedia.org/wiki/Proxy_pattern

export type Fetcher<Input, Output> = (input: Input) => Output | Promise<Output>;

export class CachingProxy<Input, Output> {
  #fetcher: Fetcher<Input, Output>;
  #storage: Map<Input, Output>;
  #history: Array<Input>;
  #capacity: number;

  constructor(fetcher: Fetcher<Input, Output>, capacity: number = Infinity) {
    this.#fetcher = fetcher;
    this.#storage = new Map();
    this.#history = [];
    this.#capacity = capacity;
  }

  async get(input: Input): Promise<Output> {
    if (!this.#storage.has(input)) {
      if (this.#storage.size >= this.#capacity) {
        this.#storage.delete(this.#history.shift()!);
      }
      this.#storage.set(input, await this.#fetcher(input));
      this.#history.push(input);
    }
    return this.#storage.get(input)!;
  }

  capacity(): number {
    return this.#capacity;
  }

  size(): number {
    return this.#storage.size;
  }
}
