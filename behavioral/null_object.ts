// https://en.wikipedia.org/wiki/Null_object_pattern

export interface User {
  username: string;
  profile_image: string;
}

export const NullUser: User = {
  username: "loading...",
  profile_image: "placeholder.png",
};

export class ConcreteUser implements User {
  username: string;
  profile_image: string;

  constructor(username: string, profile_image: string) {
    this.username = username;
    this.profile_image = profile_image;
  }
}
