import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";
import {fromMainAgent} from "../src/domain/transcript.js";

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
const card = (id, seconds, data, text) => ({table: "messages", id, created_at: at(seconds), author: "system", text, files: [], data, comments_on: [], idempotency: "", reply_to: null});
const messages = [card(1, 10, {kind: "peer", peer: "Coco"}, "the report is ready"), card(2, 20, {kind: "peer", sent_to: "Coco"}, "thanks, merging now")];
const scope = {env: "", api: {}, rows: () => messages, loaded: () => true, holding: () => {}, earlier: () => {}};

async function drawn(turn) {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(TurnMessage, {turn})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    await new Promise((r) => requestAnimationFrame(r));
    await nextTick();
    const shown = {
        mine: host.querySelector(".thread-turn").classList.contains("mine"),
        head: host.querySelector(".thread-bubble").textContent,
        fold: host.querySelector(".fold")?.textContent,
    };
    app.unmount();
    host.remove();
    return shown;
}

test("what the agent sends to another agent sits on the agent's side and names who it went to", async () => {
    const [, sent] = threadTurns(messages, []).turns;
    const shown = await drawn(sent);
    expect(shown.mine).toBe(false);
    expect(shown.head).toContain("Sent to Coco");
});

test("what the agent receives from another agent or from the main agent sits on the incoming side and names who sent it", async () => {
    const [received] = threadTurns(messages, []).turns;
    const [fromMain] = fromMainAgent([{type: "line", who: "agent", data: {}, kind: "message", text: "hi", key: "line:1", time: 1}, {type: "line", who: "user", data: {}, kind: "message", text: "brief", key: "line:2", time: 2}]).slice(1);
    const [peer, main] = [await drawn(received), await drawn(fromMain)];
    expect(peer.mine).toBe(true);
    expect(peer.head).toContain("Message from Coco");
    expect(main.mine).toBe(true);
    expect(main.head).toContain("Message from the main agent");
});

test("a long message to or from another agent folds with Show more", async () => {
    const [received, sent] = threadTurns(messages, []).turns;
    expect((await drawn(received)).fold).toBe("Show more");
    expect((await drawn(sent)).fold).toBe("Show more");
});
