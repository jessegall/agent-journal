import {expect, test, vi} from "vitest";
import {createApp, h, nextTick, ref} from "vue";
import ChatMark from "../src/kit/ChatMark.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const RECORDING_MS = 1300;

function mounted(enabled, read, run, shared = {read, run, markMotion: ref(enabled)}) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ChatMark, {mark: {label: "Ran the tests", detail: "3 passed"}})});
    app.provide(WINDOW_CONTEXT, shared);
    app.mount(element);
    return {element, app};
}

test("opening a mark records every frame while the developer setting is on", async () => {
    document.getAnimations = () => [];
    const saved = [];
    const {element, app} = mounted(true, async () => ({}), async (line) => saved.push(line));
    element.querySelector(".top").click();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, RECORDING_MS));
    expect(saved).toHaveLength(1);
    expect(saved[0].slice(0, 2)).toEqual(["developer", "record-mark-motion"]);
    const recording = JSON.parse(saved[0][2])[0];
    expect(recording.frames.length).toBeGreaterThan(0);
    expect(recording.frames[0]).toHaveProperty("mark.width");
    expect(recording.frames[0]).toHaveProperty("title.width");
    app.unmount();
});

test("nothing is kept while the developer setting is off", async () => {
    const read = vi.fn();
    const run = vi.fn();
    const sample = vi.spyOn(Element.prototype, "getBoundingClientRect");
    const {element, app} = mounted(false, read, run);
    element.querySelector(".top").click();
    await nextTick();
    expect(sample).not.toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(run).not.toHaveBeenCalled();
    sample.mockRestore();
    app.unmount();
});

test("many marks recorded together are sent as one request", async () => {
    document.getAnimations = () => [];
    const saved = [];
    const run = async (line) => saved.push(line);
    const shared = {read: async () => ({}), run, markMotion: ref(true)};
    const opened = [1, 2, 3].map(() => mounted(true, shared.read, run, shared));
    for (const {element} of opened) element.querySelector(".top").click();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, RECORDING_MS));
    expect(saved).toHaveLength(1);
    expect(JSON.parse(saved[0][2])).toHaveLength(3);
    opened.forEach(({app}) => app.unmount());
});
