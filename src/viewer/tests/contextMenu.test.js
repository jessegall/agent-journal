import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ContextMenu from "../src/kit/ContextMenu.vue";
import {useContextMenu} from "../src/composables/contextMenu.js";
import {settle} from "./support/windowContext.js";

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

const ran = [];
const items = () => [
    {label: "Delete", danger: true, run: () => ran.push("delete")},
    {label: "Rename", run: () => ran.push("rename")},
    {label: "Copy path", group: "copy", keys: "⌘C", run: () => ran.push("copy")},
    {label: "Open", group: "open", run: () => ran.push("open")},
    {label: "Close others", group: "open", disabled: true, reason: "only tab"},
    {label: "Reveal", group: "copy", run: () => ran.push("reveal")},
    {label: "Move to", children: [{label: "Left pane", run: () => ran.push("left")}, {label: "Right pane", run: () => ran.push("right")}]},
];

// a tab bar with a menu: the tab that is open must stay open when another is right clicked
function mountBar(list = items()) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({
        setup() {
            const {menu, open, openFromKey, close} = useContextMenu();
            return () => h("div", [
                h("button", {role: "tab", "aria-selected": "true", "data-tab": "one"}, "One"),
                h("button", {role: "tab", "aria-selected": "false", "data-tab": "two", onContextmenu: (event) => open(event, "Two", list), onKeydown: (event) => openFromKey(event, "Two", list)}, "Two"),
                menu.value ? h(ContextMenu, {...menu.value, onClose: close}) : null,
            ]);
        },
    });
    app.mount(element);
    return element;
}

const menuOf = () => document.body.querySelector("[data-context-menu]");
const labels = () => [...menuOf().querySelectorAll(".context-label")].map((label) => label.textContent);
const press = (key, extra = {}) => document.activeElement.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true, ...extra}));
const focused = () => document.activeElement.textContent.trim();

async function openAt(element, x, y) {
    element.querySelector('[data-tab="two"]').dispatchEvent(new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: x, clientY: y}));
    await settle();
}

test("test_opens_at_pointer: a right click opens the menu at the pointer, with the heading, and the browser's menu is cancelled", async () => {
    const element = mountBar();
    const event = new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: 120, clientY: 80});
    element.querySelector('[data-tab="two"]').dispatchEvent(event);
    await settle();
    expect(event.defaultPrevented).toBe(true);
    expect(menuOf().style.left).toBe("120px");
    expect(menuOf().style.top).toBe("80px");
    expect(menuOf().querySelector("[data-context-head]").textContent).toBe("Two");
    expect(menuOf().getAttribute("role")).toBe("menu");
});

test("test_shift_f10_opens_under_focus: Shift+F10 and the Menu key open the menu under the focused element, and Escape gives focus back", async () => {
    const element = mountBar();
    const tab = element.querySelector('[data-tab="two"]');
    tab.focus();
    tab.dispatchEvent(new KeyboardEvent("keydown", {key: "F10", shiftKey: true, bubbles: true, cancelable: true}));
    await settle();
    expect(menuOf()).not.toBeNull();
    expect(menuOf().style.left).toBe("8px");
    press("Escape");
    await settle();
    expect(menuOf()).toBeNull();
    tab.dispatchEvent(new KeyboardEvent("keydown", {key: "ContextMenu", bubbles: true, cancelable: true}));
    await settle();
    expect(menuOf()).not.toBeNull();
});

test("test_group_order: open and close, copy and reveal, own actions, then delete in red last, with a separator between groups", async () => {
    await openAt(mountBar(), 10, 10);
    expect(labels()).toEqual(["Open", "Close others", "Copy path", "Reveal", "Rename", "Move to", "Delete"]);
    expect(menuOf().querySelectorAll("[data-context-separator]").length).toBe(3);
    const children = [...menuOf().children].filter((child) => !child.matches("[data-context-head]"));
    expect(children[children.length - 1].classList.contains("context-danger")).toBe(true);
    expect(children[children.length - 2].matches("[data-context-separator]")).toBe(true);
});

test("test_keys_move_and_choose: arrows, Home, End, a letter, Right and Left move through the items, Enter chooses after the menu closes", async () => {
    ran.length = 0;
    const element = mountBar();
    await openAt(element, 10, 10);
    expect(focused()).toBe("Open");
    press("ArrowDown");
    expect(focused()).toBe("Copy path⌘C");
    press("End");
    expect(focused()).toBe("Delete");
    press("ArrowDown");
    expect(focused()).toBe("Open");
    press("ArrowUp");
    expect(focused()).toBe("Delete");
    press("Home");
    expect(focused()).toBe("Open");
    press("r");
    expect(focused()).toBe("Reveal");
    press("m");
    expect(focused()).toBe("Move to›");
    press("ArrowRight");
    await settle();
    expect(document.body.querySelectorAll("[data-context-menu]").length).toBe(2);
    expect(focused()).toBe("Left pane");
    press("ArrowLeft");
    await settle();
    expect(document.body.querySelectorAll("[data-context-menu]").length).toBe(1);
    expect(focused()).toBe("Move to›");
    press("ArrowRight");
    await settle();
    press("ArrowDown");
    press("Enter");
    await settle();
    expect(menuOf()).toBeNull();
    expect(ran).toEqual(["right"]);
    await openAt(element, 10, 10);
    press(" ");
    await settle();
    expect(ran).toEqual(["right", "open"]);
});

test("test_disabled_item_shows_reason: a disabled item stays in the menu with its short reason at the right, and cannot be chosen or focused", async () => {
    await openAt(mountBar(), 10, 10);
    const item = [...menuOf().querySelectorAll("[data-menu-item]")].find((button) => button.textContent.includes("Close others"));
    expect(item.disabled).toBe(true);
    expect(item.querySelector("[data-context-reason]").textContent).toBe("only tab");
    press("ArrowDown");
    expect(focused()).not.toContain("Close others");
});

test("test_flips_at_edge: a menu near the right or bottom edge opens leftward or upward from the pointer", async () => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function width() {
        return this.matches("[data-context-menu]") ? 200 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function height() {
        return this.matches("[data-context-menu]") ? 300 : 0;
    });
    const element = mountBar();
    await openAt(element, window.innerWidth - 20, window.innerHeight - 20);
    expect(menuOf().style.left).toBe(`${window.innerWidth - 20 - 200}px`);
    expect(menuOf().style.bottom).toBe("20px");
    expect(menuOf().style.top).toBe("");
});

test("test_focus_returns: closing the menu focuses the element it belongs to, which wears the ring only while open, and the open tab stays open", async () => {
    const element = mountBar();
    const tab = element.querySelector('[data-tab="two"]');
    await openAt(element, 10, 10);
    expect(tab.classList.contains("menu-target")).toBe(true);
    expect(element.querySelector('[data-tab="one"]').getAttribute("aria-selected")).toBe("true");
    expect(tab.getAttribute("aria-selected")).toBe("false");
    document.body.dispatchEvent(new Event("pointerdown", {bubbles: true}));
    await settle();
    expect(menuOf()).toBeNull();
    expect(tab.classList.contains("menu-target")).toBe(false);
    expect(document.activeElement).toBe(tab);
    expect(element.querySelector('[data-tab="one"]').getAttribute("aria-selected")).toBe("true");
});
