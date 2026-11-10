import {createApp, h, reactive} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import InformationBar from "../src/shell/InformationBar.vue";
import {settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const GROUPS = [
    {key: "model", label: "Model", choices: [{value: "opus", label: "Opus"}]},
    {key: "effort", label: "Reasoning effort", choices: [{value: "high", label: "High"}]},
];
const USAGE = {agents: [{id: 7, model: "sonnet", effort: "low", context_percent: 40}], windows: []};

function answers(failure) {
    return (line) => {
        if (line[1] === "controls") return {ok: true, value: {groups: GROUPS}};
        if (line[1] === "programs") return {ok: true, value: {rows: [{name: "claude", title: "Claude Code"}]}};
        return failure ? {ok: false, error: failure} : {ok: true, value: {}};
    };
}

async function drawn(agent, failure, gate) {
    const ran = [];
    const reply = answers(failure);
    const row = agent ? reactive(agent) : null;
    const element = document.createElement("div");
    document.body.append(element);
    const run = async (line) => (ran.push(line.join(" ")), gate && line[1] !== "controls" && line[1] !== "programs" ? await gate : null, reply(line));
    createApp({render: () => h(InformationBar, {agent: row, run, usage: USAGE, controlGroups: GROUPS, agentPrograms: [{name: "claude", title: "Claude Code"}]})}).mount(element);
    await settle();
    return {element, ran, row};
}

test("the model and the effort are the facts of the bar, and each is chosen from them", async () => {
    const {element, ran} = await drawn({id: 7, number: 3, ended_at: null, program: "claude", session: "s"});
    expect(ran).toEqual([]);
    expect(element.querySelector('[data-fact="model"]').textContent).toContain("sonnet");
    element.querySelector('[data-fact="model"]').click();
    await settle();
    document.querySelector('[data-agent-choice="opus"]').click();
    await settle();
    expect(ran).toContain("agent control 3 model opus");
    expect(element.querySelector('[data-fact="model"]').textContent).toContain("Opus");
    expect(element.textContent).not.toContain("was sent");
});

test("a chosen model shows before the server answers and goes back when it refuses", async () => {
    let release;
    const gate = new Promise((resolve) => (release = resolve));
    const {element} = await drawn({id: 7, number: 3, ended_at: null, program: "claude", session: "s"}, "not now", gate);
    element.querySelector('[data-fact="model"]').click();
    await settle();
    document.querySelector('[data-agent-choice="opus"]').click();
    await settle();
    expect(element.querySelector('[data-fact="model"]').textContent).toContain("Opus");
    release();
    await settle();
    expect(element.querySelector('[data-fact="model"]').textContent).toContain("sonnet");
    expect(element.querySelector("[data-agent-failure]").textContent).toBe("not now");
});

test("stopping asks first and can be kept running", async () => {
    const {element, ran} = await drawn({id: 7, number: 3, ended_at: null, program: "claude", session: "s"});
    element.querySelector('[data-fact="agent"]').click();
    await settle();
    document.querySelector("[data-agent-stop]").click();
    await settle();
    expect(document.querySelector("[data-agent-stop-ask]")).not.toBeNull();
    expect(ran).not.toContain("agent stop 3");
    document.querySelector("[data-agent-stop-confirm]").click();
    await settle();
    expect(ran).toContain("agent stop 3");
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
