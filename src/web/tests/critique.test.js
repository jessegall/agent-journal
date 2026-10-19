import {expect, test} from "vitest";
import {critiqueBrief, critiqueTemplates} from "../src/domain/critique.js";

test("a critique brief names the reviewers, the depth, the plan and the template it follows", () => {
    const plan = {id: 17, title: "The phone app"};
    expect(critiqueBrief({agents: 1, size: "a quick look", plan, template: null})).toBe("Please have one agent give plan 17 a quick look, and compile what they find into a report linked to the plan.");
    expect(critiqueBrief({agents: 3, size: "a thorough review", plan, template: {id: 2, title: "Risks first"}})).toBe(
        "Please have 3 agents give plan 17 a thorough review, following template 2 (Risks first), and compile what they find into a report linked to the plan."
    );
});

test("only critique templates are offered", () => {
    expect(critiqueTemplates([{id: 1, purpose: "critique"}, {id: 2, purpose: ""}]).map((t) => t.id)).toEqual([1]);
});
