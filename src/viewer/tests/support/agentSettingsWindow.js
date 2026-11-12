import {afterEach} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import AgentSettings from "../../../suites/coding/web/src/AgentSettings.vue";
import {context as windowContext, settle} from "./windowContext.js";

export const AUTO = "journal.suites.coding.auto-mode";
export const SENDS = "journal.suites.coding.workers.main-dispatches-workers";
export const WRITES = "journal.suites.coding.main-writes-code";
export const LIMIT = "journal.suites.coding.tests.example";

const KEYS = {
    work: {line: "work-settings show", events: ["setting.*"]},
    "work-screen": {line: "setting-screen show work", events: ["setting.*"]},
    "tests-screen": {line: "setting-screen show tests", events: ["setting.*"]},
    "advanced-screen": {line: "setting-screen show advanced", events: ["setting.*"]},
    find: {line: "setting-screen index", events: ["setting.*"]},
    limits: {line: "agent limits", tab: "agents", events: ["agent.*", "setting.*"]},
};
const RULE = JSON.stringify({rule: "number", minimum: 0, integer: true, maximum: null, exclusive: false});

export const node = (key, kind, value, extra = {}) => ({key, kind, component: kind === "flag" ? "toggle" : kind, section: "A section", parent: null, title: `Title of ${key}`, description: "", value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});

export const SCREENS = () => ({
    work: {screen: "work", revision: "w1", nodes: [node(AUTO, "flag", true), node(SENDS, "flag", true), node(WRITES, "flag", true)]},
    tests: {screen: "tests", revision: "t1", nodes: [node(LIMIT, "number", 3, {rule: RULE})]},
    advanced: {screen: "advanced", revision: "a1", nodes: [node("journal.core.helpers.example", "flag", false, {section: "Another section"})]},
});

// the work settings read as the coding suite answers it: two presets over the same three switches
export const WORK = () => ({
    revision: "k1",
    presets: [
        {key: "builder", name: "Builder", line: "The main agent writes code itself.", values: {[AUTO]: true, [SENDS]: true, [WRITES]: true}},
        {key: "orchestrator", name: "Orchestrator", line: "The main agent plans and merges.", values: {[AUTO]: false, [SENDS]: true, [WRITES]: false}},
    ],
    switches: [{key: AUTO, title: "Auto mode"}, {key: SENDS, title: "Main agent sends workers"}, {key: WRITES, title: "Main agent writes code"}],
});

// Find a setting as the index read answers: a setting of each long tab and one of a helper type screen
export const INDEX = () => [
    {key: AUTO, title: "Auto mode", description: "The journal hands the main agent its next task.", path: "Work > A section", screen: "work", section: "A section"},
    {key: LIMIT, title: "Example limit", description: "A number on the Tests tab.", path: "Tests > A section", screen: "tests", section: "A section"},
    {key: "journal.core.helpers.read-only-helper-run-limit", title: "Read-only helpers running", description: "Helpers of each profile that run at once.", path: "Helpers > Read only", screen: "helper-type.read-only", section: "Every profile"},
];

const mounted = [];
afterEach(() => mounted.splice(0).forEach(({app, element}) => { app.unmount(); element.remove(); }));

export async function mountAgentSettings({readOnly = false} = {}) {
    const runs = [];
    const answers = SCREENS();
    const context = {
        ...windowContext({}, null, KEYS),
        environment: "main",
        readOnly,
        read: async (line) => {
            if (line.startsWith("setting-screen show")) return {ok: true, value: answers[line.split(" ")[2]]};
            if (line.startsWith("work-settings show")) return {ok: true, value: WORK()};
            if (line.startsWith("setting-screen index")) return {ok: true, value: {rows: INDEX()}};
            return {ok: true, value: {rows: []}};
        },
        run: async (line) => (runs.push(line), {ok: true}),
        follow: () => {},
        open: () => {},
        option: () => ({value: null}),
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({setup: () => () => h(AgentSettings), provide: {[WINDOW_CONTEXT]: context}});
    mounted.push({app, element});
    app.mount(element);
    await settle();
    return {element, runs};
}
