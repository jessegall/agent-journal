import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import AgentSettings from "../../suites/coding/web/src/AgentSettings.vue";
import {context as windowContext, settle as settled} from "./support/windowContext.js";

const AUTO = "journal.suites.coding.auto-mode";
const SENDS = "journal.suites.coding.workers.main-dispatches-workers";
const LIMIT = "journal.suites.coding.tests.example";
const KEYS = {
    "work-screen": {line: "setting-screen show work", events: ["setting.*"]},
    "tests-screen": {line: "setting-screen show tests", events: ["setting.*"]},
    "advanced-screen": {line: "setting-screen show advanced", events: ["setting.*"]},
    limits: {line: "agent limits", tab: "agents", events: ["agent.*", "setting.*"]},
};
const RULE = JSON.stringify({rule: "number", minimum: 0, integer: true, maximum: null, exclusive: false});
const node = (key, kind, value, extra = {}) => ({key, kind, component: kind === "flag" ? "toggle" : kind, section: "A section", parent: null, title: `Title of ${key}`, description: "", value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});
const screens = () => ({
    work: {screen: "work", revision: "w1", nodes: [node(AUTO, "flag", true), node(SENDS, "flag", true)]},
    tests: {screen: "tests", revision: "t1", nodes: [node(LIMIT, "number", 3, {rule: RULE})]},
    advanced: {screen: "advanced", revision: "a1", nodes: [node("journal.core.helpers.example", "flag", false, {section: "Another section"})]},
});

const mounted = [];
afterEach(() => mounted.splice(0).forEach(({app, element}) => { app.unmount(); element.remove(); }));

async function mount({readOnly = false} = {}) {
    const runs = [];
    const answers = screens();
    const context = {
        ...windowContext({}, null, KEYS),
        environment: "main",
        readOnly,
        read: async (line) => (line.startsWith("setting-screen show") ? {ok: true, value: answers[line.split(" ")[2]]} : {ok: true, value: {rows: []}}),
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
    await settled();
    return {element, runs};
}

const control = (element, key) => element.querySelector(`[data-setting="${key}"]`);
const tabs = (element) => [...element.querySelectorAll("[role=tab]")].map((tab) => tab.textContent.trim());
const choose = async (element, tab) => { element.querySelector(`[data-tab=${tab}]`).click(); await settled(); };
const note = (element) => element.querySelector("[data-settings-note]").textContent;

test("the shell has the four tabs under the environment and draws the work screen first", async () => {
    const {element} = await mount();
    expect(element.querySelector("[data-settings-environment]").textContent).toBe("main");
    expect(tabs(element)).toEqual(["Work", "Helpers", "Tests", "Advanced"]);
    expect(control(element, AUTO)).not.toBeNull();
    expect(element.querySelector("[data-agent-settings-work]")).not.toBeNull();
});

test("each long tab draws its own screen with the sections on its left", async () => {
    const {element} = await mount();
    await choose(element, "tests");
    expect(control(element, LIMIT)).not.toBeNull();
    expect(control(element, AUTO)).toBeNull();
    expect(element.querySelector("[data-section-link]").textContent).toBe("A section");
    await choose(element, "advanced");
    expect(element.querySelector("[data-section-link]").textContent).toBe("Another section");
});

test("choosing another tab keeps what was changed on the first", async () => {
    const {element} = await mount();
    control(element, AUTO).querySelector("[role=switch]").click();
    await settled();
    await choose(element, "tests");
    await choose(element, "work");
    expect(control(element, AUTO).querySelector("[role=switch]").getAttribute("aria-checked")).toBe("false");
    expect(note(element)).toBe("1 change: Title of journal.suites.coding.auto-mode off");
});

test("one change on Work and one on Tests give a foot of two changes and one request that saves both", async () => {
    const {element, runs} = await mount();
    control(element, AUTO).querySelector("[role=switch]").click();
    await settled();
    await choose(element, "tests");
    const input = control(element, LIMIT).querySelector("input");
    input.value = "9";
    input.dispatchEvent(new Event("input"));
    await settled();
    expect(note(element)).toMatch(/^2 changes: /);
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs).toEqual([["setting-screen", "apply", "work", "--revision", "w1", "--also", "tests=t1", `${AUTO}=off`, `${LIMIT}=9`]]);
});

test("Cancel drops the changes of every tab", async () => {
    const {element} = await mount();
    control(element, AUTO).querySelector("[role=switch]").click();
    await settled();
    await choose(element, "tests");
    const input = control(element, LIMIT).querySelector("input");
    input.value = "9";
    input.dispatchEvent(new Event("input"));
    await settled();
    element.querySelector("[data-settings-cancel]").click();
    await settled();
    expect(input.value).toBe("3");
    expect(note(element)).toContain("No changes");
    await choose(element, "work");
    expect(control(element, AUTO).querySelector("[role=switch]").getAttribute("aria-checked")).toBe("true");
});

test("a viewer who may only read sees the note, every value, controls that are off and no foot", async () => {
    const {element} = await mount({readOnly: true});
    expect(element.querySelector("[data-settings-lock]").textContent).toContain("Only a person can change these settings");
    expect(control(element, AUTO).querySelector("[role=switch]").disabled).toBe(true);
    expect(element.querySelector("[data-settings-apply]")).toBeNull();
    expect(element.querySelector("[data-settings-note]")).toBeNull();
});

test("with Auto off and no workers the Work tab says nothing starts the work", async () => {
    const {element} = await mount();
    expect(element.querySelector("[data-work-hint]")).toBeNull();
    control(element, AUTO).querySelector("[role=switch]").click();
    control(element, SENDS).querySelector("[role=switch]").click();
    await settled();
    expect(element.querySelector("[data-work-hint]").textContent).toContain("nothing starts the work");
    control(element, AUTO).querySelector("[role=switch]").click();
    await settled();
    expect(element.querySelector("[data-work-hint]")).toBeNull();
});
