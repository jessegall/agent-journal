import {h} from "vue";
import {expect, test} from "vitest";
import FitnessPanel from "../../core/modules/usage/web/src/FitnessPanel.vue";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {mounted} from "./support/windowContext.js";
import {fitnessWindowContext} from "./support/fitnessWindowContext.js";
import {context as agentContext} from "./support/agentWindowContext.js";

const page = (rows) => ({ok: true, value: {rows, total: rows.length, page: 1, size: 25}});

test("fitness names only the activity it counts", async () => {
    const fitness = {is_measured: true, score: 60, measures: []};
    const element = await mounted(FitnessPanel, fitnessWindowContext({"usage fitness": {ok: true, value: fitness}}, 7));
    expect(element.querySelector(".fitness-note").textContent).toBe("Counts messages, waits and tasks.");
});

test("a helper with no job has a plain label", async () => {
    const helper = {id: 6, session: "s-1", program: "claude", role: "helper", access: "read-only", ended_at: "2026-11-02T10:00:00Z"};
    const lines = {"agent transcript 6": page([])};
    const element = await mounted({render: () => h(AgentCard, {row: helper, facts: {instruction: ""}, open: true})}, {...agentContext(lines), tabs: [{key: "transcript", label: "Transcript"}]});
    expect(element.querySelector("[data-agent-no-job]").textContent).toBe("No job recorded");
});
