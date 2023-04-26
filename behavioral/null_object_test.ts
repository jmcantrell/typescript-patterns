import { ConcreteUser, NullUser, User } from "./null_object.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { FakeTime } from "std/testing/time.ts";

Deno.test("NullUser => ConcreteUser", () => {
  const time = new FakeTime();

  try {
    let user: User = NullUser;

    const username = "lucy";
    const profile_image = "cat-by-window.png";

    const loadUser = () => {
      user = new ConcreteUser(username, profile_image);
    };

    const assertLoading = () => {
      assertEquals(user.username, "loading...");
      assertEquals(user.profile_image, "placeholder.png");
    };

    const assertLoaded = () => {
      assertEquals(user.username, username);
      assertEquals(user.profile_image, profile_image);
    };

    assertLoading();

    setTimeout(loadUser, 1000);
    assertLoading();

    time.tick(500);
    assertLoading();

    time.tick(500);
    assertLoaded();
  } finally {
    time.restore();
  }
});
