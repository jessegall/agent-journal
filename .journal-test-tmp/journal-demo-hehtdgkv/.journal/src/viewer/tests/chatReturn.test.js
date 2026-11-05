import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {arrivalQueue, BATCH_ROWS} from "../src/chat/arrival.js";
import {context, page, settle} from "./support/windowContext.js";

let app;
let host;
afterEach(() => {
    app?.unmount();
    host?.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

const messages = (first, last) => Array.from({length: last - first + 1}, (_, index) => {
    const id = last - index;
    return {id, type: "agent", text: `Backlog message ${id}`, created_at: new Date(1700000000000 + id * 1000).toISOString()};
});

test("returning to a chat replaces older pages with the newest fifty and jumps to the bottom without animation", async () => {
    let hidden = false;
    vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
    const frames = [];
    vi.stubGlobal("requestAnimationFrame", (frame) => frames.push(frame));
    const feed = {"message feed": {ok: true, value: {rows: messages(51, 100)}}, "chat-mark main": page([])};
    const window_ = context(feed);
    const read = window_.read;
    window_.read = async (line) => line.includes("--before-id") ? page(messages(1, 50)) : read(line);
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(Chat)});
    app.provide(WINDOW_CONTEXT, window_);
    app.mount(host);
    await settle();
    const history = host.querySelector(".history");
    Object.defineProperty(history, "scrollHeight", {value: 4000});
    Object.defineProperty(history, "clientHeight", {value: 500});
    history.scrollTop = 0;
    history.dispatchEvent(new Event("scroll"));
    await settle();
    expect(host.querySelectorAll("[data-message]")).toHaveLength(100);
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    feed["message feed"] = page(messages(151, 200));
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await settle();
    expect(host.querySelectorAll("[data-message]")).toHaveLength(50);
    expect(host.textContent).toContain("Backlog message 200");
    expect(host.textContent).not.toContain("Backlog message 100");
    expect(history.scrollTop).toBe(4000);
    expect([...history.querySelectorAll("[data-row]")].every((row) => !row.style.opacity && !row.style.transition && row.style.display !== "none")).toBe(true);
    expect(window_.reads.filter((line) => line.startsWith("message feed"))).toEqual(["message feed --limit 50", "message feed --limit 50"]);
});

test("a backlog cancels the active arrival and shows every waiting turn in the same frame", () => {
    const frames = [];
    const pane = document.createElement("div");
    const rows = Array.from({length: BATCH_ROWS + 20}, () => document.createElement("div"));
    const finished = [];
    const queue = arrivalQueue();
    rows.forEach((row, index) => queue(row, {pane, follows: () => true, frame: (frame) => frames.push(frame)}, () => finished.push(index)));
    expect(finished).toHaveLength(rows.length);
    expect(rows.every((row) => !row.style.opacity && !row.style.height && !row.style.transition && row.style.display !== "none")).toBe(true);
    frames.forEach((frame) => frame());
    expect(finished).toHaveLength(rows.length);
});
