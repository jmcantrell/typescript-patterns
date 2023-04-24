export function* zip<A, B>(
  a_items: Iterable<A>,
  b_items: Iterable<B>,
): Generator<[A, B]> {
  const a_iter = a_items[Symbol.iterator]();
  const b_iter = b_items[Symbol.iterator]();

  while (true) {
    const a_item = a_iter.next();
    const b_item = b_iter.next();

    if (a_item.done || b_item.done) return;

    yield [a_item.value, b_item.value];
  }
}

export function* zip_longest<A, B>(
  a_items: Iterable<A>,
  b_items: Iterable<B>,
): Generator<[A | undefined, B | undefined]> {
  const a_iter = a_items[Symbol.iterator]();
  const b_iter = b_items[Symbol.iterator]();

  while (true) {
    const a_item = a_iter.next();
    const b_item = b_iter.next();

    if (a_item.done && b_item.done) return;

    const a_value = a_item.done ? undefined : a_item.value;
    const b_value = b_item.done ? undefined : b_item.value;

    yield [a_value, b_value];
  }
}

export function* enumerate<T>(
  items: Iterable<T>,
  start: number = 0,
): Generator<[number, T]> {
  yield* zip(count(start), items);
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

export function* repeat<T>(value: T, times = Infinity): Generator<T> {
  while (times--) yield value;
}

export function* cycle<T>(items: Iterable<T>, times = Infinity): Generator<T> {
  while (times--) {
    for (const item of items) {
      yield item;
    }
  }
}

export function* range(
  lower: number,
  upper?: number,
  step = 1,
): Generator<number> {
  if (upper === undefined || upper === null) {
    upper = lower;
    lower = 0;
  }
  for (let current = lower; current < upper; current += step) {
    yield current;
  }
}

export function* count(index = 0): Generator<number> {
  while (true) yield index++;
}
