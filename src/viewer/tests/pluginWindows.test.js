import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import PluginRows from "../../core/modules/plugins/web/src/PluginRows.vue";
import SuggestionRows from "../../core/modules/suggestions/web/src/SuggestionRows.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

function mounted(component, rows, ran = []) {
    const context = {read: async () => ({ok: true, value: {rows}}), run: async (line) => (ran.push(line), {ok: true}), follow: () => {}, face: "person"};
    const element = document.createElement("div");
    createApp({setup: () => () => h(component), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return element;
}

test("a plugin row shows its title, release and switch, and its button switches it off", async () => {
    const ran = [];
    const element = mounted(PluginRows, [{id: 1, name: "code-commandments", title: "Code Commandments", release: "v6.26.0", enabled: true}], ran);
    await settled();
    const row = element.querySelector('[data-row="1"]');
    expect(row.textContent).toContain("Code Commandments");
    expect(row.textContent).toContain("v6.26.0");
    expect(row.textContent).toContain("On");
    row.querySelector(".switch").click();
    expect(ran).toEqual(["plugin disable code-commandments"]);
});

test("a suggestion row shows its title and the answer, or that none was given", async () => {
    const element = mounted(SuggestionRows, [{id: 1, title: "Run Code Commandments as a plugin", answer: "declined"}, {id: 2, title: "Pin the design", answer: null}]);
    await settled();
    expect(element.querySelector('[data-row="1"]').textContent).toContain("Answer: declined");
    expect(element.querySelector('[data-row="2"]').textContent).toContain("Answer: none yet");
});
