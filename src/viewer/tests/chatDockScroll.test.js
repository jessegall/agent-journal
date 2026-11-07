import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, nextTick, ref} from "vue";
import DockStack from "../src/chat/DockStack.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {afterEach, expect, test, vi} from "vitest";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import {context, mounted, page} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

vi.mock("@journal/window-kit", async (original) => {
    const kit = await original();
    const {h} = await import("vue");
    return {...kit, DockStack: {props: ["collapsed"], render() { return h("div", {"data-test-docks": "", "data-collapsed": String(this.collapsed)}); }}};
});

afterEach(() => { vi.useRealTimers(); });

test("scrolling away collapses after half a quiet second and the foot opens immediately", async () => {
    const element = await mounted(Chat, context({"message feed": page([])}));
    const history = element.querySelector(".history");
    Object.defineProperty(history, "scrollHeight", {value: 2000});
    Object.defineProperty(history, "clientHeight", {value: 500});
    Object.defineProperty(history, "scrollTop", {value: 1500, writable: true});
    vi.useFakeTimers();
    history.dispatchEvent(new Event("scroll"));
    history.scrollTop = 500;
    history.dispatchEvent(new Event("scroll"));
    await vi.advanceTimersByTimeAsync(499);
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("false");
    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("true");
    expect(history.scrollTop).toBe(500);
    history.scrollTop = 1500;
    history.dispatchEvent(new Event("scroll"));
    await nextTick();
    expect(element.querySelector("[data-test-docks]").dataset.collapsed).toBe("false");
});


const item = (id) => ({id, type: "documents.doc", target_model: "doc", target_id: id, state: "docked", kept: false, leaves_at: null, created_at: new Date().toISOString()});

async function stack(count, collapsed = ref(false)) {
    loadDockDeclarations([{type: "documents.doc", icon: "document", title: "Document", buttons: [], reads: []}]);
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(DockStack, {items: Array.from({length: count}, (_, i) => item(i + 1)), collapsed: collapsed.value})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    await nextTick();
    return {host, app};
}

test("the bar appears only for multiple cards and keeps the chosen sizes", async () => {
    localStorage.clear();
    const single = await stack(1);
    expect(single.host.querySelector("[data-dock-all]")).toBeNull();
    single.app.unmount();
    const first = await stack(2);
    const button = first.host.querySelector("[data-dock-all]");
    expect(button.getAttribute("aria-label")).toBe("Collapse all");
    expect(button.textContent.trim()).toBe("");
    button.click();
    await nextTick();
    expect(button.getAttribute("aria-label")).toBe("Open all");
    expect(first.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(2);
    first.host.querySelector(".chat-dock.collapsed").click();
    await nextTick();
    expect(first.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(1);
    first.app.unmount();
    const reloaded = await stack(2);
    expect(reloaded.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(1);
    reloaded.host.querySelector("[data-dock-all]").click();
    await nextTick();
    expect(reloaded.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(0);
    reloaded.app.unmount();
    localStorage.clear();
});

test("a chosen collapse stays at the foot and without a choice follows scroll", async () => {
    localStorage.clear();
    const collapsed = ref(true);
    const first = await stack(2, collapsed);
    expect(first.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(2);
    collapsed.value = false;
    await nextTick();
    expect(first.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(0);
    first.host.querySelector("[data-dock-all]").click();
    await nextTick();
    collapsed.value = true;
    await nextTick();
    collapsed.value = false;
    await nextTick();
    expect(first.host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(2);
    first.app.unmount();
    localStorage.clear();
});

test("the all-docks button has no border or background", () => {
    const source = readFileSync(resolve(__dirname, "../src/chat/DockStack.vue"), "utf8");
    expect(source).toMatch(/\.dock-all :deep\(\[data-dock-all\]\)\s*\{\s*border:\s*0;\s*background:\s*none;\s*\}/);
});

test("the all-docks bar keeps little padding to the right of its chevron", () => {
    const source = readFileSync(resolve(__dirname, "../src/chat/DockStack.vue"), "utf8");
    expect(source).toMatch(/\.dock-all\s*\{[^}]*padding:\s*0 4px;/);
});

test("collapsed waiting cards hide the warning strip", () => {
    const source = readFileSync(resolve(__dirname, "../src/kit/ChatDock.vue"), "utf8");
    expect(source).toMatch(/\.chat-dock\.collapsed \.chat-dock-card\.waiting::before\s*\{\s*display:\s*none;\s*\}/);
});

test("the all-docks header sticks to the top while the cards scroll under it", () => {
    const source = readFileSync(resolve(__dirname, "../src/chat/DockStack.vue"), "utf8");
    expect(source).toMatch(/\.dock-all\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*z-index:\s*2;/);
    expect(source).toMatch(/\.dock-stack\s*\{[^}]*overflow:\s*clip;/);
    expect(source).not.toMatch(/\.dock-stack\s*\{[^}]*overflow:\s*hidden;/);
    expect(readFileSync(resolve(__dirname, "../../core/modules/messages/web/src/Chat.vue"), "utf8")).toMatch(/\.chat-foot\s*\{[^}]*overflow-y:\s*auto;/);
});
