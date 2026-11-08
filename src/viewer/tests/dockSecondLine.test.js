import {createApp, h, ref} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import OpenQuestionsDock from "../../core/modules/questions/web/src/OpenQuestionsDock.vue";
import DockWrapper from "../src/chat/DockWrapper.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {provideDockCard} from "../kit/windowContextKey.js";
import {settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

// the card of waiting questions is drawn in a dock card that gives it the open questions and the places in the card it writes to
async function drawn(titles) {
    const host = document.createElement("div");
    document.body.append(host);
    const head = document.createElement("span");
    const foot = document.createElement("span");
    const actions = document.createElement("span");
    host.append(head, foot, actions);
    const rows = titles.map((text, at) => ({id: at + 1, text}));
    const app = createApp({render: () => h(OpenQuestionsDock)});
    app.provide(WINDOW_CONTEXT, {...dockWindow(), option: (key) => ref({head, foot, actions}[key]), open: () => {}});
    provideDockCard((key, value) => app.provide(key, value), {data: ref({rows}), reload: async () => {}, readOutput: async () => ({ok: false})});
    app.mount(host);
    await settle();
    return {head, foot};
}

test("a card of one waiting question names it by its title on its second line", async () => {
    const {head, foot} = await drawn(["Which database?"]);
    expect(head.textContent).toContain("Agent asked 1 question");
    expect(foot.querySelector("[data-open-questions-titles]").textContent).toBe("Which database?");
    expect(foot.textContent).not.toContain("Kept");
});

test("a card of several waiting questions names the first titles and counts the rest", async () => {
    const {foot} = await drawn(["Which database?", "Keep the old page?", "Ship today?", "Rename it?"]);
    expect(foot.querySelector("[data-open-questions-titles]").textContent).toBe("Which database? · Keep the old page? · 2 more");
});

test("no docked card, kept or not, says Kept", async () => {
    loadDockDeclarations([{type: "sample.card", icon: "docs", title: "{row_title}", reads: ["doc show"]}]);
    vi.stubGlobal("ResizeObserver", class {
        observe() {}

        disconnect() {}
    });
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {title: "Example"}})}));
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(DockWrapper, {item: {id: 7, type: "sample.card", target_model: "doc", target_id: 3, row_title: "Example", created_at: new Date().toISOString(), kept: true}, folded: true})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    await settle();
    expect(host.textContent).not.toContain("Kept");
});
