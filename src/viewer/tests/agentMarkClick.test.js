import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import {cardsOfMarks} from "../src/domain/figureState.js";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {peekRef} from "../src/route.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));

const DECLARATIONS = [
    {type: "workers.worker", family_icon: "agents", mark_icon: "worker", group: "agent", colouring: "group", click: "open row"},
    {type: "drivers.dispatch", family_icon: "agents", mark_icon: "helper", group: "agent", colouring: "group", click: "open row", process: true},
];
const WORKER = {id: 1, type: "workers.worker", variant: "started", key: "started:1:1", text: "Mr. Ampere started task 3", lines: "On claude opus\n\nTask 3: the cart", detail: "On claude opus", state: "ended", created_at: "2026-11-01T10:00:00Z", target_model: "agents", target_id: 57};
const DISPATCH = {id: 2, type: "drivers.dispatch", variant: "dispatched", key: "dispatch:1", text: "Dispatched journal-researcher . haiku: Read the cart", lines: "Find where totals are counted", detail: "Find where totals are counted", state: "shown", created_at: "2026-11-01T10:00:00Z", target_model: "", target_id: null};

let app = null;
afterEach(() => {
    app?.unmount();
    peekRef.mockClear();
});

function drawn(mark) {
    loadMarkDeclarations(DECLARATIONS);
    const element = document.createElement("div");
    document.body.appendChild(element);
    app = createApp(() => h(MarkHost, {mark})).provide(WINDOW_CONTEXT, {environment: "development", read: async () => ({ok: true, value: {rows: []}})});
    app.mount(element);
    return element;
}

test("a mark's key on the page is the one the figure's cards go by", () => {
    expect(drawn(WORKER).querySelector("[data-figure-mark]").dataset.figureMark).toBe(cardsOfMarks([WORKER])[0].key);
});

test("a click on a worker's mark opens that worker", () => {
    drawn(WORKER).querySelector(".top").click();
    expect(peekRef).toHaveBeenCalledWith("agents:57");
});

test("a click on a dispatch's mark opens its helper once that has started", () => {
    drawn({...DISPATCH, target_model: "agents", target_id: 61}).querySelector(".top").click();
    expect(peekRef).toHaveBeenCalledWith("agents:61");
});

test("a dispatch whose helper has not started opens in place, and opens nothing else", async () => {
    const element = drawn(DISPATCH);
    element.querySelector(".top").click();
    await nextTick();
    expect(peekRef).not.toHaveBeenCalled();
    expect(element.querySelector("[data-open]")).not.toBeNull();
});

test("the fold sign on an agent's mark still unfolds what the mark holds, and opens no agent", async () => {
    const element = drawn(WORKER);
    element.querySelector(".fold").click();
    await nextTick();
    expect(peekRef).not.toHaveBeenCalled();
    expect(element.querySelector("[data-open]")).not.toBeNull();
});
