// https://en.wikipedia.org/wiki/Decorator_pattern

// deno-lint-ignore no-explicit-any
export type SyncFunction<T> = (...args: any[]) => T;

export function withLogging<T>(fn: SyncFunction<T>): SyncFunction<T> {
  // deno-lint-ignore no-explicit-any
  return (...args: any[]): T => {
    console.log(`running function ${fn.name}...`);
    return fn(...args);
  };
}
