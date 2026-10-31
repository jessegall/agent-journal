import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import StateRows from "../kit/StateRows.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

function mounted(read) {
    const context = {read, follow: () => {}};
    const element = document.createElement("div");
    createApp({setup: () => () => h(StateRows, {line: "task list", events: [], empty: "No tasks yet"}), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return element;
}

test("a row list shows its empty text only after its first read has answered", async () => {
    let answer = null;
    const element = mounted(() => new Promise((resolve) => (answer = resolve)));
    await settled();
    expect(element.textContent).not.toContain("No tasks yet");
    answer({ok: true, value: {rows: []}});
    await settled();
    expect(element.textContent).toContain("No tasks yet");
});
