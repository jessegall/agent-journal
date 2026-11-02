import {createApp, h} from "vue";
import {expect, test} from "vitest";
import PlanCritique from "../src/resource/PlanCritique.vue";
import {critiqueBrief, critiqueTemplates} from "../src/domain/critique.js";
import {settle} from "./support/windowContext.js";

const PLAN = {id: 9, title: "The plan"};

test("the brief names the agents, the plan, how thorough and the template", () => {
    expect(critiqueBrief({agents: 1, size: "a quick look", plan: PLAN})).toBe("Please have one agent give plan 9 a quick look, and compile what they find into a report linked to the plan.");
    expect(critiqueBrief({agents: 3, size: "a normal read", plan: PLAN, template: {id: 2, title: "Missing"}})).toContain("3 agents give plan 9 a normal read, following template 2 (Missing)");
    expect(critiqueTemplates([{id: 1, purpose: "critique"}, {id: 2, purpose: "testing"}]).map((row) => row.id)).toEqual([1]);
});

function shown(read, onClose = () => {}) {
    createApp({render: () => h(PlanCritique, {plan: PLAN, read, onClose})}).mount(document.createElement("div"));
}

test("sending writes the message and closes; a refusal stays open and says why", async () => {
    const lines = [];
    let closed = 0;
    const read = async (line) => (lines.push(line), line[0] === "template" ? {ok: true, value: {rows: []}} : {ok: true, value: {}});
    shown(read, () => closed++);
    await settle();
    document.querySelector("[data-critique-send]").click();
    await settle();
    expect(lines.at(-1).slice(0, 2)).toEqual(["message", "send"]);
    expect(closed).toBe(1);
    document.body.innerHTML = "";
    shown(async (line) => (line[0] === "template" ? {ok: true, value: {rows: []}} : {ok: false, error: "no agent"}));
    await settle();
    document.querySelector("[data-critique-send]").click();
    await settle();
    expect(document.querySelector("[data-critique-failure]").textContent).toBe("no agent");
});
