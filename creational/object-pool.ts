// https://en.wikipedia.org/wiki/Object_pool_pattern

export type Creator<T> = (id: number) => T;

export interface Lease<T> {
  value: T;
  release: () => void;
}

export class ObjectPool<T> {
  #items: Set<T>;
  #available: Array<T>;
  #acquired: Set<T>;

  constructor(max_items: number, create: Creator<T>) {
    this.#items = new Set();
    this.#acquired = new Set();
    this.#available = [];

    for (let id = 0; id < max_items; id++) {
      const item = create(id);
      this.#items.add(item);
      this.#available.push(item);
    }
  }

  get available(): number {
    return this.#available.length;
  }

  get acquired(): number {
    return this.#acquired.size;
  }

  acquire(): T | null {
    if (this.#available.length == 0) {
      return null;
    }
    const item = this.#available.shift()!;
    this.#acquired.add(item);
    return item;
  }

  release(item: T) {
    if (!this.#items.has(item)) {
      throw new Error(`invalid item: ${item}`);
    }
    this.#acquired.delete(item);
    this.#available.push(item);
  }
}
