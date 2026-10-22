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
const empty = {table: "messages", id: 7, created_at: at(10), author: "user", creator: "user:1", text: "", files: [], data: {}, comments_on: [], idempotency: "", reply_target: null};
const reaction = {table: "reactions", id: 1, message_id: 7, face: "🎩", author: "agent"};
const scope = {env: "", api: {}, rows: (table) => (table === "reactions" ? [reaction] : [empty]), loaded: () => true, holding: () => {}, earlier: () => {}};

async function drawn(message) {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const [turn] = threadTurns([message], []).turns;
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(TurnMessage, {turn})});
    app.provide("scope", {...scope, rows: (table) => (table === "reactions" ? [reaction] : [message])});
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    await new Promise((r) => requestAnimationFrame(r));
    await nextTick();
    return {host, done: () => (app.unmount(), host.remove())};
}

test("a face on a message is drawn under its bubble, never inside it", async () => {
    const {host, done} = await drawn({...empty, text: "the footer is fixed"});
    expect(host.querySelector(".thread-bubble .thread-faces")).toBeNull();
    expect(host.querySelector(".thread-turn > .thread-faces")).not.toBeNull();
    done();
});

test("a face on an empty message shows no empty bubble, only the face", async () => {
    const {host, done} = await drawn(empty);
    expect(host.querySelector(".thread-bubble").style.display).toBe("none");
    expect(host.querySelectorAll(".thread-faces").length).toBe(1);
    done();
});
