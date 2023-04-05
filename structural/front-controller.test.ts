import { Handler, Request, Response, Router } from "./front-controller.ts";
import {
  assertSpyCall,
  assertSpyCalls,
  ExpectedSpyCall,
  Spy,
  spy,
} from "std/testing/mock.ts";
import { assertThrows } from "std/testing/asserts.ts";

const noop_handler: Handler = (_) => "";

type HandlerSpy<Self> = Spy<Self, [Request], Response>;

function assertLastSpyCall<Self, Args extends unknown[], Return>(
  spy: Spy<Self, Args, Return>,
  spy_call: ExpectedSpyCall<Self, Args, Return>,
) {
  assertSpyCall(spy, spy.calls.length - 1, spy_call);
}

function assertRoute<Self>(
  router: Router,
  spy: HandlerSpy<Self>,
  prefix: Request,
  expected_prefix = "",
) {
  const num_calls = spy.calls.length;

  router.route(prefix);
  assertSpyCalls(spy, num_calls + 1);
  assertLastSpyCall(spy, { args: [expected_prefix] });

  router.route(prefix + "/");
  assertSpyCalls(spy, num_calls + 2);
  assertLastSpyCall(spy, { args: [expected_prefix + "/"] });

  router.route(prefix + "/a");
  assertSpyCalls(spy, num_calls + 3);
  assertLastSpyCall(spy, { args: [expected_prefix + "/a"] });
}

function assertFallback<Self>(
  router: Router,
  spy: HandlerSpy<Self>,
  prefix: Request,
) {
  // When using fallback, no path manipulation is done, so prefix will remain.
  assertRoute(router, spy, prefix, prefix);
}

function assertNotFound(router: Router, prefix: Request) {
  assertThrows(() => router.route(prefix), "not found");
  assertThrows(() => router.route(prefix + "/"), "not found");
  assertThrows(() => router.route(prefix + "/a"), "not found");
}

Deno.test("Router", () => {
  assertNotFound(new Router(), "");
  assertNotFound(new Router(), "/foo");
});

Deno.test("Router with fallback", () => {
  const fallback_spy = spy(noop_handler);
  const router = new Router(fallback_spy);
  assertFallback(router, fallback_spy, "");
  assertFallback(router, fallback_spy, "/foo");
});

Deno.test("Router with routes", () => {
  const router = new Router();

  const deep_spy = spy(noop_handler);
  router.addRoute("/foo/bar", deep_spy);

  const shallow_spy = spy(noop_handler);
  router.addRoute("/foo", shallow_spy);

  assertRoute(router, deep_spy, "/foo/bar");
  assertRoute(router, shallow_spy, "/foo");
  assertNotFound(router, "");
  assertNotFound(router, "/bar");
});

Deno.test("Router with fallback and routes", () => {
  const fallback_spy = spy(noop_handler);
  const router = new Router(fallback_spy);

  const deep_spy = spy(noop_handler);
  router.addRoute("/foo/bar", deep_spy);

  const shallow_spy = spy(noop_handler);
  router.addRoute("/foo", shallow_spy);

  assertRoute(router, deep_spy, "/foo/bar");
  assertRoute(router, shallow_spy, "/foo");
  assertFallback(router, fallback_spy, "");
  assertFallback(router, fallback_spy, "/bar");
});
