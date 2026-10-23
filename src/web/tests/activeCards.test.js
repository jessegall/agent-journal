import {createApp, h, nextTick, ref} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {useActiveCards} from "../src/composables/activeCards.js";

afterEach(() => vi.useRealTimers());

test("active process cards are brought up to date by one request a second, and none is sent once no process card is active", async () => {
    vi.useFakeTimers();
    const asked = [];
    const messages = ref([
        {id: 1, data: {card_type: "process", process: "output", active: true, figure: ""}},
        {id: 2, data: {card_type: "process", process: "output", active: false, ending: "finished"}},
        {id: 3, data: {card_type: "moment"}},
    ]);
    const api = {activeCards: async (ids) => (asked.push(ids), {1: {figure: "Running tests 40%", fraction: 0.4, active: true}})};
    let shown = null;
    const app = createApp({
        setup() {
            shown = useActiveCards(messages);
            return () => h("div");
        },
    });
    app.provide("scope", {api});
    app.mount(document.createElement("div"));
    await vi.advanceTimersByTimeAsync(1000);
    expect(asked).toEqual([[1]]);
    expect(shown.value[0].data.figure).toBe("Running tests 40%");
    messages.value = [{id: 1, data: {card_type: "process", process: "output", active: false, ending: "finished"}}, messages.value[1], messages.value[2]];
    await nextTick();
    await vi.advanceTimersByTimeAsync(3000);
    expect(asked).toEqual([[1]]);
    app.unmount();
});
