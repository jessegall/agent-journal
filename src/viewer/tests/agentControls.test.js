import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import AgentControls from "../src/shell/AgentControls.vue";
import {settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));


const GROUPS = [{key: "model", label: "Model", choices: [{value: "opus", label: "Opus"}]}];
const answers = (failure = null) => (line) => {
    if (line[1] === "controls") return {ok: true, value: {groups: GROUPS}};
    if (line[1] === "programs") return {ok: true, value: {rows: [{name: "claude", title: "Claude Code"}]}};
    return failure ? {ok: false, error: failure} : {ok: true, value: {}};
};

async function drawn(agent, failure) {
    const ran = [];
    const reply = answers(failure);
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(AgentControls, {agent, run: async (line) => (ran.push(line.join(" ")), reply(line))})}).mount(element);
    await settle();
    return {element, ran};
}

test("a running agent's model is chosen from what its program offers", async () => {
    const {element, ran} = await drawn({id: 7, ended_at: null});
    expect(ran).toContain("agent controls 7");
    element.querySelector('[data-agent-control="model"]').click();
    await settle();
    document.querySelector('[data-agent-choice="opus"]').click();
    await settle();
    expect(ran).toContain("agent control 7 model opus");
    expect(element.querySelector("[data-agent-told]").textContent).toContain("Opus");
});

test("stopping asks first and can be kept running", async () => {
    const {element, ran} = await drawn({id: 7, ended_at: null});
    element.querySelector("[data-agent-stop]").click();
    await settle();
    expect(element.querySelector("[data-agent-stop-ask]")).not.toBeNull();
    expect(ran).not.toContain("agent stop 7");
    element.querySelector("[data-agent-stop-confirm]").click();
    await settle();
    expect(ran).toContain("agent stop 7");
});

test("with no agent it offers the programs to start, and a refusal says why", async () => {
    const {element, ran} = await drawn(null, "no launcher is running here");
    element.querySelector("[data-agent-start]").click();
    await settle();
    document.querySelector('[data-agent-program="claude"]').click();
    await settle();
    expect(ran).toContain("agent launch claude");
    expect(element.querySelector("[data-agent-failure]").textContent).toBe("no launcher is running here");
});

test("a running agent is paused and a paused one resumed", async () => {
    const {element, ran} = await drawn({id: 7, ended_at: null, paused_at: null});
    element.querySelector("[data-agent-pause]").click();
    await settle();
    expect(ran).toContain("agent pause 7");
    const paused = await drawn({id: 8, ended_at: null, paused_at: "2026-11-01T10:00:00Z"});
    expect(paused.element.querySelector("[data-agent-pause]")).toBeNull();
    paused.element.querySelector("[data-agent-resume]").click();
    await settle();
    expect(paused.ran).toContain("agent resume 8");
});

