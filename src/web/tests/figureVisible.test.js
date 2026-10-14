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
