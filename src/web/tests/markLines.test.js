import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

const lines = Array.from({length: 13}, (_, i) => `finding ${i + 1}`);
const message = {table: "messages", id: 1, created_at: new Date(1e4).toISOString(), creator: "plugin:lint", author: "system", text: "Lint found 13 problems", files: [], comments_on: [], idempotency: "", data: {kind: "plugin", plugin: "lint", detail: lines.join("\n"), collapsed: true, row: ""}};
const scope = {env: "", api: {}, rows: () => [], loaded: () => true, holding: () => {}, earlier: () => {}};

test("a card with thirteen lines opens thirteen rows under it on a click and closes on a second", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const {turns} = threadTurns([message], []);
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Turn, {turn: turns[0]})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    expect(host.querySelectorAll(".mark-line").length).toBe(0);
    host.querySelector(".mark").click();
    await nextTick();
    expect(host.querySelectorAll(".mark-line").length).toBe(13);
    expect(host.querySelector(".mark .detail")).toBeNull();
    host.querySelector(".mark").click();
    await nextTick();
    expect(host.querySelectorAll(".mark-line").length).toBe(0);
    app.unmount();
    host.remove();
});
