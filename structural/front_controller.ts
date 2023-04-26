// https://en.wikipedia.org/wiki/Front_controller

export type Request = string;
export type Response = string;
export type Handler = (request: Request) => Response;

export function not_found(request: Request): Response {
  throw new Error(`not found: ${request}`);
}

export class Router {
  #fallback: Handler;
  #routes: Array<[string, Handler]>;

  constructor(fallback?: Handler) {
    this.#fallback = fallback || not_found;
    this.#routes = [];
  }

  addRoute(prefix: string, handler: Handler) {
    this.#routes.push([prefix, handler]);
  }

  route(request: Request): Response {
    for (const [prefix, handler] of this.#routes) {
      if (request == prefix || request.startsWith(prefix + "/")) {
        return handler(request.slice(prefix.length));
      }
    }
    return this.#fallback(request);
  }
}
