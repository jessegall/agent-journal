import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import AwayCard from "../src/shell/AwayCard.vue";
import SidebarPages from "../src/shell/SidebarPages.vue";

afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
});

const settle = async () => {
    for (let round = 0; round < 4; round++) await Promise.resolve();
    await nextTick();
};

function setHidden(hidden) {
    Object.defineProperty(document, "hidden", {configurable: true, get: () => hidden});
    document.dispatchEvent(new Event("visibilitychange"));
}

function drawn(rows) {
    const element = document.createElement("div");
    createApp({render: () => h(AwayCard, {run: async () => ({ok: true, value: {rows}})})}).mount(element);
    return element;
}

test("coming back after five minutes lists the notices since", async () => {
    vi.useFakeTimers({now: new Date("2026-11-01T10:00:00Z")});
    const element = drawn([{id: 1, title: "Ready to review", created_at: "2026-11-01T10:03:00Z"}, {id: 2, title: "Older", created_at: "2026-11-01T09:00:00Z"}]);
    setHidden(true);
    vi.setSystemTime(new Date("2026-11-01T10:06:00Z"));
    setHidden(false);
    await settle();
    expect(element.querySelectorAll("[data-away-line]").length).toBe(1);
    expect(element.textContent).toContain("Ready to review");
});

test("a short absence shows nothing", async () => {
    vi.useFakeTimers({now: new Date("2026-11-01T10:00:00Z")});
    const element = drawn([{id: 1, title: "Ready", created_at: "2026-11-01T10:00:30Z"}]);
    setHidden(true);
    vi.setSystemTime(new Date("2026-11-01T10:01:00Z"));
    setHidden(false);
    await settle();
    expect(element.querySelector("[data-away-card]")).toBeNull();
});

test("the mini sidebar is marked so its words hide", () => {
    const element = document.createElement("div");
    createApp({render: () => h(SidebarPages, {windows: [], mini: true})}).mount(element);
    expect(element.querySelector("[data-sidebar]").classList.contains("mini")).toBe(true);
});
