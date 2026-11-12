import {afterEach} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import AgentSettings from "../../../suites/coding/web/src/AgentSettings.vue";
import {context as windowContext, settle} from "./windowContext.js";

export const AUTO = "journal.suites.coding.auto-mode";
export const SENDS = "journal.suites.coding.workers.main-dispatches-workers";
export const WRITES = "journal.suites.coding.main-writes-code";
export const LIMIT = "journal.suites.coding.tests.example";
export const WORKER_RUN = "journal.suites.coding.workers.worker-run-limit";
export const WORKER_KEPT = "journal.suites.coding.workers.worker-kept-limit";
export const READ_ONLY_RUN = "journal.core.helpers.read-only-helper-run-limit";
export const READ_ONLY_KEPT = "journal.core.helpers.read-only-helper-kept-limit";
export const PROFILE_LIMITS = "journal.core.helpers.read-only-helper-profile-limits";
const CONTEXT = "journal.core.helpers.context-limit";
export const CONTEXT_KINDS = `${CONTEXT}-kinds`;
export const CONTEXT_PROFILES = `${CONTEXT}-profiles`;

const KEYS = {
    work: {line: "work-settings show", events: ["setting.*"]},
    "work-screen": {line: "setting-screen show work", events: ["setting.*"]},
    "tests-screen": {line: "setting-screen show tests", events: ["setting.*"]},
    "advanced-screen": {line: "setting-screen show advanced", events: ["setting.*"]},
    "helper-types-screen": {line: "setting-screen show helper-type", events: ["setting.*"]},
    find: {line: "setting-screen index", events: ["setting.*"]},
    limits: {line: "agent limits", loading: "requested", events: ["agent.*", "setting.*"]},
    "type-screen": {line: "setting-screen show helper-type", loading: "requested", arguments: ["type"], events: ["setting.*"]},
    "count-agents": {line: "agent cards --show all --reusable", arguments: ["role", "profile", "page"], loading: "requested", events: ["agent.*"]},
};
const RULE = JSON.stringify({rule: "number", minimum: 0, integer: true, maximum: null, exclusive: false});

export const node = (key, kind, value, extra = {}) => ({key, kind, component: kind === "flag" ? "toggle" : kind, section: "A section", parent: null, title: `Title of ${key}`, description: "", value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});

export const SCREENS = () => ({
    work: {screen: "work", revision: "w1", nodes: [node(AUTO, "flag", true), node(SENDS, "flag", true), node(WRITES, "flag", true)]},
    tests: {screen: "tests", revision: "t1", nodes: [node(LIMIT, "number", 3, {rule: RULE})]},
    advanced: {screen: "advanced", revision: "a1", nodes: [
        node("journal.core.helpers.example", "flag", false, {section: "Another section"}),
        node(`${CONTEXT}-on`, "flag", true, {section: "Context size"}),
        node(`${CONTEXT}-tokens`, "number", 400000, {section: "Context size", rule: RULE}),
        node(`${CONTEXT}-kinds`, "list", ["worker:200000"], {section: "Context size", component: "keyed-cap-table"}),
    ]},
    "helper-type": {screen: "helper-type", revision: "h1", nodes: [
        node(`${CONTEXT}-profiles`, "list", ["journal-researcher:150000"], {section: "Context cap", component: "three-way-cap"}),
    ]},
});

// the screens of the helper types as setting-screen show helper-type answers them
export const TYPE_SCREENS = () => ({
    workers: {screen: "helper-type.workers", revision: "hw1", nodes: [node(WORKER_RUN, "number", 1, {section: "Workers", title: "Workers running", rule: RULE}), node(WORKER_KEPT, "number", 3, {section: "Workers", title: "Workers kept", rule: RULE})]},
    merger: {screen: "helper-type.merger", revision: "hm1", nodes: [node("journal.suites.coding.workers.merger-wait-minutes", "number", 10, {section: "Merger", rule: RULE})]},
    "read-only": {screen: "helper-type.read-only", revision: "hr1", nodes: [node(READ_ONLY_RUN, "number", 4, {section: "Every profile", rule: RULE}), node(READ_ONLY_KEPT, "number", 8, {section: "Every profile", rule: RULE}), node(PROFILE_LIMITS, "list", ["journal-researcher:2:5"], {section: "Every profile", component: "entry-list"})]},
});

