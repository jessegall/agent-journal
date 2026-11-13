import {expect, test} from "vitest";
import {chooseTab as choose, mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

const texts = (element, selector) => [...element.querySelectorAll(selector)].map((node) => node.textContent.trim());
const boardReads = (reads) => reads.filter((line) => line.startsWith("assign-rule board")).length;

test("the Assign tab lists the main agent once, a worker with its facts and a program and model", async () => {
    const {element} = await mount();
    await choose(element, "assign");
    expect(texts(element, "[data-assign-target] .name")).toEqual(["Main agent", "worker 5", "claude sonnet"]);
    expect(element.querySelector('[data-assign-target="agent:42"]').textContent).toContain("Open tasks: 2");
});

test("the main agent's rules show their place, their conditions in plain words and a warning", async () => {
    const {element} = await mount();
    await choose(element, "assign");
    expect(texts(element, "[data-assign-rule] .summary")).toEqual(["complexity is at least 4", "all of: tag has backend; text has the word migration"]);
    expect(texts(element, "[data-assign-rule] .place")).toEqual(["1", "2"]);
    expect(texts(element, "[data-assign-warning]")).toEqual(["its agent is retired"]);
    expect(element.querySelector("[data-assign-editor]").textContent).toContain("all of these conditions");
});

test("each rule shows the tasks it gave in the last day and its last skip, and a rule that never matched says so", async () => {
    const {element} = await mount();
    await choose(element, "assign");
    expect(texts(element, "[data-assign-activity]")).toEqual(["Tasks given in the last day: 3", "Never matched a task"]);
    expect(texts(element, "[data-assign-last-skip]")).toEqual(["Last skipped: rule 7 skipped: worker 5 holds 3 of 3"]);
});

test("adding a rule sends its target, its conditions and the revision read", async () => {
    const {element, runs} = await mount();
    await choose(element, "assign");
    const value = element.querySelector("[data-assign-editor] input");
    value.value = "4";
    value.dispatchEvent(new Event("input"));
    await settled();
    element.querySelector("[data-assign-editor] .save").click();
    await settled();
    expect(runs).toEqual([["assign-rule", "make", "--target", "main", "--condition", "complexity minimum 4", "--revision", "r1", "--environment", "main"]]);
});

test("a rule for a program and model names both", async () => {
    const {element, runs} = await mount();
    await choose(element, "assign");
    element.querySelector('[data-assign-target="model:claude:sonnet"]').click();
    await settled();
    element.querySelector("[data-assign-editor] .save").click();
    await settled();
    expect(runs[0].slice(0, 8)).toEqual(["assign-rule", "make", "--target", "model", "--program", "claude", "--model", "sonnet"]);
});

test("a refused move shows why and reads the rules again", async () => {
    const {element, reads, runs} = await mount({runAnswer: {ok: false, failure: "refused", error: "the rules changed since this draft was read"}});
    await choose(element, "assign");
    const before = boardReads(reads);
    element.querySelector('[data-assign-rule="7"] button[title="Move the rule down"]').click();
    await settled();
    expect(runs).toEqual([["assign-rule", "move", "7", "--to", "2", "--revision", "r1", "--environment", "main"]]);
    expect(element.querySelector("[data-assign-failure]").textContent).toBe("the rules changed since this draft was read");
    expect(boardReads(reads)).toBeGreaterThan(before);
});

test("trying the unsaved rule on a task reads the try and shows what each condition said, running nothing", async () => {
    const {element, reads, runs} = await mount();
    await choose(element, "assign");
    const value = element.querySelector("[data-assign-editor] input");
    value.value = "4";
    value.dispatchEvent(new Event("input"));
    const task = element.querySelector("[data-assign-trial-task]");
    task.value = "12";
    task.dispatchEvent(new Event("input"));
    await settled();
    element.querySelector("[data-assign-try]").click();
    await settled();
    expect(reads.filter((line) => line.startsWith("assign-rule try"))).toEqual(['assign-rule try 12 --condition "complexity minimum 4" --environment main']);
    expect(element.querySelector("[data-assign-trial]").textContent).toContain("The rule would not match task 12");
    expect(element.querySelector("[data-assign-trial]").textContent).toContain("complexity is at least 4: not met");
    expect(runs).toEqual([]);
});

test("counting the last 20 tasks reads the dry run and says how many the rule would have taken", async () => {
    const {element, reads, runs} = await mount();
    await choose(element, "assign");
    const value = element.querySelector("[data-assign-editor] input");
    value.value = "1";
    value.dispatchEvent(new Event("input"));
    await settled();
    element.querySelector("[data-assign-count]").click();
    await settled();
    expect(reads.filter((line) => line.startsWith("assign-rule recent"))).toEqual(['assign-rule recent --condition "complexity minimum 1" --environment main']);
    expect(element.querySelector("[data-assign-recent]").textContent).toBe("The rule would have taken all 20 of the last 20 tasks");
    expect(runs).toEqual([]);
});

test("a main-agent rule warns while the main agent writes no code here", async () => {
    const {element} = await mount({writesCode: false});
    await choose(element, "assign");
    expect(element.querySelector("[data-assign-main-warning]")).not.toBeNull();
    element.querySelector('[data-assign-target="agent:42"]').click();
    await settled();
    expect(element.querySelector("[data-assign-main-warning]")).toBeNull();
});

test("Apply now lists the tasks first and changes them only once the person confirms", async () => {
    const listing = {rule_id: 7, confirmed: false, text: "rule 7: 1 tasks", tasks: [{task_id: 12, title: "Fix the cart", target: "the main agent"}]};
    const {element, reads, runs} = await mount({runAnswer: {ok: true, value: listing}});
    await choose(element, "assign");
    element.querySelector('[data-assign-rule="7"] [data-assign-change="apply"]').click();
    await settled();
    expect(runs).toEqual([["assign-rule", "apply", "7", "--revision", "r1", "--environment", "main"]]);
    expect(texts(element, "[data-assign-listing] .task")).toEqual(["Task 12, Fix the cart: the main agent"]);
    const before = boardReads(reads);
    element.querySelector("[data-assign-confirm]").click();
    await settled();
    expect(runs[1]).toEqual(["assign-rule", "apply", "7", "--confirm", "--revision", "r1", "--environment", "main"]);
    expect(element.querySelector("[data-assign-listing]")).toBeNull();
    expect(boardReads(reads)).toBeGreaterThan(before);
});
