import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

Object.defineProperty(HTMLElement.prototype, "scrollHeight", {configurable: true, get: () => 2000});
globalThis.ResizeObserver = class {
    constructor(onResize) {
        this.onResize = onResize;
    }
    observe() {
        this.onResize();
    }
    disconnect() {}
};

const at = (seconds) => new Date(seconds * 1000).toISOString();
const empty = {table: "messages", id: 7, created_at: at(10), author: "user", created_by: "user:1", text: "", files: [], data: {}, comments_on: [], idempotency: "", reply_to: null};
const reaction = {table: "reactions", id: 1, message_id: 7, face: "🎩", author: "agent"};
const scope = {env: "", api: {}, rows: (table) => (table === "reactions" ? [reaction] : [empty]), loaded: () => true, holding: () => {}, earlier: () => {}};

test("a face on an empty message is drawn inside that message's bubble, never as a bubble of its own", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const [turn] = threadTurns([empty], []).turns;
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(TurnMessage, {turn})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    await new Promise((r) => requestAnimationFrame(r));
    await nextTick();
    const bubble = host.querySelector(".thread-bubble");
    expect(bubble.style.display).not.toBe("none");
    expect(bubble.querySelector(".thread-faces")).not.toBeNull();
    expect(host.querySelectorAll(".thread-faces").length).toBe(1);
    expect(host.querySelector(".thread-turn > .thread-faces")).toBeNull();
    app.unmount();
    host.remove();
});
