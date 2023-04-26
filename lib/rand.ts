export function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randIntBetween(min: number, max: number): number {
  return min + randInt(max);
}

export function shuffle<T>(items: Array<T>) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
}

export function randChoice<T>(items: Array<T>): T | undefined {
  return items[randIntBetween(0, items.length)];
}
