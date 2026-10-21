import {describe, expect, test, vi} from "vitest";

vi.mock("../src/composables/leadAgent.js", async () => ({agentWorking: (await import("vue")).ref(true)}));

const {store} = await import("../src/state/store.js");
const {useWriting} = await import("../src/composables/writing.js");

describe("a row the agent is still writing", () => {
    test("is a document or a report the agent wrote to a moment ago, never a task", () => {
        const at = Date.now() / 1000;
        store.agentWrites = {"docs:80": {time: at, section: "Coverage"}, "tasks:4677": {time: at, section: "Why"}};
        expect([useWriting(() => "docs:80").value?.section, useWriting(() => "tasks:4677").value]).toEqual(["Coverage", null]);
    });
});
