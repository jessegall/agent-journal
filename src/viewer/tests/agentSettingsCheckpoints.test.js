import {nextTick} from "vue";
import {expect, test, vi} from "vitest";
import {SettingsScreen, settingComponents, useSettingsDraft} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const GROUP = "journal.core.plans.checkpoints";
const REVIEW = `${GROUP}.quick-review`;
const MODEL = `${GROUP}.review-model`;
const COMMAND = `${GROUP}.command`;
const WAIT = `${GROUP}.wait-for-person`;

// the nodes as setting-screen show work answers them for the four checkpoint settings
const node = (key, kind, component, title, value, extra = {}) => ({key, kind, component, section: "Checkpoints", parent: null, title, description: `About ${title}.`, value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});
const NODES = [
    node(REVIEW, "flag", "toggle", "Quick review at a checkpoint", false),
    node(MODEL, "choice", "choice", "Review model", "sonnet", {choices: ["sonnet", "equal"], requires: [REVIEW]}),
    node(COMMAND, "text", "text", "Command to run at a checkpoint", ""),
    node(WAIT, "flag", "toggle", "Wait for the user at a checkpoint", false),
];

function drawn() {
    const draft = useSettingsDraft({run: vi.fn(async () => ({ok: true})), reload: vi.fn(async () => {})});
    draft.load([{screen: "work", revision: "w1", nodes: NODES}]);
    return {draft, ...drawnSettingComponent(SettingsScreen, {nodes: NODES, draft})};
}
const row = (screen, key) => screen.element.querySelector(`[data-setting="${key}"]`);

test("the generated screen draws a section Checkpoints with the setting of each kind and nothing was added to draw them", () => {
    const screen = drawn();
    expect(screen.element.querySelector("[data-section=checkpoints] h4").textContent).toBe("Checkpoints");
    expect(row(screen, REVIEW).querySelector("[role=switch]")).not.toBeNull();
    expect(row(screen, COMMAND).querySelector("input.setting-text")).not.toBeNull();
    expect(row(screen, WAIT).querySelector("[role=switch]")).not.toBeNull();
    expect(Object.keys(settingComponents)).toEqual(["toggle", "number", "choice", "entry-list", "number-list", "text", "keyed-cap-table", "three-way-cap", "per-type-override"]);
});

test("the review model is hidden until the review is on and then offers its choices", async () => {
    const screen = drawn();
    expect(row(screen, MODEL)).toBeNull();
    row(screen, REVIEW).querySelector("[role=switch]").click();
    await nextTick();
    expect([...row(screen, MODEL).querySelectorAll("option")].map((option) => option.textContent)).toEqual(["Sonnet", "Equal"]);
    row(screen, REVIEW).querySelector("[role=switch]").click();
    await nextTick();
    expect(row(screen, MODEL)).toBeNull();
});
