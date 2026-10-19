import {describe, expect, test} from "vitest";
import {orchestraOf, splitTask} from "../src/domain/orchestra.js";
import {store} from "../src/state/store.js";

describe("the name an agent's cell is titled with", () => {
    test("a subagent dispatched as 'Name: job' is titled with the name and keeps the job below", () => {
        expect(splitTask("Dr. Einstein: profile the slow hooks")).toEqual({name: "Dr. Einstein", job: "profile the slow hooks"});
        expect(splitTask("profile the slow hooks")).toEqual({name: "Subagent", job: "profile the slow hooks"});
    });

    test("a subagent is titled with its name and its Kind line says only subagent", () => {
        store.rows = {messages: [{table: "messages", id: 1, author: "system", created_at: new Date(1000).toISOString(), data: {kind: "subagent", agent: 7, detail: "Coco Rams: draw the plan card", agent_type: "designer", subagent: "s1", state: "running"}}]};
        const [cell] = orchestraOf({environments: []}, [], {id: 7}, "main");
        expect(cell).toMatchObject({name: "Coco Rams", title: "draw the plan card", label: "Subagent", sub: true});
    });
});
