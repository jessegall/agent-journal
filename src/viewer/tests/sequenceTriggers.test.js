import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import SequenceTriggers from "../../core/modules/sequences/web/src/SequenceTriggers.vue";
import {startWords, triggerBody, triggersProblem} from "../../core/modules/sequences/web/src/sequenceTriggers.js";

const SEQUENCE = {id: 4, title: "Release", steps: ["one"], triggers: JSON.stringify([{trigger_type: "phrase", text: "give me an update"}]), step_guards: "[]"};

test("triggers read as sentences, and none says it starts by hand", () => {
    expect(startWords([{trigger_type: "file", pattern: "src/*.py"}])).toEqual(["When a file matching “src/*.py” is edited"]);
    expect(startWords([])).toEqual(["Only when you or the agent start it"]);
});

test("a trigger is sent with only the fields its type reads, and a missing one is named", () => {
    expect(triggerBody({trigger_type: "phrase", text: " go ", pattern: "x", tool: "y", moment: ""})).toEqual({trigger_type: "phrase", text: "go"});
    expect(triggersProblem([{trigger_type: "file", pattern: ""}])).toContain("A file is edited");
    expect(triggersProblem([{trigger_type: "tool", tool: "Edit", pattern: ""}])).toBe("");
});

test("the triggers are edited as cards and saved on the sequence", async () => {
    const window = context({});
    window.lines = [];
    window.run = async (line) => (window.lines.push(line), {ok: true, value: null});
    const element = await mounted(SequenceTriggers, window, {sequence: SEQUENCE});
    expect(element.querySelector("[data-sequence-trigger]").textContent).toContain("give me an update");
    element.querySelector("[data-sequence-triggers-edit]").click();
    await settle();
    element.querySelector("[data-sequence-trigger-remove]").click();
    await settle();
    element.querySelector("[data-sequence-trigger-add]").click();
    await settle();
    const input = element.querySelector('[data-trigger-field="text"]');
    input.value = "ship it";
    input.dispatchEvent(new Event("input"));
    await settle();
    element.querySelector("[data-sequence-triggers-save]").click();
    await settle();
    expect(window.lines).toEqual([["sequence", "edit", "4", "--triggers", JSON.stringify([{trigger_type: "phrase", text: "ship it"}])]]);
});
