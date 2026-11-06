import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import FitnessPanel from "../../core/modules/usage/web/src/FitnessPanel.vue";
import LoadPanel from "../../core/modules/usage/web/src/LoadPanel.vue";
import InformationBar from "../src/shell/InformationBar.vue";
import {mounted} from "./support/windowContext.js";
import {fitnessWindowContext as context} from "./support/fitnessWindowContext.js";

const FITNESS = {is_measured: true, score: 60, workload: 0.8, workload_level: "warn", measures: [{key: "message_wait", label: "Oldest message waiting, minutes", value: 15, pass_level: 5, pass_share: 0.6, weight: 3}, {key: "completion_rate", label: "Tasks completed an hour", value: 1, pass_level: null, pass_share: 1, weight: 0}]};

function bar(fitness) {
    const opened = [];
    const element = document.createElement("div");
    createApp(() => h(InformationBar, {agent: {id: 7, session: "s", program: "claude"}, fitness, onOpen: (key) => opened.push(key)})).mount(element);
    return {element, opened};
}

test("the bar shows the score and load, marks them when low or high, and opens the measures", async () => {
    const {element, opened} = bar(FITNESS);
    await settled();
    const shown = element.querySelector('[data-fact="fitness"]');
    expect(shown.textContent.trim()).toBe("60");
    expect(shown.classList.contains("low")).toBe(true);
    expect(element.querySelector('[data-fact="load"]').classList.contains("warn")).toBe(true);
    shown.click();
    expect(opened).toEqual(["fitness"]);
    element.querySelector('[data-fact="load"]').click();
    expect(opened).toEqual(["fitness", "load"]);
});

test("an agent not measured yet shows a dash, and no reading shows nothing", async () => {
    const {element} = bar({...FITNESS, is_measured: false, score: null});
    await settled();
    expect(element.querySelector('[data-fact="fitness"]').textContent).toContain("–");
    const none = bar(null);
    await settled();
    expect(none.element.querySelector('[data-fact="fitness"]')).toBeNull();
});

test("the panel lists each measure and what the score counts", async () => {
    const line = "usage fitness --agent 7";
    const element = await mounted(FitnessPanel, context({[line]: {ok: true, value: FITNESS}}, 7));
    expect(element.querySelector("[data-fitness-head]").textContent).toBe("Fitness: 60 of 100");
    expect(element.querySelector('[data-measure="message_wait"]').textContent).toContain("15 of 5");
    expect(element.querySelector('[data-measure="load"]')).toBeNull();
    expect(element.textContent).toContain("Counts messages, waits and tasks.");
});

test("the load panel names the load and what it is made of", async () => {
    const line = "usage fitness --agent 7";
    const element = await mounted(LoadPanel, context({[line]: {ok: true, value: {...FITNESS, arrivals_hourly: 4, answers_hourly: 5, waiting_messages: 2}}}, 7));
    expect(element.querySelector("[data-load-head]").textContent).toBe("Load 0.80");
    expect(element.querySelector('[data-load-row="arrivals"]').textContent).toContain("4");
    expect(element.querySelector('[data-load-row="answers"]').textContent).toContain("5");
    expect(element.querySelector('[data-load-row="waiting"]').textContent).toContain("2");
});
