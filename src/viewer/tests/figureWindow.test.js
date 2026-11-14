import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";

vi.mock("@journal/window-kit", async () => await import("../../core/modules/viewer/web/dist/kit/window-kit.js"));
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import Chat from "../../core/modules/messages/web/dist/chat.js";
import {perLine} from "./support/windowContext.js";

const MESSAGES = [1, 2, 3].map((id) => ({id, type: id === 2 ? "agent" : "user", text: `Message ${id}`, created_at: "2026-11-01T10:00:00Z"}));
const ANSWERS = {"message feed": {code: 0, value: {rows: MESSAGES, page: 1, size: 50, total: 3}}, "chat-mark main": {code: 0, value: {rows: [], page: 1, size: 50, total: 0}}};

afterEach(() => vi.unstubAllGlobals());

async function mountedChat(options = {}) {
    vi.stubGlobal("fetch", perLine(async (url, request) => {
        const line = JSON.parse(request.body).line.slice(0, 2).join(" ");
        return {json: async () => ANSWERS[line] ?? {code: 1, error: `no answer for ${line}`}};
    }));
    const element = document.createElement("div");
    document.body.appendChild(element);
    createApp(() => h(WindowHost, {name: "messages.chat", component: Chat, subscriptions: new WindowSubscriptions(), environment: "main", events: ["message.*"], options})).mount(element);
    for (let round = 0; round < 8; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 30));
    return element;
}

test("the chat marks the places the figure stands on: its world, its scroll, its home, its foot and each message bubble", async () => {
    const element = await mountedChat();
    expect(element.querySelectorAll("[data-figure-world]")).toHaveLength(1);
    expect(element.querySelectorAll("[data-figure-scroll]")).toHaveLength(1);
    expect(element.querySelectorAll("[data-figure-home]")).toHaveLength(1);
    expect(element.querySelectorAll("[data-figure-chat-foot]")).toHaveLength(1);
    expect(element.querySelectorAll("[data-figure-bubble]")).toHaveLength(3);
});

test("the floors are drawn as dashed lines named for their type while Show floors is on, and not drawn while it is off", async () => {
    const off = await mountedChat();
    expect(off.querySelector(".figure-floors")).toBeNull();
    const on = await mountedChat({floors: true});
    expect(on.querySelector(".figure-floors")).not.toBeNull();
});

test("a chosen figure puts its canvas beside the composer carrying the voice, and none is put for none", async () => {
    const none = await mountedChat({figure: "none"});
    expect(none.querySelector("[data-figure-canvas]")).toBeNull();
    const chosen = await mountedChat({figure: "butler"});
    // the figure's code loads on demand, so the canvas comes a moment after the chat
    await vi.waitFor(() => expect(chosen.querySelector("[data-figure-canvas]")).not.toBeNull(), {timeout: 3000});
    expect(chosen.querySelector("[data-figure-canvas]").dataset.voice).toBe("butler");
});
