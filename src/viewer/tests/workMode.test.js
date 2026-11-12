import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import WorkMode from "../../suites/coding/web/src/WorkMode.vue";
import {settle as settled} from "./support/windowContext.js";
import {context as windowContext} from "./support/windowContext.js";
import {styleDeclarations} from "./support/styleDeclarations.js";

const KEYS = {
    work: {line: "work-settings show", events: ["setting.*"]},
    "work-screen": {line: "setting-screen show work", events: ["setting.*"]},
    "tests-screen": {line: "setting-screen show tests", events: ["setting.*"]},
    "advanced-screen": {line: "setting-screen show advanced", events: ["setting.*"]},
    auto: {line: "setting show journal.suites.coding.auto-mode", events: ["setting.*"]},
    limits: {line: "agent limits", tab: "agents", events: ["agent.*", "setting.*"]},
};
const KEEP_GOING = "journal.suites.coding.continue-while-delegatable";
const WRITES = "journal.suites.coding.main-writes-code";
const SENDS = "journal.suites.coding.workers.main-dispatches-workers";
const MERGER = "journal.suites.coding.workers.merger-on";
const MAY_MERGE = "journal.suites.coding.workers.main-agent-may-merge";
const LIMIT_ON = "journal.core.helpers.context-limit-on";
const LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens";
const LIMIT_ACTION = "journal.core.helpers.context-limit-action";
const node = (key, kind, value, extra = {}) => ({key, kind, component: kind === "flag" ? "toggle" : kind, section: "Taking on work", parent: null, title: `Title of ${key}`, description: "", value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});
const SCREENS = {
    work: {screen: "work", revision: "w1", nodes: [node(WRITES, "flag", true), node(KEEP_GOING, "flag", true, {requires: [WRITES]}), node(SENDS, "flag", true), node(MERGER, "flag", true, {requires: [SENDS]}), node(MAY_MERGE, "flag", true, {requires: [SENDS]})]},
    tests: {screen: "tests", revision: "t1", nodes: [node("journal.suites.coding.tests.example", "number", 3, {rule: JSON.stringify({rule: "number", minimum: 0, integer: true, maximum: null, exclusive: false})})]},
    advanced: {screen: "advanced", revision: "a1", nodes: [node(LIMIT_ON, "flag", false, {section: "Context size"}),
        node(LIMIT_TOKENS, "choice", "400000", {section: "Context size", choices: Array.from({length: 10}, (_, place) => String((place + 1) * 100000)), requires: [LIMIT_ON]}),
        node(LIMIT_ACTION, "choice", "compact", {section: "Context size", choices: ["compact", "clear"]})]},
};

const mounted = [];
afterEach(() => mounted.splice(0).forEach(({app, element}) => { app.unmount(); element.remove(); }));

async function mount() {
    const runs = [];
    const opened = [];
    const context = {
        ...windowContext({}, null, KEYS),
        environment: "main",
        read: async (line) => {
            context.reads.push(line);
            if (line.startsWith("setting-screen show")) return {ok: true, value: SCREENS[line.split(" ")[2]]};
            if (line.startsWith("agent limits")) return {ok: true, value: {rows: []}};
            return {ok: true, value: {value: true}};
        },
        run: async (line) => {
            runs.push(line);
            return {ok: true};
        },
        follow: () => {},
        open: (window) => opened.push(window),
        option: () => ({value: null}),
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({setup: () => () => h(WorkMode), provide: {[WINDOW_CONTEXT]: context}});
    mounted.push({app, element});
    app.mount(element);
    await settled();
    return {element, runs, opened, context};
}

test("the top bar keeps only the auto switch and the settings button", async () => {
    const {element} = await mount();
    expect(element.querySelector("[data-auto-toggle]")).not.toBeNull();
    expect(element.querySelector("[data-open-agent-settings]")).not.toBeNull();
    expect(element.querySelector("[data-preset-menu]")).toBeNull();
    expect(element.querySelector("[data-work-settings]")).toBeNull();
    expect(element.querySelector("[data-merger-toggle]")).toBeNull();
});

test("the settings button opens the agent settings in a modal", async () => {
    const {element, opened} = await mount();
    expect(document.querySelector("[data-agent-settings]")).toBeNull();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    expect(opened).toEqual([]);
    expect(document.querySelector(".dialog [data-agent-settings], [role=dialog] [data-agent-settings]")).not.toBeNull();
});

test("the modal has the tabs of the agent settings", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    expect(document.querySelector("[data-agent-settings]").textContent).toMatch(/Work.*Helpers.*Tests.*Advanced/s);
});

test("the agent settings tabs are the viewer's shared tabs, which have a border below them, and choosing one shows its settings", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    const bar = document.querySelector("[data-agent-settings] .settings-bar");
    expect(bar.querySelector("[data-inner-tabs]")).not.toBeNull();
    expect(bar.querySelector(".segmented")).toBeNull();
    expect([...bar.querySelectorAll("[role=tab]")].map((tab) => tab.textContent.trim())).toEqual(["Work", "Helpers", "Tests", "Advanced"]);
    expect(styleDeclarations("kit/InnerTabs.vue", ".inner-tabs")).toMatch(/border-bottom:\s*1px solid/);
    bar.querySelector("[data-tab=tests]").click();
    await settled();
    expect(document.querySelector("[data-agent-settings-tests]")).not.toBeNull();
    expect(bar.querySelector("[data-tab=tests]").getAttribute("aria-selected")).toBe("true");
});

test("the auto switch lives here and sets auto mode", async () => {
    const {element, runs} = await mount();
    element.querySelector("[data-auto-toggle]").click();
    await settled();
    expect(runs).toEqual(["setting set journal.suites.coding.auto-mode false --environment main"]);
});

test("a setting shows only while the settings it depends on are on, and shows again when they are turned back on", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    const control = (key) => document.querySelector(`[data-agent-settings] [data-setting="${key}"]`);
    const toggle = (key) => control(key).querySelector("[role=switch]").click();
    expect(control(KEEP_GOING)).not.toBeNull();
    toggle(WRITES);
    await settled();
    expect(control(KEEP_GOING)).toBeNull();
    toggle(WRITES);
    await settled();
    expect(control(KEEP_GOING)).not.toBeNull();
    toggle(SENDS);
    await settled();
    expect(control(MERGER)).toBeNull();
    expect(control(MAY_MERGE)).toBeNull();
    toggle(SENDS);
    await settled();
    expect(control(MERGER)).not.toBeNull();
});

test("the context limit action is a choice of Compact or Clear, not a number", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    [...document.querySelectorAll("[data-agent-settings] button")].find((button) => button.textContent.trim().startsWith("Advanced")).click();
    await settled();
    const select = document.querySelector(`[data-setting="${LIMIT_ACTION}"] select`);
    expect([...select.options].map((option) => option.textContent)).toEqual(["Compact", "Clear"]);
    expect([...select.options].map((option) => option.value)).toEqual(["compact", "clear"]);
    expect(document.querySelector(`[data-setting="${LIMIT_ACTION}"] .step`)).toBeNull();
});

test("the agent settings dialog has no padding, so its tabs and footer reach its edges and only its settings scroll", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    const body = document.querySelector("[data-agent-settings]").closest(".dialog-body");
    expect(body.classList.contains("padded")).toBe(false);
    expect(body.querySelector(".settings-bar")).not.toBeNull();
});