// the agent limits read: workers at their running limit, and the read-only helpers with a researcher, the merger and the designer
export const LIMITS = () => [
    {key: "worker", label: "Worker", line: "Writes the code of a task.", default_profile: "journal-worker", running: 1, kept: 3, run_limit: 1, kept_limit: 3, run_setting: WORKER_RUN, kept_setting: WORKER_KEPT, per_profile: false, profiles: []},
    {key: "helper", label: "Read-only helper", line: "Reads and reports.", running: 1, kept: 3, run_limit: 4, kept_limit: 8, run_setting: READ_ONLY_RUN, kept_setting: READ_ONLY_KEPT, per_profile: true, profiles: [
        {profile: "journal-researcher", title: "Researcher", line: "Finds out and reports.", running: 1, kept: 2, run_limit: 4, kept_limit: 8, group: "helpers"},
        {profile: "journal-merger", title: "Merger", line: "Takes in workers.", running: 0, kept: 1, run_limit: 1, kept_limit: 0, group: "merger"},
        {profile: "journal-designer", title: "Designer", line: "Designs a screen.", running: 0, kept: 0, run_limit: 1, kept_limit: 0, group: "designer"},
    ]},
];

export const AGENTS = () => [
    {id: 42, number: 5, role: "worker", state: "idle", program: "claude", created_at: "2026-11-01T09:00:00Z", ended_at: "2026-11-01T10:00:00Z", facts: {given_name: "Ada", model: "sonnet", task_title: "Fix the cart"}},
    {id: 43, number: 6, role: "worker", state: "running", program: "claude", created_at: "2026-11-01T11:00:00Z", process_started_at: "2026-11-01T11:00:00Z", facts: {given_name: "Bo", model: "sonnet", task_title: "Fix the till"}},
];

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
    {key: READ_ONLY_RUN, title: "Read-only helpers running", description: "Helpers of each profile that run at once.", path: "Helpers > Read only", screen: "helper-type.read-only", section: "Every profile"},
];

const mounted = [];
afterEach(() => mounted.splice(0).forEach(({app, element}) => { app.unmount(); element.remove(); }));

// the settings window with everything it reads answered; the counts can be made unreadable for the two reads that open the window and its Helpers tab
export async function mountAgentSettings({readOnly = false, unreadable = false, agents = AGENTS()} = {}) {
    const runs = [];
    const reads = [];
    const answers = SCREENS();
    const types = TYPE_SCREENS();
    let failures = unreadable ? 2 : 0;
    const context = {
        ...windowContext({}, null, KEYS),
        environment: "main",
        readOnly,
        read: async (line) => {
            reads.push(line);
            if (line.startsWith("setting-screen show helper-type") && line.includes("--type ")) return {ok: true, value: types[line.split("--type ")[1].split(" ")[0]]};
            if (line.startsWith("setting-screen show")) return {ok: true, value: answers[line.split(" ")[2]]};
            if (line.startsWith("work-settings show")) return {ok: true, value: WORK()};
            if (line.startsWith("setting-screen index")) return {ok: true, value: {rows: INDEX()}};
            if (line.startsWith("agent limits")) {
                if (failures > 0) return (failures -= 1, {ok: false, failure: "refused", error: "no answer"});
                return {ok: true, value: {rows: LIMITS()}};
            }
            if (line.startsWith("agent cards")) return {ok: true, value: {rows: agents, page: 1, size: 25, total: agents.length}};
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
    return {element, runs, reads};
}

// opens one tab of the agent settings and lets it settle
export async function chooseTab(element, tab) {
    element.querySelector(`[data-tab=${tab}]`).click();
    await settle();
}
