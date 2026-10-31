import {expect, test, vi} from "vitest";
import {paneLayout} from "../src/composables/paneLayout.js";

const stored = {tree: {id: 1}, panes: {1: {tabs: ["messages.chat", "notes.archive"], active: "messages.chat"}}, next: 2};

test("a stored layout naming a window that is gone keeps its tab, marks it gone, and is not saved over", () => {
    const save = vi.fn();
    const store = paneLayout({stored, windows: ["messages.chat"], save});
    expect(store.layout.value.panes[1].tabs).toEqual(["messages.chat", "notes.archive"]);
    expect(store.gone.value).toEqual(["notes.archive"]);
    expect(save).not.toHaveBeenCalled();
});
