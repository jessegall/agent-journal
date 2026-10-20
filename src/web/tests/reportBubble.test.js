import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {reportOf} from "../src/domain/report.js";
import {threadTurns} from "../src/domain/thread.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const at = (seconds) => new Date(seconds * 1000).toISOString();
const message = (id, text, data = {}) => ({table: "messages", id, created_at: at(id), author: "agent", text, files: [], data, comments_on: [], idempotency: "", reply_to: null});
const messages = [message(1, "Lady Montagu reports: the footer is fixed", {kind: "report", worker: "Lady Montagu", worker_id: 7}), message(2, "Montagu reports: not a report")];
const scope = {env: "", api: {}, rows: () => messages, loaded: () => true, holding: () => {}, earlier: () => {}};

async function drawn(turn) {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(TurnMessage, {turn})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    const shown = {report: host.querySelector(".thread-turn").classList.contains("report"), bubble: host.querySelector(".thread-bubble").textContent};
    app.unmount();
    host.remove();
    return shown;
}

test("a worker's report is told from the agent's own words by the worker it names", () => {
    const [report, own] = threadTurns(messages, []).turns;
    expect(reportOf(report)).toEqual({worker: "Lady Montagu", text: "the footer is fixed"});
    expect(reportOf(own)).toBe(null);
});

test("a report bubble is marked as a report from its worker and holds only the report", async () => {
    const [report, own] = threadTurns(messages, []).turns;
    const shown = await drawn(report);
    expect(shown.report).toBe(true);
    expect(shown.bubble).toContain("Report from Lady Montagu");
    expect(shown.bubble).toContain("the footer is fixed");
    expect(shown.bubble).not.toContain("reports:");
    expect((await drawn(own)).report).toBe(false);
});
