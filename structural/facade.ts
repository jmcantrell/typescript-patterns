export class HttpError extends Error {
  constructor(status: number, message: string) {
    super(`request failed: ${message}`);
    this.name = "HttpError";
    this.cause = { status, message };
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export class RestAPI {
  base: string;

  constructor(base: string) {
    this.base = base;
  }

  async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.base}/${path}`, options);

    if (response.status >= 400) {
      throw new HttpError(response.status, await response.text());
    }

    return await response.json();
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return await this.fetch<T>(path, { method: "GET", ...options });
  }

  async me(): Promise<User> {
    return await this.get<User>("users/me");
  }

  async friends(username: string): Promise<User[]> {
    return await this.get<User[]>(`users/friends?username=${username}`);
  }
}
