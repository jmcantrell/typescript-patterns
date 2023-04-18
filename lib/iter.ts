export type Enumerated<T> = [number, T];

export function* enumerate<T>(items: Iterable<T>): Generator<Enumerated<T>> {
  let i = 0;
  for (const item of items) {
    yield [i++, item];
  }
}

export function* map<A, B>(
  items: Iterable<A>,
  fn: (value: A) => B,
): Generator<B> {
  for (const value of items) {
    yield fn(value);
  }
}

export function* flatten<T>(items: Iterable<Iterable<T>>): Generator<T> {
  for (const outer of items) {
    for (const inner of outer) {
      yield inner;
    }
  }
}

export function* groupBy<T, K = T>(
  items: Iterable<T>,
  getKey: (item: T) => K = (item: T) => item as unknown as K,
): Generator<T[]> {
  let currentKey: K | undefined;
  let group: T[] = [];
  for (const item of items) {
    const key = getKey(item);
    if (currentKey !== key && currentKey !== undefined) {
      yield group;
      group = [];
    }
    group.push(item);
    currentKey = key;
  }
  if (group.length > 0) yield group;
}
