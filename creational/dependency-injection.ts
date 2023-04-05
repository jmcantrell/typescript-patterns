// https://en.wikipedia.org/wiki/Dependency_injection

export interface Logger {
  info: (text: string) => void;
  warn: (text: string) => void;
  error: (text: string) => void;
}

export class DefaultLogger implements Logger {
  log(prefix: string, text: string): void {
    console.log(`${new Date()}: ${prefix.toUpperCase()}: ${text}`);
  }

  info(text: string): void {
    this.log("info", text);
  }

  warn(text: string): void {
    this.log("warn", text);
  }

  error(text: string): void {
    this.log("error", text);
  }
}

export class Service {
  #logger: Logger;

  constructor(options: { logger?: Logger } = {}) {
    this.#logger = options.logger || new DefaultLogger();
  }

  run(): void {
    this.#logger.info("did a thing");
    this.#logger.warn("did a questionable thing");
    this.#logger.error("did a dangerous thing");
  }
}
