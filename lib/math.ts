export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function progress(value: number, lower: number, upper: number): number {
  return (value - lower) / (upper - lower);
}
