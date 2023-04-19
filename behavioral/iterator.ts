// https://en.wikipedia.org/wiki/Iterator_pattern

export type Enumerated<T> = [number, T];

export function* enumerate<T>(items: Iterable<T>): Generator<Enumerated<T>> {
  let index = 0;
  for (const item of items) {
    yield [index++, item];
  }
}

export function createEnumerate<T>(items: Iterable<T>): Iterable<Enumerated<T>> {
  let index = 0;
  const inner_iter = items[Symbol.iterator]();

  const iter: Iterator<Enumerated<T>> = {
    next(): IteratorResult<Enumerated<T>> {
      const { value, done } = inner_iter.next();
      return done
        ? { value: undefined, done }
        : { value: [index++, value], done };
    },
  };

  return {
    [Symbol.iterator](): Iterator<Enumerated<T>> {
      return iter;
    },
  };
}

export class Enumerate<T> implements Iterable<Enumerated<T>> {
  #items: Iterable<T>;

  constructor(items: Iterable<T>) {
    this.#items = items;
  }

  [Symbol.iterator](): Iterator<Enumerated<T>> {
    let index = 0;
    const inner_iter = this.#items[Symbol.iterator]();
    return {
      next(): IteratorResult<Enumerated<T>> {
        const { value, done } = inner_iter.next();
        return done
          ? { value: undefined, done }
          : { value: [index++, value], done };
      },
    };
  }
}
