import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import QuickMenu from "../src/shell/QuickMenu.vue";
import {shellKeyAction} from "../src/windows/shellKeys.js";

afterEach(() => (document.body.innerHTML = ""));

const field = document.createElement("input");
const page = document.createElement("div");

test("Space opens the quick menu, but not in a field, not when it is open and not with a modifier", () => {
    expect(shellKeyAction({key: " ", target: page})).toBe("quick-menu");
    expect(shellKeyAction({key: " ", target: field})).toBeNull();
    expect(shellKeyAction({key: " ", target: page}, {opened: true})).toBeNull();
    expect(shellKeyAction({key: " ", target: page, metaKey: true})).toBeNull();
    expect(shellKeyAction({key: " ", target: page, defaultPrevented: true})).toBeNull();
});

test("Cmd or Ctrl with Shift and Enter switches full screen, also from a field", () => {
    expect(shellKeyAction({key: "Enter", shiftKey: true, metaKey: true, target: field})).toBe("fullscreen");
    expect(shellKeyAction({key: "Enter", shiftKey: true, ctrlKey: true, target: page})).toBe("fullscreen");
    expect(shellKeyAction({key: "Enter", shiftKey: true, target: page})).toBeNull();
});

test("Escape leaves full screen, and only then", () => {
    expect(shellKeyAction({key: "Escape", target: page}, {wide: true, opened: true})).toBeNull();
    expect(shellKeyAction({key: "Escape", target: field}, {wide: true})).toBeNull();
    expect(shellKeyAction({key: "Escape", target: page}, {wide: true})).toBe("leave-fullscreen");
    expect(shellKeyAction({key: "Escape", target: page}, {wide: false})).toBeNull();
});

function opened(commands, props = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(QuickMenu, {commands, ...props})).mount(element);
    return document.querySelector("[data-quick-menu]");
}

const press = async (menu, key) => {
    menu.querySelector("input").dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true}));
    await nextTick();
};

test("the arrows walk the rows and Enter runs the one reached and closes", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const close = vi.fn();
    const menu = opened([{label: "Go to Chat", icon: "arrow", run: first}, {label: "Full screen", icon: "wide", run: second}], {onClose: close});
    await press(menu, "ArrowDown");
    expect(menu.querySelector(".quick-row.on").textContent).toContain("Full screen");
    await press(menu, "Enter");
    expect(second).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
});

test("a row's key runs it, and typing searches and offers to message the agent", async () => {
    const run = vi.fn();
    const message = vi.fn();
    const menu = opened([{label: "Go to Chat", key: "1", icon: "arrow", run}, {label: "Full screen", icon: "wide", run: () => {}}], {onMessage: message});
    await press(menu, "1");
    expect(run).toHaveBeenCalled();
    const input = menu.querySelector("input");
    input.value = "screen";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    const labels = [...menu.querySelectorAll("[data-quick-row]")].map((row) => row.textContent.trim());
    expect(labels).toEqual(["Full screen", "Message the agent: “screen”"]);
    menu.querySelectorAll("[data-quick-row]")[1].click();
    expect(message).toHaveBeenCalledWith("screen");
});

test("Escape closes the menu", async () => {
    const close = vi.fn();
    await press(opened([{label: "Go to Chat", icon: "arrow", run: () => {}}], {onClose: close}), "Escape");
    expect(close).toHaveBeenCalled();
});
