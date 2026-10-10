import {createApp, h, nextTick} from "vue";
import {afterEach, describe, expect, test} from "vitest";
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
