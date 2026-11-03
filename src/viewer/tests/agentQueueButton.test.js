import {afterEach, expect, test} from "vitest";
import {h} from "vue";
import {context, mounted, page, settle} from "./support/windowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";

const PROOFS = [
    {id: 1, state: "running", test_command: "pytest a"},
    {id: 2, state: "queued", test_command: "pytest b"},
    {id: 3, state: "queued", test_command: "pytest c"},
    {id: 4, state: "checked", test_command: "pytest d"},
    {id: 5, state: "short", test_command: "pytest e"},
    {id: 6, state: "shown", test_command: ""},
];

async function drawn(proofs) {
    const lines = {"agent list": page([]), "agent running": page([]), "usage agents --closed": page([]), "proof list --limit 50": page(proofs)};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    document.body.append(element);
    return element;
}

afterEach(() => {
    location.hash = "";
    document.body.innerHTML = "";
});

test("the search row has a button beside Running, Closed and All that says how many tests wait", async () => {
    const element = await drawn(PROOFS);
    const bar = element.querySelector("[data-agents-search]");
    expect(bar.querySelector("[data-agents-queue]")).not.toBeNull();
    expect(bar.querySelector(".segmented")).not.toBeNull();
    expect(element.querySelector("[data-agents-queue-count]").textContent).toBe("3");
});

test("the count is nought when no test waits", async () => {
    const element = await drawn([PROOFS[3], PROOFS[4]]);
    expect(element.querySelector("[data-agents-queue-count]").textContent).toBe("0");
});

test("the button opens the test queue inspector", async () => {
    const element = await drawn(PROOFS);
    element.querySelector("[data-agents-queue]").click();
    await settle();
    expect(location.hash).toContain("open=test_queue:0");
});
