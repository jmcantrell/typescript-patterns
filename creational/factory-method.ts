// https://en.wikipedia.org/wiki/Factory_method_pattern

export interface Character {
  greet: (name: string) => string;
}

export class CowboyCharacter implements Character {
  greet(name: string): string {
    return `Howdy, ${name}!`;
  }
}

export class RobotCharacter implements Character {
  greet(name: string): string {
    return `Beep boop. Greetings, ${name}.`;
  }
}

export class PirateCharacter implements Character {
  greet(name: string): string {
    return `Ahoy, ${name}!`;
  }
}

export enum Theme {
  Cowboy,
  Robot,
  Pirate,
}

export class CharacterFactory {
  theme: Theme;

  constructor(theme: Theme) {
    this.theme = theme;
  }

  createCharacter(): Character {
    switch (this.theme) {
      case Theme.Cowboy:
        return new CowboyCharacter();
      case Theme.Robot:
        return new RobotCharacter();
      case Theme.Pirate:
        return new PirateCharacter();
      default:
        throw new Error(`invalid theme: ${this.theme}`);
    }
  }
}
