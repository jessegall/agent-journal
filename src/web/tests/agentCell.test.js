import {describe, expect, test} from "vitest";
import {orchestraOf, splitTask} from "../src/domain/orchestra.js";

describe("the name an agent's cell is titled with", () => {
    test("a subagent dispatched as 'Name: job' is titled with the name and keeps the job below", () => {
        expect(splitTask("Dr. Einstein: profile the slow hooks")).toEqual({name: "Dr. Einstein", job: "profile the slow hooks"});
        expect(splitTask("profile the slow hooks")).toEqual({name: "Subagent", job: "profile the slow hooks"});
    });

    test("a subagent of the main agent is titled with its name and says whose it is in its Kind line", () => {
        const environment = {name: "main", owner: "", subagents: [{session: "s1", parent: "p", task: "Coco Rams: draw the plan card", type: "designer", running: true, started: 1}]};
        const [cell] = orchestraOf([environment], [], 1000);
        expect(cell).toMatchObject({name: "Coco Rams", title: "draw the plan card", label: "Subagent", of: "of the main agent", sub: true});
    });
});
