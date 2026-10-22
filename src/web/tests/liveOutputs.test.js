import {createApp, h, nextTick, ref} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {useLiveOutputs} from "../src/composables/liveOutputs.js";

afterEach(() => vi.useRealTimers());

test("live output cards are brought up to date by one request a second, and none is sent once no run is live", async () => {
    vi.useFakeTimers();
    const asked = [];
    const messages = ref([
        {id: 1, data: {output: 7, figure: ""}},
        {id: 2, data: {output: 8, ending: "finished"}},
    ]);
    const api = {outputProgress: async (ids) => (asked.push(ids), {7: {figure: "Running tests 40%", fraction: 0.4}})};
    let shown = null;
    const app = createApp({
        setup() {
            shown = useLiveOutputs(messages);
            return () => h("div");
        },
    });
    app.provide("scope", {api});
    app.mount(document.createElement("div"));
    await vi.advanceTimersByTimeAsync(1000);
    expect(asked).toEqual([[7]]);
    expect(shown.value[0].data.figure).toBe("Running tests 40%");
    messages.value = [{id: 1, data: {output: 7, ending: "finished"}}, messages.value[1]];
    await nextTick();
    await vi.advanceTimersByTimeAsync(3000);
    expect(asked).toEqual([[7]]);
    app.unmount();
});
