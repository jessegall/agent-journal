import {describe, expect, test} from "vitest";
import {orchestraOf, splitTask} from "../src/domain/orchestra.js";
import {store} from "../src/state/store.js";

describe("the name an agent's cell is titled with", () => {
    test("a subagent dispatched as 'Name: job' is titled with the name and keeps the job below", () => {
        expect(splitTask("Dr. Einstein: profile the slow hooks")).toEqual({name: "Dr. Einstein", job: "profile the slow hooks"});
        expect(splitTask("profile the slow hooks")).toEqual({name: "Subagent", job: "profile the slow hooks"});
    });

    test("a subagent is titled with its name and its Kind line says only subagent", () => {
        store.rows = {
            subagents: [
                {
                    table: "subagents",
                    id: 1,
                    dispatcher: "s7",
                    task: "Coco Rams: draw the plan card",
                    agent_type: "designer",
                    session: "s1",
                    state: "running",
                    started_at: 1,
                    ended_at: 0,
                    resumed_at: 0,
                },
            ],
        };
        const [cell] = orchestraOf({environments: []}, [], {id: 7, session: "s7"}, "main");
        expect(cell).toMatchObject({name: "Coco Rams", title: "draw the plan card", label: "Subagent", sub: true});
    });
});
