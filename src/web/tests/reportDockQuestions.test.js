import {createApp, h, nextTick} from "vue";
import {afterEach, describe, expect, test, vi} from "vitest";
import {dockedReport} from "../src/domain/docks.js";
import ReportDock from "../src/chat/ReportDock.vue";
import {store} from "../src/state/store.js";

const report = {n: 7, ref: "report:7", title: "What the search costs", abstract: "", brief: "It costs little.", refs: []};
const question = (n, refs, extra = {}) => ({n, ref: `question:${n}`, type: "question", title: "Which one?", refs, seen: [], completed: 0, deleted: 0, data: {}, ...extra});

async function shown() {
    const host = window.document.createElement("div");
    createApp({render: () => h(ReportDock, {report})}).mount(host);
    await nextTick();
    return host;
}

describe("a report's bar in the chat", () => {
    afterEach(() => {
        store.rows.question = [];
    });

    test("says plainly that the report has questions for the user while one about it is open", async () => {
        store.rows.question = [question(1, ["report:7"])];
        expect((await shown()).textContent).toContain("Has questions for you");
    });

    test("says nothing of questions when none is open about it", async () => {
        store.rows.question = [question(1, ["report:8"]), question(2, ["report:7"], {completed: 5})];
        expect((await shown()).textContent).not.toContain("Has questions for you");
    });
});

describe("a report closed from the chat of another environment", () => {
    test("is closed in the environment the chat belongs to, not the one the viewer is looking at", async () => {
        const act = vi.fn(() => Promise.resolve());
        const host = window.document.createElement("div");
        createApp({render: () => h(ReportDock, {report})})
            .provide("scope", {env: "ticket-9", api: {act}, rows: () => []})
            .mount(host);
        await nextTick();
        [...host.querySelectorAll("button")].filter((one) => !one.textContent.trim()).at(-1).click();
        expect(act).toHaveBeenCalledWith("report", 7, "dismiss");
    });
});

describe("the report above the chat", () => {
    const made = (extra = {}) => ({n: 1, created: 100, seen: [], completed: 0, deleted: 0, data: {}, ...extra});

    test("stays until it is closed, read, or the person has written to the agent since it came", () => {
        expect([dockedReport([made()]).n, dockedReport([made()], 99).n]).toEqual([1, 1]);
        expect([dockedReport([made()], 100), dockedReport([made()], 200), dockedReport([made({seen: ["user"]})]), dockedReport([made({data: {dismissed: true}})])]).toEqual([null, null, null, null]);
    });
});
