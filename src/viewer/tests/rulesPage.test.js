import {expect, test} from "vitest";
import RulesPage from "../../core/modules/project_rules/web/src/RulesPage.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

const rulesContext = (answers) => context(answers, null, {
    rules: {line: "rule list", events: ["rule.*"], page_size: 50},
});

test("rules read their key, put proposals first and keep approve and remove actions", async () => {
    const window = rulesContext({"rule list": page([{id: 2, text: "Use small tests", state: "active"}, {id: 1, text: "Read the brief", state: "proposed"}])});
    const ran = [];
    window.run = async (line) => (ran.push(line), {ok: true});
    const element = await mounted(RulesPage, window);
    expect(window.reads).toEqual(["rule list --limit 50"]);
    expect([...element.querySelectorAll("[data-rule]")].map((row) => row.dataset.rule)).toEqual(["1", "2"]);
    element.querySelector('[data-rule="1"] button').click();
    await settle();
    expect(ran).toEqual([["rule", "approve", "1"]]);
    expect(element.querySelector('[data-rule="2"] button').textContent).toContain("Remove");
});

test("rules page older rows through the declared key", async () => {
    const window = rulesContext({});
    window.read = async (line) => ({ok: true, value: {rows: [{id: line.includes("--before-id") ? 1 : 2, text: line.includes("--before-id") ? "Older rule" : "Newer rule", state: "active"}], page: 1, size: 1, total: 2}});
    const element = await mounted(RulesPage, window);
    element.querySelector("[data-row-list-more]").click();
    await settle();
    expect(element.textContent).toContain("Older rule");
    expect(element.textContent).toContain("Newer rule");
});
