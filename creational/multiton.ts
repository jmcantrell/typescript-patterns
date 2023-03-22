export type Fetcher<T> = (key: string) => T | undefined;

export class Cache<T> {
  #items: Map<string, T | undefined>;
  #recent: Array<string>;
  #max_items: number;
  #fetcher: Fetcher<T>;

  constructor(max_items: number, fetcher: Fetcher<T>) {
    this.#items = new Map();
    this.#recent = [];
    this.#max_items = max_items;
    this.#fetcher = fetcher;
  }

  get(key: string): T | undefined {
    if (!this.#items.has(key)) {
      while (this.#recent.length >= this.#max_items) {
        this.#items.delete(this.#recent.shift()!);
      }
      this.#items.set(key, this.#fetcher(key));
      this.#recent.push(key);
    }
    return this.#items.get(key);
  }

  get keys(): Array<string> {
    return this.#recent;
  }

  get size(): number {
    return this.#items.size;
  }
}
