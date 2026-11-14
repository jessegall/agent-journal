import {createApp, h, withDirectives} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ContextMenuHost from "../src/shell/ContextMenuHost.vue";
import SidebarPages from "../src/shell/SidebarPages.vue";
import {vContext} from "../kit/vContext.js";
import {settle} from "./support/windowContext.js";

const apps = [];
const mount = (component, props = {}) => {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(component, props);
    app.directive("context", vContext);
    app.mount(element);
    apps.push(app);
    return element;
};

beforeEach(() => {
    location.hash = "";
    mount(ContextMenuHost);
});

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    getSelection().removeAllRanges();
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

const ran = [];
const Place = {props: ["value"], render() {
    return withDirectives(h("section", this.$slots.default()), [[vContext, this.value]]);
}};
const placed = (value, children) => h(Place, {value}, () => children);
const menu = () => document.body.querySelector("[data-context-menu]");
const labels = () => [...menu().querySelectorAll(".context-label")].map((label) => label.textContent);
const item = (label) => [...menu().querySelectorAll("[data-menu-item]")].find((button) => button.querySelector(".context-label").textContent === label);

function menuEvent(target, extra = {}) {
    const event = new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: 30, clientY: 40, ...extra});
    target.dispatchEvent(event);
    return event;
}

function page(parts) {
    return mount({render: () => h("main", {"data-page": ""}, parts)});
}

test("test_browser_menu_cancelled: a right click anywhere cancels the browser's menu, and empty space opens the page's own", async () => {
    const element = page([h("p", {"data-empty": ""}, "Nothing declared here")]);
    const event = menuEvent(element.querySelector("[data-empty]"));
    await settle();
    expect(event.defaultPrevented).toBe(true);
    expect(labels()).toEqual(["Search", "Copy link to this page", "Reload"]);
    expect(menu().style.left).toBe("30px");
    menu().dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    expect(menu()).toBeNull();
    const inside = menuEvent(element.querySelector("[data-empty]"));
    await settle();
    expect(inside.defaultPrevented).toBe(true);
    const again = menuEvent(menu());
    expect(again.defaultPrevented).toBe(true);
    expect(document.body.querySelectorAll("[data-context-menu]").length).toBe(1);
});

test("test_most_particular_place_wins: the place on the element nearest the pointer opens, and a place that declines leaves it to the one around", async () => {
    const outer = () => ({head: "Outer", items: [{label: "Outer item", run: () => ran.push("outer")}]});
    const inner = () => ({head: "Inner", items: [{label: "Inner item", group: "open", run: ({say}) => (ran.push("inner"), say("Done"))}]});
    const declines = () => null;
    const element = page([
        placed(outer, [
            h("p", {"data-outer-only": ""}, "outer"),
            placed(inner, [h("span", {"data-deep": ""}, "deep")]),
            placed(declines, [h("span", {"data-declined": ""}, "declined")]),
        ]),
    ]);
    menuEvent(element.querySelector("[data-deep]"));
    await settle();
    expect(menu().querySelector("[data-context-head]").textContent).toBe("Inner");
    expect(labels()).toEqual(["Inner item"]);
    item("Inner item").click();
    await new Promise((resolve) => setTimeout(resolve));
    await settle();
    expect(ran).toContain("inner");
    expect(document.body.querySelector("[data-toast-text]").textContent).toBe("Done");
    menuEvent(element.querySelector("[data-outer-only]"));
    await settle();
    expect(menu().querySelector("[data-context-head]").textContent).toBe("Outer");
    menuEvent(element.querySelector("[data-declined]"));
    await settle();
    expect(menu().querySelector("[data-context-head]").textContent).toBe("Outer");
});

test("test_text_field_menu: a text field keeps Cut, Copy, Paste and Select all, with Cut and Copy disabled while nothing is chosen", async () => {
    const element = page([h("input", {"data-field": "", value: "hello world"})]);
    const field = element.querySelector("[data-field]");
    menuEvent(field);
    await settle();
    expect(labels()).toEqual(["Cut", "Copy", "Paste", "Select all"]);
    expect(item("Cut").disabled).toBe(true);
    expect(item("Copy").disabled).toBe(true);
    expect(item("Paste").disabled).toBe(false);
    menu().dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    field.setSelectionRange(0, 5);
    menuEvent(field);
    await settle();
    expect(item("Cut").disabled).toBe(false);
    expect(item("Copy").disabled).toBe(false);
});

