import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {h, inject, nextTick, onMounted} from "vue";
import WindowSkeleton from "../src/kit/WindowSkeleton.vue";
import {paneLayout, browserCopy} from "../src/windows/paneLayout.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import WindowHost from "../src/windows/WindowHost.vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {appended as drawn} from "./support/windowContext.js";

const line = (size, width = "50%") => ({shape: "line", size, width, height: 0, count: 1, spacing: 0, padding: "", parts: []});
const circle = {shape: "circle", size: "large", width: "", height: 0, count: 1, spacing: 0, padding: "", parts: []};
const card = (parts) => ({shape: "card", size: "medium", width: "", height: 0, count: 2, spacing: 8, padding: "12px 14px", parts});

beforeEach(() => localStorage.clear());
afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
});

test("the parts wrap each other: a card holds its circle and lines, as many times as its count", () => {
    const element = drawn(WindowSkeleton, {parts: [card([circle, line("large"), line("small", "30%")])]});
    const cards = element.querySelectorAll("[data-skeleton-card]");
    expect(cards.length).toBe(2);
    expect(cards[0].querySelectorAll("[data-skeleton-line]").length).toBe(2);
    expect(cards[0].querySelector("[data-skeleton-circle]").style.width).toBe("40px");
    expect(element.querySelector("[data-skeleton-line]").style.height).toBe("15px");
});

test("no skeleton part has a border", async () => {
    const {readFileSync} = await import("node:fs");
    const {resolve} = await import("node:path");
    for (const file of ["../src/kit/SkeletonParts.vue", "../src/kit/WindowSkeleton.vue", "../src/kit/Skeleton.vue"]) expect(readFileSync(resolve(__dirname, file), "utf8"), file).not.toMatch(/\bborder(-(top|right|bottom|left|color|style|width))?:/);
});

test("the catalogue keeps each window's skeleton in this browser, so a new page has it before the catalogue answers", async () => {
    const parts = [line("large")];
    await new WindowCatalogue(async () => ({windows: [{name: "a.b", place: "pane", skeleton: parts}]})).load();
    const next = new WindowCatalogue(async () => new Promise(() => {}));
    expect(next.skeleton("a.b")).toEqual(parts);
    expect(next.skeleton("a.gone")).toEqual([]);
});

test("the first paint draws the layout this browser last had, before the user, suite and driver are known", async () => {
    const at = {environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"};
    const shape = {dir: "row", r: 0.7, a: {tabs: ["a.b"], active: "a.b"}, b: {tabs: ["c.d"], active: "c.d"}};
    const first = paneLayout({saved: async () => null, defaults: async () => shape, save: async () => ({ok: true}), entry: () => null, tab: {read: () => null, write: () => {}}});
    await first.load(at);
    const next = paneLayout({saved: async () => null, defaults: async () => null, save: async () => ({ok: true}), entry: () => null, tab: {read: () => null, write: () => {}}});
    expect(next.ready.value).toBe(false);
    next.drawKept("main", "home");
    expect(next.ready.value).toBe(true);
    expect(next.layout.value.tree.r).toBe(0.7);
    expect(browserCopy.read("journal.last-layout.main.home")).toEqual(at);
});

test("a new browser with no kept layout waits for the journal", () => {
    const next = paneLayout({saved: async () => null, defaults: async () => null, save: async () => ({ok: true}), entry: () => null, tab: {read: () => null, write: () => {}}});
    next.drawKept("main", "home");
    expect(next.ready.value).toBe(false);
});

test("a window's own skeleton stays over it until its reads have answered", async () => {
    vi.useFakeTimers();
    let answer;
    vi.stubGlobal("fetch", vi.fn((url) => (url === "/api/read-lines" ? Promise.resolve({ok: true, status: 200, json: async () => ({reads: ["usage show"]})}) : new Promise((resolve) => (answer = resolve)))));
    const Reading = {
        setup() {
            const context = inject(WINDOW_CONTEXT);
            onMounted(() => context.read("usage show"));
            return () => h("p", {class: "body"}, "loaded");
        },
    };
    const element = drawn(WindowHost, {name: "a.b", component: Reading, subscriptions: {stopAll: () => {}, follow: () => {}}, skeleton: [line("large")]});
    await vi.advanceTimersByTimeAsync(200);
    expect(element.querySelector("[data-window-skeleton]")).not.toBeNull();
    expect(element.querySelector(".body")).not.toBeNull();
    answer({ok: true, json: async () => ({code: 0, value: "usage"})});
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(element.querySelector("[data-window-skeleton]")).toBeNull();
    vi.unstubAllGlobals();
});

// message 101493: sending a message reads the chat again, and that must not bring the skeleton back
test("a read after the first load never brings the skeleton back", async () => {
    vi.useFakeTimers();
    const answers = [];
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => answers.push(resolve))));
    let readAgain;
    const Reading = {
        setup() {
            const context = inject(WINDOW_CONTEXT);
            readAgain = () => context.read("usage show again");
            onMounted(() => context.read("usage show"));
            return () => h("p", {class: "body"}, "loaded");
        },
    };
    const element = drawn(WindowHost, {name: "a.b", component: Reading, subscriptions: {stopAll: () => {}, follow: () => {}}, skeleton: [line("large")]});
    await vi.advanceTimersByTimeAsync(10);
    answers.shift()({ok: true, json: async () => ({code: 0, value: "usage"})});
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(element.querySelector("[data-window-skeleton]")).toBeNull();
    readAgain();
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(element.querySelector("[data-window-skeleton]")).toBeNull();
    answers.shift()({ok: true, json: async () => ({code: 0, value: "usage"})});
    await vi.advanceTimersByTimeAsync(200);
    vi.unstubAllGlobals();
});

test("a window that reads nothing shows no skeleton after it mounts", async () => {
    vi.useFakeTimers();
    const element = drawn(WindowHost, {name: "a.b", component: {render: () => h("p", "plain")}, subscriptions: {stopAll: () => {}, follow: () => {}}, skeleton: [line("large")]});
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(element.querySelector("[data-window-skeleton]")).toBeNull();
});
