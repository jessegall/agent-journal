import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const source = (path) => readFileSync(resolve(__dirname, "..", path), "utf8");
const lines = (path, token) => source(path).split("\n").filter((line) => /border(-top|-bottom|-left|-right)?:/.test(line) && line.includes(`var(${token})`));
const DARK = "src/tokens.css";
const LIGHT = "src/light.css";
const INSIDE_A_CARD = [
    "src/resource/agent/AgentNow.vue", "src/resource/agent/AgentStrip.vue", "src/resource/agent/AgentFold.vue", "src/resource/agent/AgentWho.vue",
    "src/resource/agent/AgentBrief.vue", "src/resource/agent/AgentFolds.vue", "src/resource/agent/AgentRecent.vue",
    "../core/modules/plans/web/src/PlanAgents.vue", "../core/modules/questions/web/src/QuestionCard.vue", "../core/modules/agents/web/src/AgentCard.vue",
];

test("the line inside a card is a token in both themes and fainter than the line between cards", () => {
    const hex = (path, token) => source(path).match(new RegExp(`${token}: (#[0-9a-f]{6});`))[1];
    const brightness = (color) => [1, 3, 5].reduce((sum, at) => sum + parseInt(color.slice(at, at + 2), 16), 0);
    expect(brightness(hex(DARK, "--border-inner"))).toBeLessThan(brightness(hex(DARK, "--border")));
    expect(brightness(hex(LIGHT, "--border-inner"))).toBeGreaterThan(brightness(hex(LIGHT, "--border")));
});

test("every part of a card, the plan's agent row, the question block, the agent card and the inspector sections, draws its lines with the token", () => {
    for (const path of INSIDE_A_CARD) expect(lines(path, "--border-inner").length, path).toBeGreaterThan(0);
    expect(source("../core/modules/plans/web/src/PlanAgents.vue")).toMatch(/border-top: 1px solid var\(--border-inner\)/);
    for (const path of INSIDE_A_CARD.filter((one) => !one.endsWith("AgentCard.vue"))) expect(lines(path, "--border"), path).toEqual([]);
});

test("the lines between cards keep --border or the stronger line", () => {
    expect(source("../core/modules/plans/web/src/PlanCards.vue")).toMatch(/border-bottom: 1px solid var\(--border\);/);
    expect(source("../core/modules/agents/web/src/AgentCard.vue")).toMatch(/\.agent-card \{[^}]*border-bottom: 1px solid var\(--border\);/);
    expect(source("../core/modules/questions/web/src/QuestionCard.vue")).toMatch(/border-top: 1px solid var\(--border-2\);[\s\S]*border-bottom: 1px solid var\(--border-2\);/);
});