test("test_paste_refused_says_so: a paste the browser refuses is said in a toast", async () => {
    vi.stubGlobal("navigator", {...navigator, clipboard: {readText: () => Promise.reject(new Error("denied"))}});
    const element = page([h("textarea", {"data-field": ""})]);
    menuEvent(element.querySelector("[data-field]"));
    await settle();
    item("Paste").click();
    await settle();
    expect(document.body.querySelector("[data-toast-text]").textContent).toContain("The browser did not allow pasting");
});

test("test_selected_text_menu: chosen text gets Copy, Search for it and Quote in a comment, the last only where the place takes a quote", async () => {
    const quoted = [];
    const element = page([
        h("p", {"data-plain": ""}, "some chosen words"),
        placed(() => ({head: "Comment", items: [{label: "Reply"}], quote: (text) => quoted.push(text)}), [h("p", {"data-quotable": ""}, "quotable words")]),
    ]);
    vi.stubGlobal("navigator", {...navigator, clipboard: {writeText: vi.fn(async () => {})}});
    const choose = (target) => getSelection().selectAllChildren(target);
    const plain = element.querySelector("[data-plain]");
    choose(plain);
    menuEvent(plain);
    await settle();
    expect(labels()).toEqual(["Copy", "Search for it", "Quote in a comment"]);
    expect(menu().querySelector("[data-context-head]").textContent).toBe("“some chosen words”");
    expect(item("Quote in a comment").disabled).toBe(true);
    item("Search for it").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(decodeURIComponent(location.hash)).toBe("#/search?q=some chosen words");
    const quotable = element.querySelector("[data-quotable]");
    choose(quotable);
    menuEvent(quotable);
    await settle();
    expect(item("Quote in a comment").disabled).toBe(false);
    item("Quote in a comment").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(quoted).toEqual(["quotable words"]);
    choose(plain);
    menuEvent(plain);
    await settle();
    item("Copy").click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await settle();
    expect(document.body.querySelector("[data-toast-text]").textContent).toBe("Copied some chosen words");
});

test("test_right_press_does_not_move_focus: the right press is cancelled so focus and the selection stay, a plain press and a press on chosen text are not", () => {
    const element = page([h("input", {"data-first": "", value: "first"}), h("button", {"data-second": ""}, "Second"), h("p", {"data-text": ""}, "chosen text")]);
    const first = element.querySelector("[data-first]");
    const second = element.querySelector("[data-second]");
    first.focus();
    const press = (target, extra) => {
        const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true, ...extra});
        target.dispatchEvent(event);
        return event;
    };
    expect(press(second, {button: 2}).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
    expect(press(second, {button: 0}).defaultPrevented).toBe(false);
    getSelection().selectAllChildren(element.querySelector("[data-text]"));
    expect(press(element.querySelector("[data-text]"), {button: 2}).defaultPrevented).toBe(false);
});

test("test_long_press_opens_the_menu: a finger held on a place opens its menu, and moving away first does not", async () => {
    vi.useFakeTimers();
    const element = page([placed(() => ({head: "Held", items: [{label: "Open"}]}), [h("p", {"data-held": ""}, "held")])]);
    const target = element.querySelector("[data-held]");
    const touch = (type, x) => {
        const event = new MouseEvent(type, {bubbles: true, clientX: x, clientY: 10});
        Object.defineProperty(event, "pointerType", {value: "touch"});
        target.dispatchEvent(event);
    };
    touch("pointerdown", 10);
    touch("pointermove", 60);
    vi.advanceTimersByTime(600);
    await vi.advanceTimersByTimeAsync(10);
    expect(menu()).toBeNull();
    touch("pointerdown", 10);
    vi.advanceTimersByTime(600);
    await vi.advanceTimersByTimeAsync(10);
    expect(menu().querySelector("[data-context-head]").textContent).toBe("Held");
});

test("test_sidebar_row_menu: a row of the sidebar opens its own menu: open, open in a new tab, copy link, and a page that is not available cannot be opened", async () => {
    const windows = [{name: "tasks.tasks", title: "Tasks", icon: "window"}, {name: "mcp.servers", title: "Servers", icon: "window", unavailable_reason: "Not installed"}];
    const element = mount({render: () => h(SidebarPages, {windows, current: "main", open: "tasks.tasks", project: "Acme"})});
    menuEvent(element.querySelector('[data-sidebar-window="tasks.tasks"]'));
    await settle();
    expect(menu().querySelector("[data-context-head]").textContent).toBe("Tasks");
    expect(labels()).toEqual(["Open", "Open in a new tab", "Copy link"]);
    expect(item("Open").disabled).toBe(false);
    menu().dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    menuEvent(element.querySelector('[data-sidebar-window="mcp.servers"]'));
    await settle();
    expect(item("Open").disabled).toBe(true);
    expect(item("Copy link").disabled).toBe(false);
});
