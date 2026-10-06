import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {useKeyboard} from "../src/phone/keyboard.js";

const root = () => document.documentElement.style.getPropertyValue("--keyboard");

function stubbed(height) {
    const view = Object.assign(new EventTarget(), {height, offsetTop: 0});
    Object.defineProperty(window, "visualViewport", {value: view, configurable: true});
    Object.defineProperty(window, "innerHeight", {value: 800, configurable: true});
    window.matchMedia = () => ({matches: false});
    return view;
}

let app;
const mounted = () => {
    app = createApp({setup: () => (useKeyboard(), () => h("div"))});
    app.mount(document.createElement("div"));
};

afterEach(() => {
    app?.unmount();
    document.documentElement.style.removeProperty("--keyboard");
});

test("the message box rises when the visual viewport shrinks, in a browser tab too", () => {
    const view = stubbed(800);
    mounted();
    expect(root()).toBe("0px");
    view.height = 500;
    view.dispatchEvent(new Event("resize"));
    expect(root()).toBe("300px");
    view.height = 800;
    view.dispatchEvent(new Event("resize"));
    expect(root()).toBe("0px");
});

test("focusing the message box measures the keyboard at once", () => {
    const view = stubbed(800);
    mounted();
    view.height = 480;
    document.dispatchEvent(new Event("focusin"));
    expect(root()).toBe("320px");
});

test("focusing a field hides the tab bar until the field is left", async () => {
    vi.useFakeTimers();
    stubbed(800);
    mounted();
    const field = document.body.appendChild(document.createElement("input"));
    field.focus();
    expect(document.documentElement.classList.contains("typing")).toBe(true);
    field.blur();
    await vi.advanceTimersByTimeAsync(60);
    expect(document.documentElement.classList.contains("typing")).toBe(false);
    field.remove();
    vi.useRealTimers();
});
