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
async function draw(declaration, extra = {}, folded = true) {
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
            }),
    });
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    apps.push(app);
    await settle();
    return host;
}
test.each(["Document", "Report", "Memory", "Dump", "Task", "Question"])(
    "%s has a title and time above its worded actions",
    async (word) => {
        const host = await draw({word});
        expect(host.querySelector(".chat-dock-head").textContent).toContain("Example");
        expect(host.querySelector(".dock-title").title).toBe("Example");
        expect(host.querySelector("[data-dock-age]").textContent).toBe("10m ago");
        const foot = host.querySelector(".chat-dock-foot");
        expect(foot.textContent).toContain(word);
        expect([...foot.querySelectorAll("button")].map((b) => b.textContent.trim())).toEqual(["Open", "Close"]);
        expect(host.querySelector("[data-dock-fold]")).toBeNull();
    }
);
test("each plan state has its pill and Phases before Open and Close", async () => {
    for (const badge of ["Planned", "Started", "Paused", "Done", "Cancelled"]) {
        const host = await draw({badge, folds: "Phases"});
        expect(host.querySelector(".chat-dock-foot .dock-badge").textContent).toBe(badge);
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
test("a kept run has flush controls before its duration and Kept on the bottom line", async () => {
    const host = await draw(
        {folds: "Output", leaves_after_seconds: 5, buttons: [{icon: "stop", label: "Stop", runs: "output stop {row_id}"}]},
        {kept: true}
    );
    const pin = host.querySelector('[data-dock-action="unkeep"]');
    expect(pin.getAttribute("aria-pressed")).toBe("true");
    expect(pin.getAttribute("aria-label")).toBe("Let this card close");
    expect(host.querySelector(".chat-dock-head .dock-controls")).toContain(pin);
    expect(host.querySelector(".chat-dock-foot").textContent).toContain("Kept");
    expect(host.querySelector("[data-dock-fold]").textContent).toContain("Output");
});

test("a plan under review says so with a badge, and any other waiting card has none", () => {
    expect(dockBadgeOf("", {state: "reviewing"})).toBe("Under review");
    expect(dockBadgeOf("", {state: "ready"})).toBe("");
    expect(dockBadgeOf("Started", {state: "started"})).toBe("Started");
});

