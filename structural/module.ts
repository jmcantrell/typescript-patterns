// https://en.wikipedia.org/wiki/Module_pattern

export type Send<Data> = (data: Data) => void;
export type Publish<Data> = Send<Data>;
export type Subscriber<Data> = Send<Data>;
export type Unsubscribe = () => void;
export type Subscribe<Data> = (subscriber: Subscriber<Data>) => Unsubscribe;

export type Transform<Input, Output> = (input: Input) => Output;

export interface TransformingMultiplexer<Input, Output> {
  size: () => number;
  publish: Publish<Input>;
  subscribe: Subscribe<Output>;
}

export function createTransformingMultiplexer<
  Data,
  Input = Data,
  Output = Input,
>(
  transform: Transform<Input, Output>,
): TransformingMultiplexer<Input, Output> {
  const subscribers = new Set<Subscriber<Output>>();

  function size(): number {
    return subscribers.size;
  }

  function publish(data: Input) {
    if (subscribers.size == 0) return;
    const transformed_data = transform(data);
    for (const subscriber of subscribers) {
      subscriber(transformed_data);
    }
  }

  function subscribe(subscriber: Subscriber<Output>): Unsubscribe {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }

  return { size, publish, subscribe };
}
