import {describe, expect, test, vi} from "vitest";

vi.mock("../src/composables/leadAgent.js", async () => ({agentWorking: (await import("vue")).ref(true)}));

const {store} = await import("../src/state/store.js");
const {useWriting} = await import("../src/composables/writing.js");

describe("a row the agent is still writing", () => {
    test("is a document or a report the agent wrote to a moment ago, never a to-do that gained a section", () => {
        const at = Date.now() / 1000;
        store.agentWrites = {"doc:80": {at, section: "Coverage"}, "todo:4677": {at, section: "Why"}};
        expect([useWriting(() => "doc:80").value?.section, useWriting(() => "todo:4677").value]).toEqual(["Coverage", null]);
    });
});
