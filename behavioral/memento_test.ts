import { AudioPlayer } from "./memento.ts";
import { assertAlmostEquals, assertEquals } from "std/testing/asserts.ts";
import { zip } from "../lib/iter.ts";

Deno.test("AudioPlayer", () => {
  const player = new AudioPlayer();

  // Equalizer defaults to "flat".
  assertEquals(player.equalizer.getLevels(), new Array(10).fill(0));

  // When the preset is activated, it does so by using a memento that was
  // created during the audio player initialization.
  player.equalizer_presets.set("Techno");

  const actualLevels = player.equalizer.getLevels();

  const expectedLevels = [
    4.64516129032258,
    3.483870967741936,
    0,
    -3.75,
    -3.375,
    0,
    4.64516129032258,
    5.806451612903226,
    5.806451612903226,
    5.419354838709677,
  ];

  for (const [actual, expected] of zip(actualLevels, expectedLevels)) {
    assertAlmostEquals(actual, expected);
  }
});
