import {afterEach, expect, test} from "vitest";
import {context, mounted, settle, typeInto as typed} from "./support/windowContext.js";
import SequenceCards from "../../core/modules/sequences/web/src/SequenceCards.vue";

afterEach(() => (document.body.innerHTML = ""));

const SEQUENCE = {id: 1, title: "Release", steps: ["Run the suite", "Tag it"], created_at: "2026-11-01T10:00:00Z"};
const RUN = {id: 9, sequence_id: 1, session_agent_id: 3, title: "Release", steps: JSON.stringify(SEQUENCE.steps), step_number: 2, step_started: true};

async function drawn(runs = []) {
    const ran = [];
    const window = context({"sequence board": {ok: true, value: {rows: [SEQUENCE], runs}}}, null, {board: {line: "sequence board", events: ["sequence.*", "sequence_run.*"]}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(SequenceCards, window), ran};
}


const panel = () => document.body.querySelector(".dialog-panel");

test("a new sequence has its title and steps, in the order chosen", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-sequence-new]").click();
    await settle();
    expect(panel().querySelector("[data-sequence-create]").disabled).toBe(true);
    typed(panel().querySelector("[data-sequence-title]"), "Shipping");
    typed(panel().querySelector("[data-step-text]"), "Tag it");
    await settle();
    panel().querySelector("[data-step-add]").click();
    await settle();
    typed(panel().querySelectorAll("[data-step-text]")[1], "Run it");
    await settle();
    panel().querySelectorAll("[data-step-up]")[1].click();
    await settle();
    panel().querySelector("[data-sequence-create]").click();
    await settle();
    expect(ran).toContainEqual(["sequence", "make", "Shipping", "--steps", "Run it | Tag it"]);
});

test("the steps of a sequence are edited and saved", async () => {
    const {element, ran} = await drawn();
    element.querySelector('[data-row="1"]').click();
    await settle();
    expect(panel().textContent).toContain("Run the suite");
    expect(panel().textContent).toContain("Only when you or the agent start it");
    panel().querySelector("[data-sequence-edit]").click();
    await settle();
    panel().querySelectorAll("[data-step-remove]")[0].click();
    await settle();
    panel().querySelector("[data-sequence-save]").click();
    await settle();
    expect(ran).toContainEqual(["sequence", "edit", "1", "--steps", "Tag it", "--step-guards", JSON.stringify([{file_edits_allowed: true, allowed_commands: []}])]);
});

test("a run shows on the card and in the sequence with the step it is on", async () => {
    const {element} = await drawn([RUN]);
    expect(element.querySelector('[data-row="1"]').textContent).toContain("1 running now");
    element.querySelector('[data-row="1"]').click();
    await settle();
    const runs = panel().querySelector("[data-sequence-runs]");
    expect(runs.textContent).toContain("Agent 3");
    expect(runs.textContent).toContain("Step 2 of 2");
    expect(runs.querySelector(".current").textContent).toBe("Tag it");
    expect(panel().querySelector(".stop.now").textContent).toContain("In progress");
});

test("deleting a sequence asks a second time", async () => {
    const {element, ran} = await drawn();
    element.querySelector('[data-row="1"]').click();
    await settle();
    panel().querySelector("[data-sequence-delete]").click();
    await settle();
    expect(ran).toEqual([]);
    panel().querySelector("[data-sequence-delete]").click();
    await settle();
    expect(ran).toContainEqual(["sequence", "delete", "1"]);
});
