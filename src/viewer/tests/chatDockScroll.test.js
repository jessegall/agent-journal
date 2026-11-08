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
    return {...kit, DockStack: {props: ["collapsed", "insidesFolded"], render() { return h("div", {"data-test-docks": "", "data-collapsed": String(this.collapsed), "data-insides-folded": String(this.insidesFolded)}); }}};
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

const approval = (id) => ({...item(id), type: "approvals.request", target_model: "approval"});

async function mixedStack(items, collapsed) {
    loadDockDeclarations([{type: "documents.doc", icon: "document", title: "Document", buttons: [], reads: []}, {type: "approvals.request", icon: "question", title: "Approval", buttons: [], reads: [], needs_user: true}]);
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(DockStack, {items: items.value, collapsed: collapsed.value})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    await nextTick();
    return {host, app};
}

test("a card that waits on the person docks open among folded cards, can be folded by hand, and a card that waits on nobody keeps the folded default", async () => {
    localStorage.clear();
    const items = ref([item(1), item(2), approval(3)]);
    const stack = await mixedStack(items, ref(true));
    const folded = () => [...stack.host.querySelectorAll(".chat-dock")].map((card) => card.classList.contains("collapsed"));
    expect(folded()).toEqual([true, true, false]);
    items.value = [...items.value, approval(4)];
    await nextTick();
    expect(folded()).toEqual([true, true, false, false]);
    stack.host.querySelector("[data-dock-all]").click();
    await nextTick();
    stack.host.querySelector("[data-dock-all]").click();
    await nextTick();
    expect(folded()).toEqual([true, true, true, true]);
    stack.host.querySelectorAll(".chat-dock.collapsed")[2].click();
    await nextTick();
    expect(folded()).toEqual([true, true, false, true]);
    stack.app.unmount();
    localStorage.clear();
});

test("scrolling up folds an existing approval while a newly arriving approval opens", async () => {
    localStorage.clear();
    const items = ref([item(1), approval(2)]);
    const collapsed = ref(false);
    const stack = await mixedStack(items, collapsed);
    const folded = () => [...stack.host.querySelectorAll(".chat-dock")].map((card) => card.classList.contains("collapsed"));
    expect(folded()).toEqual([false, false]);
    collapsed.value = true;
    await nextTick();
    expect(folded()).toEqual([true, true]);
    items.value = [...items.value, approval(3)];
    await nextTick();
    expect(folded()).toEqual([true, true, false]);
    collapsed.value = false;
    await nextTick();
    expect(folded()).toEqual([false, false, false]);
    stack.app.unmount();
    localStorage.clear();
});

test("a lone card docks unfolded, the last card left unfolds, and two or more cards keep their folded state", async () => {
    localStorage.clear();
    const items = ref([item(1)]);
    const stack = await mixedStack(items, ref(true));
    const folded = () => [...stack.host.querySelectorAll(".chat-dock")].map((card) => card.classList.contains("collapsed"));
    expect(folded()).toEqual([false]);
    items.value = [item(1), item(2)];
    await nextTick();
    expect(folded()).toEqual([true, true]);
    items.value = [item(2)];
    await nextTick();
    expect(folded().at(-1)).toBe(false);
    stack.app.unmount();
    localStorage.clear();
});

async function scrolledChat() {
    const element = await mounted(Chat, context({"message feed": page([])}));
    const history = element.querySelector(".history");
    Object.defineProperty(history, "scrollHeight", {value: 2000});
    Object.defineProperty(history, "clientHeight", {value: 500});
    Object.defineProperty(history, "scrollTop", {value: 1500, writable: true});
    return {element, history};
}

test("scrolling up folds the insides of the cards and shows the Newest button only after half a second, and the foot undoes both at once", async () => {
    const {element, history} = await scrolledChat();
    const docks = () => element.querySelector("[data-test-docks]").dataset;
    const newest = () => {
        const button = element.querySelector("[data-scroll-foot]");
        return button.style.display === "none" || button.classList.contains("rise-leave-active") ? "hidden" : "shown";
    };
    vi.useFakeTimers();
    history.dispatchEvent(new Event("scroll"));
    history.scrollTop = 500;
    history.dispatchEvent(new Event("scroll"));
    await vi.advanceTimersByTimeAsync(499);
    expect([docks().insidesFolded, newest()]).toEqual(["false", "hidden"]);
    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    expect([docks().insidesFolded, newest()]).toEqual(["true", "shown"]);
    history.scrollTop = 1500;
    history.dispatchEvent(new Event("scroll"));
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
    expect([docks().insidesFolded, newest()]).toEqual(["false", "hidden"]);
});

const foldingDocument = (id) => ({...item(id), type: "documents.folding-doc"});

test("while the chat is scrolled up the insides of a card fold whatever the hand chose, and the hand's choice shows again at the foot", async () => {
    localStorage.clear();
    loadDockDeclarations([{type: "documents.folding-doc", icon: "document", title: "Document", buttons: [], reads: [], folds: true}]);
    const host = document.createElement("div");
    document.body.append(host);
    const away = ref(false);
    const app = createApp({render: () => h(DockStack, {items: [foldingDocument(1)], insidesFolded: away.value})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    await nextTick();
    const body = () => host.querySelector(".chat-dock-body").classList.contains("folded");
    expect(body()).toBe(false);
    away.value = true;
    await nextTick();
    expect(body()).toBe(true);
    expect(host.querySelector(".chat-dock").classList.contains("collapsed")).toBe(false);
    away.value = false;
    await nextTick();
    expect(body()).toBe(false);
    app.unmount();
    localStorage.clear();
});
