import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import DocumentRead from "../kit/DocumentRead.vue";
import {READ_RATES} from "../src/composables/readRates.js";
import {context, settle} from "./support/windowContext.js";

const LINE = "plugin dashboard standup";

function mounted(events) {
    const window = context({[LINE]: {ok: true, value: {missing: "nothing yet"}}});
    const element = document.createElement("div");
    const app = createApp({render: () => h(DocumentRead, {line: LINE, events})});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(element);
    return {window, element, app};
}

afterEach(() => vi.useRealTimers());

test("a named event sends a read and an unrelated one sends none", async () => {
    const {window, app} = mounted(["task.*"]);
    await settle();
    expect(window.reads).toEqual([LINE]);
    window.subscriptions.dispatch({event: "agent.update"});
    await settle();
    expect(window.reads).toEqual([LINE]);
    window.subscriptions.dispatch({event: "task.update"});
    await new Promise((resolve) => setTimeout(resolve, READ_RATES.openPanel + 50));
    expect(window.reads).toEqual([LINE, LINE]);
    app.unmount();
    expect(window.subscriptions.follows).toEqual([]);
}, READ_RATES.openPanel + 2000);

test("a document that names no events reads at the slow rate and follows nothing", async () => {
    vi.useFakeTimers();
    const {window, app} = mounted([]);
    await vi.advanceTimersByTimeAsync(0);
    expect(window.reads).toEqual([LINE]);
    expect(window.subscriptions.follows).toEqual([]);
    await vi.advanceTimersByTimeAsync(READ_RATES.openPanel * 2);
    expect(window.reads).toEqual([LINE]);
    await vi.advanceTimersByTimeAsync(READ_RATES.documentWithNoEvents);
    expect(window.reads).toEqual([LINE, LINE]);
    app.unmount();
});
