import {expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import ChatMark from "../src/kit/ChatMark.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const RECORDING_MS = 900;

function mounted(read, run) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ChatMark, {mark: {label: "Ran the tests", detail: "3 passed"}})});
    app.provide(WINDOW_CONTEXT, {read, run});
    app.mount(element);
    return {element, app};
}

test("opening a mark records every frame while the developer setting is on", async () => {
    const saved = [];
    const {element, app} = mounted(async () => ({ok: true, value: {value: true}}), async (line) => saved.push(line));
    element.querySelector(".top").click();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, RECORDING_MS));
    expect(saved).toHaveLength(1);
    expect(saved[0].slice(0, 2)).toEqual(["developer", "record-mark-motion"]);
    const recording = JSON.parse(saved[0][2]);
    expect(recording.frames.length).toBeGreaterThan(1);
    expect(recording.frames[0]).toHaveProperty("mark.width");
    expect(recording.frames[0]).toHaveProperty("title.width");
    app.unmount();
});

test("nothing is kept while the developer setting is off", async () => {
    const saved = [];
    const {element, app} = mounted(async () => ({ok: true, value: {value: false}}), async (line) => saved.push(line));
    element.querySelector(".top").click();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, RECORDING_MS));
    expect(saved).toHaveLength(0);
    app.unmount();
});
