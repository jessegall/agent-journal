import {expect, test} from "vitest";
import {ACTING, CLIPS, WAIT} from "../src/figure/figure.js";

test("the waiting figure holds its watch up for five seconds or more, then whistles before it looks again", () => {
    const clip = CLIPS.find((each) => each.name === "waiting");
    const heldSeconds = ((WAIT.watchBack[0] - WAIT.watchOut[1]) * WAIT.hold) / ACTING.fps;
    expect(heldSeconds).toBeGreaterThanOrEqual(5);
    expect(WAIT.whistleSpan[0]).toBeGreaterThanOrEqual(WAIT.watchBack[1]);
    expect(clip.frames).toBe(WAIT.intro + WAIT.hold + WAIT.outro);
});
