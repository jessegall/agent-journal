import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import FitnessPanel from "../../core/modules/usage/web/src/FitnessPanel.vue";
import InformationBar from "../src/shell/InformationBar.vue";
import {context, mounted} from "./support/windowContext.js";

const FITNESS = {is_measured: true, score: 60, load: 0.8, load_level: "warn", measures: [{key: "message_wait", label: "Oldest message waiting, minutes", value: 15, pass_level: 5, closeness: 0.6, weight: 3}, {key: "completion_rate", label: "Tasks completed an hour", value: 1, pass_level: null, closeness: 1, weight: 0}]};

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
    expect(shown.textContent).toContain("Fitness 60");
    expect(shown.classList.contains("low")).toBe(true);
    expect(element.querySelector('[data-fact="load"]').classList.contains("warn")).toBe(true);
    shown.click();
    expect(opened).toEqual(["fitness"]);
});

test("an agent not measured yet shows a dash, and no reading shows nothing", async () => {
    const {element} = bar({...FITNESS, is_measured: false, score: null});
    await settled();
    expect(element.querySelector('[data-fact="fitness"]').textContent).toContain("–");
    const none = bar(null);
    await settled();
    expect(none.element.querySelector('[data-fact="fitness"]')).toBeNull();
});

test("the panel lists each measure and says what it cannot count", async () => {
    const line = "usage fitness --agent 7";
    const element = await mounted(FitnessPanel, context({[line]: {ok: true, value: FITNESS}}, 7));
    expect(element.querySelector("[data-fitness-head]").textContent).toBe("Fitness 60 of 100");
    expect(element.querySelector('[data-measure="message_wait"]').textContent).toContain("15 of 5");
    expect(element.querySelector('[data-measure="load"]').textContent).toContain("0.8");
    expect(element.textContent).toContain("does not record");
});
