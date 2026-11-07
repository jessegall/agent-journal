import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {context, page, settle} from "./support/windowContext.js";

vi.mock("@journal/window-kit", async (original) => {
    const kit = await original();
    const {h} = await import("vue");
    return {...kit, DockStack: {props: ["items"], render() { return h("div", {"data-dock-count": this.items.length}); }}};
});

let app;
let host;
afterEach(() => {
    app?.unmount();
    host?.remove();
    vi.unstubAllGlobals();
});

test.each(["message", "dock", "both"])("the chat follows %s at the bottom and stays put when scrolled up", async (change) => {
    const observers = [];
    vi.stubGlobal("ResizeObserver", class {
        constructor(callback) { this.callback = callback; this.elements = []; observers.push(this); }
        observe(element) { this.elements.push(element); }
        disconnect() {}
    });
    const message = (id) => ({id, type: "agent", text: `Message ${id}`, created_at: `2026-11-02T10:00:0${id}Z`});
    const window_ = context({"message feed": page([message(1)]), "chat-mark main": page([]), "dock-item main": page([])});
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(Chat)});
    app.provide(WINDOW_CONTEXT, window_);
    app.mount(host);
    await settle();
    const history = host.querySelector(".history");
    let height = 2000;
    let shown = 500;
    let top = 1500;
    Object.defineProperties(history, {
        scrollHeight: {get: () => height},
        clientHeight: {get: () => shown},
        scrollTop: {get: () => top, set: (value) => { top = Math.min(value, height - shown); }},
    });
    const resized = observers.find((observer) => observer.elements.includes(history));
    expect(resized.elements).toContain(history.firstElementChild);
    history.dispatchEvent(new Event("scroll"));
    if (change !== "dock") {
        height += 100;
        window_.props.messages.rows.value = [message(2), message(1)];
    }
    if (change !== "message") {
        window_.props.docks.rows.value = [{id: 1, state: "docked", target_model: "doc", target_id: 1}];
        shown -= 100;
    }
    await nextTick();
    if (change !== "message") resized.callback([]);
    await settle();
    expect(top).toBe(height - shown);
    if (change !== "message") expect(host.querySelector("[data-dock-count]").dataset.dockCount).toBe("1");
    height += 100;
    resized.callback([]);
    expect(top).toBe(height - shown);
    top = 500;
    history.dispatchEvent(new Event("scroll"));
    if (change !== "dock") {
        height += 100;
        window_.props.messages.rows.value = [message(3), message(2), message(1)];
    }
    if (change !== "message") {
        window_.props.docks.rows.value = [{id: 1, state: "docked", target_model: "doc", target_id: 1}, {id: 2, state: "docked", target_model: "doc", target_id: 2}];
        shown -= 100;
    }
    await nextTick();
    if (change !== "message") resized.callback([]);
    await settle();
    expect(top).toBe(500);
    height += 100;
    resized.callback([]);
    expect(top).toBe(500);
    expect(host.querySelector(".chat-foot").parentElement).toBe(history.parentElement);
});
