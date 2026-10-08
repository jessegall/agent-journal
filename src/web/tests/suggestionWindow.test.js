import {createApp, h} from "vue";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import SuggestionWindow from "../src/chat/SuggestionWindow.vue";
import {GAP_MS, IDLE_MS, useSuggestionWindow} from "../src/composables/suggestionWindow.js";
import {dueNow} from "../src/domain/suggestions.js";
import {flush} from "./flush.js";

const HOUR = 3600;
const row = (n, created, data = {}, completed = 0) => ({n, title: `Suggestion ${n}`, brief: "", outcome: "", created, completed, data});

function scheduled(list, hours = 3, graceUntil = () => 0) {
    let made;
    const into = document.createElement("div");
    document.body.append(into);
    createApp({
        setup: () => (
            (made = useSuggestionWindow(
                () => list,
                () => hours,
                graceUntil
            )),
            () => h("div")
        ),
    }).mount(into);
    return made;
}

function opened(suggestion) {
    const acts = {
        complete: vi.fn().mockResolvedValue({}),
        install: vi.fn(),
        installBlocked: () => "",
        noteWindow: vi.fn().mockResolvedValue({}),
        offerUndo: vi.fn(),
        speak: vi.fn(),
        open: vi.fn(),
    };
    const closed = vi.fn();
    const into = document.createElement("div");
    document.body.append(into);
    const app = createApp(SuggestionWindow, {suggestion, hours: 3, onClose: closed});
    app.provide("suggestionActs", acts);
    app.mount(into);
    const button = (label) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === label);
    return {acts, closed, button, text: () => document.body.textContent.replace(/\s+/g, " ")};
}

beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
    vi.setSystemTime(new Date(10 * HOUR * 1000));
});
afterEach(() => vi.useRealTimers());

describe("when the window opens", () => {
    test("only an open suggestion nobody has seen in a window, made longer ago than the setting", () => {
        const now = 10 * HOUR;
        const list = [
            row(1, now - HOUR),
            row(2, now - 5 * HOUR, {window_seen: 1}),
            row(3, now - 6 * HOUR, {}, 1),
            row(4, now - 4 * HOUR),
            row(5, now - 8 * HOUR),
        ];
        expect(dueNow(list, 3, now).n).toBe(5);
        expect(dueNow(list, 0, now)).toBeNull();
        expect(dueNow(list.slice(0, 4), 3, now).n).toBe(4);
    });

    test("it waits while a chat box holds a draft or was just typed in, opens once, and leaves ten minutes before the next", async () => {
        const now = 10 * HOUR;
        const window = scheduled([row(1, now - 4 * HOUR), row(2, now - 5 * HOUR)]);
        const compose = document.createElement("form");
        compose.className = "compose";
        const box = document.createElement("textarea");
        compose.append(box);
        document.body.append(compose);
        box.value = "half a thought";
        vi.advanceTimersByTime(2000);
        expect(window.suggestion.value).toBeNull();
        box.value = "";
        box.dispatchEvent(new KeyboardEvent("keydown", {key: "a", bubbles: true}));
        vi.advanceTimersByTime(IDLE_MS - 1500);
        expect(window.suggestion.value).toBeNull();
        vi.advanceTimersByTime(2000);
        expect(window.suggestion.value.n).toBe(2);
        window.close();
        vi.advanceTimersByTime(GAP_MS - 2000);
        expect(window.suggestion.value).toBeNull();
        document.dispatchEvent(new Event("pointerdown"));
        vi.advanceTimersByTime(3000);
        expect(window.suggestion.value.n).toBe(1);
    });
});

describe("right after the journal starts", () => {
    test("a suggestion whose hours ran out opens only once the grace period after the start has passed", () => {
        const now = 10 * HOUR;
        const grace = now * 1000 + 10 * 60_000;
        const window = scheduled([row(1, now - 5 * HOUR)], 3, () => grace);
        vi.advanceTimersByTime(9 * 60_000);
        expect(window.suggestion.value).toBeNull();
        document.dispatchEvent(new Event("pointerdown"));
        vi.advanceTimersByTime(60_000 + 2000);
        expect(window.suggestion.value.n).toBe(1);
    });
});

describe("the window", () => {
    test("is titled by the suggestion, says how long it waited, and counts as seen after two seconds", async () => {
        const {acts, text} = opened(row(42, 0));
        await flush();
        expect(text()).toContain("Suggestion 42 · unanswered for 3 hours");
        expect(document.querySelector("[role=dialog]").getAttribute("aria-modal")).toBe("true");
        expect(document.activeElement.textContent).toBe("Suggestion 42");
        vi.advanceTimersByTime(2000);
        expect(acts.noteWindow).toHaveBeenCalledWith(42);
    });

    test("Escape keeps a change that has words, and closes it otherwise", async () => {
        const {closed, button} = opened(row(42, 0));
        await flush();
        vi.advanceTimersByTime(600);
        button("Change it first").click();
        await flush();
        const box = document.querySelector("textarea");
        box.value = "only the slow ones";
        box.dispatchEvent(new Event("input"));
        await flush();
        document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
        await flush();
        expect(document.body.textContent).toContain("Escape keeps your change. Press Cancel to drop it.");
        expect(closed).not.toHaveBeenCalled();
        button("Cancel").click();
        await flush();
        document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
        expect(closed).toHaveBeenCalled();
    });

    test("a click on the dimmed page only nudges it, and Close closes it as seen", async () => {
        const {acts, closed, button} = opened(row(42, 0));
        await flush();
        document.querySelector(".dialog").click();
        await flush();
        expect([closed.mock.calls.length, document.querySelector(".dialog-panel").classList.contains("nudged")]).toEqual([0, true]);
        button("Close").click();
        expect([closed.mock.calls.length, acts.noteWindow.mock.calls[0]]).toEqual([1, [42]]);
    });
});
