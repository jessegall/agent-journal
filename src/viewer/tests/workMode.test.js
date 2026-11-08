import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import WorkMode from "../../suites/coding/web/src/WorkMode.vue";
import {settle as settled} from "./support/windowContext.js";
import {context as windowContext} from "./support/windowContext.js";

const KEYS = {
    work: {line: "work-settings show", events: ["setting.*"]},
    auto: {line: "setting show journal.suites.coding.auto-mode", events: ["setting.*"]},
    limits: {line: "agent limits", tab: "agents", events: ["agent.*", "setting.*"]},
};
const CONTROL_KEYS = ["auto-mode", "main-writes-code", "workers.main-dispatches-workers", "continue-while-delegatable", "workers.merger-on", "main-starts-helpers", "designer-enabled", "workers.main-agent-may-merge"];
const KEEP_GOING = "journal.suites.coding.continue-while-delegatable";
const WRITES = "journal.suites.coding.main-writes-code";
const SENDS = "journal.suites.coding.workers.main-dispatches-workers";
const WORK = {workflow: "orchestrator", revision: "r1", controls: Object.fromEntries(CONTROL_KEYS.map((key) => [`journal.suites.coding.${key}`, true])),
    depends: {[KEEP_GOING]: [WRITES], "journal.suites.coding.workers.merger-on": [SENDS], "journal.suites.coding.workers.main-agent-may-merge": [SENDS]}};

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
            if (line.startsWith("work-settings show")) return {ok: true, value: WORK};
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

test("the settings button opens the agent settings in a modal, where a preset is chosen", async () => {
    const {element, runs, opened} = await mount();
    expect(document.querySelector("[data-agent-settings]")).toBeNull();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    expect(opened).toEqual([]);
    expect(document.querySelector(".dialog [data-agent-settings], [role=dialog] [data-agent-settings]")).not.toBeNull();
    const presets = [...document.querySelectorAll("[data-agent-settings] [data-work-flow] [role=radio]")];
    expect(presets.map((button) => button.textContent.trim())).toEqual(["Builder", "Orchestrator"]);
    presets[0].click();
    await settled();
    expect(runs).toEqual(["work-settings preset builder --revision r1"]);
});

test("the modal has the tabs of the agent settings", async () => {
    const {element} = await mount();
    element.querySelector("[data-open-agent-settings]").click();
    await settled();
    expect(document.querySelector("[data-agent-settings]").textContent).toMatch(/Work.*Agents.*Tests.*Advanced/s);
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
    const control = (key) => document.querySelector(`[data-agent-settings] [data-control="${key}"]`);
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
    expect(control("journal.suites.coding.workers.merger-on")).toBeNull();
    expect(control("journal.suites.coding.workers.main-agent-may-merge")).toBeNull();
    toggle(SENDS);
    await settled();
    expect(control("journal.suites.coding.workers.merger-on")).not.toBeNull();
});
