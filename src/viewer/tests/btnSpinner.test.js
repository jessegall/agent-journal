import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import Btn from "../src/kit/Btn.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
});

function drawn(onClick, props = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(Btn, {onClick, ...props}, () => "Save")}).mount(element);
    return element.querySelector("button");
}

test("a click that waits on a request shows the spinner until it answers", async () => {
    vi.useFakeTimers();
    let answer;
    const button = drawn(() => new Promise((resolve) => (answer = resolve)));
    button.click();
    await vi.advanceTimersByTimeAsync(200);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector(".btn-spinner")).not.toBeNull();
    expect(button.disabled).toBe(true);
    answer();
    await vi.advanceTimersByTimeAsync(0);
    expect(button.getAttribute("aria-busy")).toBe("false");
    expect(button.querySelector(".btn-spinner")).toBeNull();
    expect(button.disabled).toBe(false);
});

test("a click answered at once never shows the spinner", async () => {
    vi.useFakeTimers();
    const button = drawn(async () => {});
    button.click();
    await vi.advanceTimersByTimeAsync(200);
    expect(button.querySelector(".btn-spinner")).toBeNull();
});

test("a click that waits on nothing shows no spinner and still runs once", async () => {
    const handler = vi.fn();
    const button = drawn(handler);
    button.click();
    await settle();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(button.querySelector(".btn-spinner")).toBeNull();
});

test("a failed request takes the spinner away", async () => {
    vi.useFakeTimers();
    const failing = vi.fn(() => Promise.reject(new Error("no")).catch(() => {}));
    const button = drawn(failing);
    button.click();
    await vi.advanceTimersByTimeAsync(200);
    expect(button.querySelector(".btn-spinner")).toBeNull();
});

test("a button can show an icon before its words", async () => {
    const button = drawn(() => {}, {icon: "plus"});
    await settle();
    expect(button.querySelector(".btn-label svg")).not.toBeNull();
});
