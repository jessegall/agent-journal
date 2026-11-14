import {readFileSync, readdirSync, statSync} from "node:fs";
import {join, resolve} from "node:path";
import {expect, test} from "vitest";

const SOURCE_ROOTS = ["../../core", "../../suites", "../src"].map((root) => resolve(__dirname, root));
const TOKENS = resolve(__dirname, "../src/tokens.css");
const filesUnder = (folder) => readdirSync(folder).flatMap((name) => {
    if (name === "node_modules" || name === "dist" || name === "tests") return [];
    const path = join(folder, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
});
const sources = SOURCE_ROOTS.flatMap(filesUnder).filter((path) => /\.(vue|css)$/.test(path));
const ruleOf = (css, selector) => css.match(new RegExp(`(?:^|\\n)${selector} \\{([^}]*)\\}`))?.[1] ?? "";

test("every select takes the viewer's tokens: background, border, radius, text colour, an arrow and a focus ring", () => {
    const css = readFileSync(TOKENS, "utf8");
    const select = ruleOf(css, "select");
    expect(select).toContain("appearance: none");
    expect(select).toContain("border: 1px solid var(--border-2)");
    expect(select).toContain("border-radius: 7px");
    expect(select).toContain("background-color: var(--bg)");
    expect(select).toContain("color: var(--text)");
    expect(select).toMatch(/background-image: linear-gradient\(45deg[^;]*var\(--text-3\)/);
    expect(ruleOf(css, "select:focus-visible")).toContain("box-shadow: 0 0 0 2px var(--accent-dim)");
    expect(ruleOf(css, "select\\[multiple\\]")).toContain("background-image: none");
    expect(ruleOf(css, "option")).toContain("background: var(--raised)");
});

test("no window styles its own select box over the shared one", () => {
    const own = sources.filter((path) => path !== TOKENS && /(^|[\s,}])select\s*\{[^}]*(border|background)/m.test(readFileSync(path, "utf8")));
    expect(own).toEqual([]);
});

// the places that draw a raw select, each of which the shared rule styles
const PLACES = ["usage/web/src/UsagePanel.vue", "setting_components/web/src/SettingChoiceField.vue", "tasks/web/src/TaskGroups.vue", "agents/web/src/AgentJobForm.vue", "skills/web/src/SkillTriggerEditor.vue", "skills/web/src/SkillRequirements.vue",
    "profiles/web/src/HelperStartForm.vue", "workers/web/src/WorkerRouteForm.vue", "resource/ExecutionClassRow.vue", "resource/ExecutionClassForm.vue", "resource/ExecutionLanes.vue"];

test("the raw selects of the viewer and the module windows are the ones this change covers", () => {
    const drawn = sources.filter((path) => /<select\b/.test(readFileSync(path, "utf8")));
    expect(drawn.map((path) => PLACES.find((place) => path.endsWith(place)) ?? path).sort()).toEqual([...PLACES].sort());
});
