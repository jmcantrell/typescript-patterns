// https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern

type Channel = string;
type Subscriber<T> = (channel: Channel, value: T) => void;
type Unsubscriber = () => void;

export class Broker<T> {
  #subscribers: Map<Channel, Set<Subscriber<T>>>;

  constructor() {
    this.#subscribers = new Map();
  }

  publish(channel: Channel, message: T) {
    for (const subscriber of this.#subscribers.get(channel) || []) {
      subscriber(channel, message);
    }
  }

  subscribe(channel: Channel, subscriber: Subscriber<T>): Unsubscriber {
    if (!this.#subscribers.has(channel)) {
      this.#subscribers.set(channel, new Set());
    }
    this.#subscribers.get(channel)!.add(subscriber);
    return () => {
      const subscribers = this.#subscribers.get(channel)!;
      subscribers.delete(subscriber);
      if (subscribers.size == 0) {
        this.#subscribers.delete(channel);
      }
    };
  }
}
