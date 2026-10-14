import {expect, test} from "vitest";
import {figureStatus, figureVisible} from "../src/composables/voiceFigure.js";
import {store} from "../src/state/store.js";

test("the figure is hidden while the dump window is open, and comes back with the chat", () => {
    figureStatus.value = "shown";
    store.dumping = true;
    expect(figureVisible(true)).toBe(false);
    store.dumping = false;
    expect(figureVisible(true)).toBe(true);
    expect(figureVisible(false)).toBe(false);
});

test("the figure is in the chat always, only while the agent is idle, or while it is idle or waits on the user, as Settings says", async () => {
    const {shownIn} = await import("../src/composables/voiceFigure.js");
    expect(["idle", "thinking", "asking"].map((state) => shownIn("always", state))).toEqual([true, true, true]);
    expect(["idle", "asleep", "thinking", "asking"].map((state) => shownIn("idle", state))).toEqual([true, true, false, false]);
    expect(["idle", "asking", "waiting", "writing"].map((state) => shownIn("waiting", state))).toEqual([true, true, true, false]);
    expect(shownIn(undefined, "thinking")).toBe(true);
});

test("the avatar's floors are drawn only while the developer switch is on", async () => {
    const {floorsShown} = await import("../src/composables/voiceFigure.js");
    store.settings = {features: {}};
    expect(floorsShown()).toBe(false);
    store.settings = {features: {figure_floors: true}};
    expect(floorsShown()).toBe(true);
});
