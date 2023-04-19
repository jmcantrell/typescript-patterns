export function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randIntRange(min: number, max: number): number {
  return min + randInt(max);
}
