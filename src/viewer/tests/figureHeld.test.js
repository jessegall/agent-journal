import {expect, test} from "vitest";
import {heldClip, heldState} from "../src/figure/heldClip.js";

const NOW = 1_000;

test("each tool the agent runs holds the clip of what it does", () => {
    const clips = {Read: "read", Grep: "search", Glob: "search", WebSearch: "search", Edit: "type", Write: "type", MultiEdit: "type", Bash: "idle", Task: "idle"};
    for (const [tool, clip] of Object.entries(clips)) expect(heldClip(`${tool} something`, NOW, NOW), tool).toBe(clip);
});

test("between tools the figure idles, and sleeps once no hook has been heard for 120 seconds", () => {
    expect(heldState("", NOW - 5, NOW)).toBe("idle");
    expect(heldState("", NOW - 119, NOW)).toBe("idle");
    expect(heldClip("", NOW - 120, NOW)).toBe("sleep");
    expect(heldState("", 0, NOW)).toBe("idle");
});

test("a tool in flight is never asleep, however long since the last hook", () => {
    expect(heldState("Read a.py", NOW - 500, NOW)).toBe("reading");
});
