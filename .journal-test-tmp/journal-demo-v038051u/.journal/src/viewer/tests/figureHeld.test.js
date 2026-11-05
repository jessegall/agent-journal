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

test("a shell line says what it does: a test run, a build or a search, and any other command is plain running", () => {
    expect(heldState("Bash make test", NOW, NOW)).toBe("testing");
    expect(heldState("Bash npm run build", NOW, NOW)).toBe("building");
    expect(heldState("Bash rg heldState src", NOW, NOW)).toBe("searching");
    expect(heldState("Bash ls -la", NOW, NOW)).toBe("running");
});

test("with no tool in hand it compacts, thinks, waits on the user or a run, or idles until it dozes", () => {
    expect(heldState("Read a.py", NOW, NOW, {compacting: true})).toBe("compacting");
    expect(heldState("", NOW, NOW, {thinking: true})).toBe("thinking");
    expect(heldState("", NOW, NOW, {waitingSince: NOW - 5})).toBe("asking");
    expect(heldState("", NOW - 500, NOW, {waitingSince: NOW - 5}), "what waits on the user keeps it up").toBe("asking");
    expect(heldState("", NOW, NOW, {waitingFor: "Running tests"})).toBe("waiting");
    expect(heldState("", NOW - 500, NOW, {waitingFor: "Running tests"})).toBe("asleep");
    expect(heldState("", NOW, NOW)).toBe("idle");
});
