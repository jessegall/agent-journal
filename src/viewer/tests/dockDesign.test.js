import {dockBadgeOf} from "../src/domain/resourceNouns.js";
import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockWrapper from "../src/chat/DockWrapper.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

const apps = [];
afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});
async function draw(declaration, extra = {}, folded = true, collapsed = false, listeners = {}) {
    vi.stubGlobal(
        "ResizeObserver",
        class {
            observe() {}
            disconnect() {}
        }
    );
    loadDockDeclarations([{type: "sample.card", icon: "docs", title: "{row_title}", reads: ["doc show"], ...declaration}]);
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {title: "Example"}})}));
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({
        render: () =>
            h(DockWrapper, {
                item: {
                    id: 7,
                    type: "sample.card",
                    target_model: "doc",
                    target_id: 3,
                    row_title: "Example",
                    created_at: new Date(Date.now() - 601000).toISOString(),
                    ...extra,
                },
                folded,
                collapsed,
                ...listeners,
            }),
    });
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    apps.push(app);
    await settle();
    return host;
}
test.each(["Document", "Report", "Memory", "Dump", "Task", "Question"])(
    "%s has a title and time above, and its worded actions below",
    async (word) => {
        const host = await draw({word});
        expect(host.querySelector(".chat-dock-head").textContent).toContain("Example");
        expect(host.querySelector(".dock-title").title).toBe("Example");
        expect(host.querySelector("[data-dock-age]").textContent).toBe("10m ago");
        const foot = host.querySelector(".chat-dock-foot");
        expect(host.querySelector(".chat-dock-head [data-dock-row]").textContent).toBe(`${word} 3`);
        expect(foot.querySelector("[data-dock-row]")).toBeNull();
        expect([...foot.querySelectorAll("button")].map((b) => b.textContent.trim())).toEqual([]);
        expect([...host.querySelectorAll(".chat-dock-head button")].map((b) => b.title)).toEqual(["Open in the inspector", "Dismiss this card"]);
        expect(host.querySelector("[data-dock-fold]")).toBeNull();
    }
);
test.each([["Document", "doc", 1223], ["Report", "report", 1255], ["Memory", "memory", 42]])(
    "%s shows its target row number",
    async (word, target_model, target_id) => {
        const host = await draw({word}, {target_model, target_id});
        expect(host.querySelector("[data-dock-row]").textContent).toBe(`${word} ${target_id}`);
    }
);
test("a dock without a declared word names its row type and number", async () => {
    const host = await draw({}, {target_model: "task", target_id: 17});
    expect(host.querySelector("[data-dock-row]").textContent).toBe("Task 17");
});
test("each plan state has its pill in the head and Phases in the foot", async () => {
    for (const badge of ["Planned", "Started", "Paused", "Done", "Cancelled"]) {
        const host = await draw({badge, folds: "Phases"});
        expect(host.querySelector(".chat-dock-head .dock-badge").textContent).toBe(badge);
        expect(host.querySelector("[data-dock-fold]").classList.contains("bordered")).toBe(false);
        expect(host.querySelector("[data-dock-acts], .dock-acts").previousElementSibling).toBe(host.querySelector("[data-dock-fold]"));
        expect(host.querySelector("[data-dock-fold]").textContent).toContain("Phases");
        expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("false");
    }
});
test("a waiting card is described without a badge and its refusal stays outside the fold", async () => {
    const host = await draw({needs_user: true, folds: "Phases"});
    expect(host.querySelector("section").getAttribute("aria-label")).toBe("Example, waiting for you");
    expect(host.querySelector("section").classList.contains("waiting")).toBe(true);
    expect(host.textContent).not.toContain("Needs you");
});
test("a kept run has a pressed pin before its duration and no Kept text", async () => {
    const host = await draw(
        {folds: "Output", leaves_after_seconds: 5, buttons: [{icon: "stop", label: "Stop", runs: "output stop {row_id}"}]},
        {kept: true}
    );
    const pin = host.querySelector('[data-dock-action="unkeep"]');
    expect(pin.getAttribute("aria-pressed")).toBe("true");
    expect(pin.getAttribute("aria-label")).toBe("Let this card close");
    expect(host.querySelector(".chat-dock-head .dock-controls")).toContain(pin);
    expect(host.textContent).not.toContain("Kept");
    expect(host.querySelector("[data-dock-fold]").textContent).toContain("Output");
});

test("a plan under review says so with a badge, and any other waiting card has none", () => {
    expect(dockBadgeOf("", {state: "reviewing"})).toBe("Under review");
    expect(dockBadgeOf("", {state: "ready"})).toBe("");
    expect(dockBadgeOf("Started", {state: "started"})).toBe("Started");
});


test("a collapsed card keeps Open and the X, and pressing the X dismisses it without expanding it", async () => {
    const told = [];
    const host = await draw({}, {}, true, true, {onUndock: (button) => told.push(button.action), onOpen: () => told.push("expand")});
    expect([...host.querySelectorAll(".chat-dock-head button")].map((b) => b.title)).toEqual(["Open in the inspector", "Dismiss this card"]);
    host.querySelector("[data-dock-action='undock']").click();
    expect(told).toEqual(["undock"]);
});

test("a collapsed card hides the pin and the card elsewhere still expands it", async () => {
    const told = [];
    const host = await draw({leaves_after_seconds: 5}, {}, true, true, {onOpen: () => told.push("expand")});
    expect(host.querySelector("[data-dock-action='keep']")).toBeNull();
    host.querySelector(".dock-title").click();
    expect(told).toEqual(["expand"]);
});
