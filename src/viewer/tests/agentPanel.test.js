import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentFacts from "../src/resource/AgentFacts.vue";
import RowMoves from "../src/resource/RowMoves.vue";
import {movesOf} from "../src/domain/resourceKinds.js";

afterEach(() => (document.body.innerHTML = ""));

const settle = async () => {
    for (let round = 0; round < 4; round++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
};

function mounted(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props)}).mount(element);
    return element;
}

test("a running agent offers pause and stop, a paused one resume, an ended one nothing", () => {
    expect(movesOf("agent", {ended_at: null, paused_at: null}).map((move) => move.word)).toEqual(["pause", "stop"]);
    expect(movesOf("agent", {ended_at: null, paused_at: "2026-11-01T10:00:00Z"}).map((move) => move.word)).toEqual(["resume", "stop"]);
    expect(movesOf("agent", {ended_at: "2026-11-01T10:00:00Z"})).toEqual([]);
});

test("stopping an agent asks before it runs", async () => {
    const ran = [];
    const element = mounted(RowMoves, {kind: "agent", id: 7, row: {ended_at: null, paused_at: null}, read: async (line) => (ran.push(line.join(" ")), {ok: true, value: {}})});
    element.querySelector('[data-move="stop"]').click();
    await settle();
    expect(ran).toEqual([]);
    expect(element.querySelector("[data-resource-confirm]").textContent).toContain("Stop the agent?");
    element.querySelector("[data-resource-confirm-yes]").click();
    await settle();
    expect(ran).toEqual(["agent stop 7"]);
});

test("the panel lists the agent's task, plan, subagents and skills", async () => {
    const answers = {
        "agent list --parent 7": {rows: [{id: 8, session: "s-8"}]},
        "agent-skill list --agent 7": {rows: [{id: 1, name: "journal"}, {id: 2, name: "plain"}]},
        "task list --holder 7 --state started": {rows: [{id: 40, title: "Fix the cart"}]},
        "plan place 40": {plan_id: 3},
    };
    const element = mounted(AgentFacts, {id: 7, read: async (line) => ({ok: true, value: answers[line.join(" ")]})});
    await settle();
    expect(element.querySelector("[data-agent-task-link]").textContent).toContain("Fix the cart");
    expect(element.querySelector("[data-agent-plan-link]")).not.toBeNull();
    expect(element.querySelector("[data-agent-subagents]").textContent).toContain("1 subagents");
    expect(element.querySelector("[data-agent-skills]").textContent).toContain("2 skills");
    element.querySelector("[data-agent-skills]").click();
    await settle();
    expect(element.querySelectorAll("[data-agent-skill]").length).toBe(2);
});
