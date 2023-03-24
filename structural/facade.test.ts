import { RestAPI, User } from "./facade.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { assertSpyCall, returnsNext, Stub, stub } from "std/testing/mock.ts";

// deno-lint-ignore no-explicit-any
function createJsonResponse(status: number, data: any): Promise<Response> {
  return new Promise((resolve) => {
    return resolve(
      new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "text/json" },
      }),
    );
  });
}

function stubFetchNext(
  // deno-lint-ignore no-explicit-any
  returns: Array<[number, any]>,
): Stub<typeof globalThis, Parameters<typeof fetch>, ReturnType<typeof fetch>> {
  return stub(
    globalThis,
    "fetch",
    returnsNext(
      returns.map(([status, data]) => createJsonResponse(status, data)),
    ),
  );
}

Deno.test("RestAPI", async (t) => {
  const base = "http://cool.io/api";
  const api = new RestAPI(base);

  await t.step("me", async () => {
    const user: User = {
      id: 1,
      name: "billy",
      email: "billy@cool.io",
    };

    const fetchStub = stubFetchNext([[200, user]]);

    assertEquals(await api.me(), user);

    assertSpyCall(fetchStub, 0, {
      args: [`${base}/users/me`, { method: "GET" }],
    });

    fetchStub.restore();
  });

  await t.step("friends", async () => {
    const users: User[] = [
      { id: 2, name: "jane", email: "jane@cool.io" },
      { id: 3, name: "sean", email: "sean@cool.io" },
    ];

    const fetchStub = stubFetchNext([[200, users]]);

    assertEquals(await api.friends("billy"), users);

    assertSpyCall(fetchStub, 0, {
      args: [`${base}/users/friends?username=billy`, { method: "GET" }],
    });

    fetchStub.restore();
  });
});
