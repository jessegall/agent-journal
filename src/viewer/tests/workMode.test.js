import {afterEach, expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import WorkMode from "../../suites/coding/web/src/WorkMode.vue";
import {settle as settled} from "./support/windowContext.js";

const mounted = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

async function mount({driver = "coding.builder", values = {}, follow = () => {}} = {}) {
    const runs = [];
    const opened = [];
    const context = {
        environment: "main",
        read: async (line) => {
            if (line.startsWith("suite current")) return {ok: true, value: {suite: "coding", drivers: `main: ${driver}, worker: coding.worker`}};
            const key = line.split(" ")[2];
            return {ok: true, value: {value: values[key]}};
        },
        run: async (line) => {
            runs.push(line);
            return {ok: true};
        },
        follow,
        open: (window) => opened.push(window),
        option: () => ({value: null}),
    };
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    createApp({setup: () => () => h(WorkMode), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    await settled();
    return {element, runs, opened, context};
}

test("the work modes show the current choice and a pick chooses the driver", async () => {
    const {element, runs} = await mount({driver: "coding.orchestrator"});
    const options = [...element.querySelectorAll(".segmented-option")];
    expect(options.map((option) => option.textContent.trim())).toEqual(["Builder", "Orchestrator"]);
    expect(options[1].classList.contains("on")).toBe(true);
    options[0].click();
    await settled();
    expect(runs).toEqual(["driver choose coding.builder --environment main"]);
    expect(element.querySelector(".segmented-option.on").textContent.trim()).toBe("Builder");
});

test("the settings menu has the merger's switch only while the builder sends workers", async () => {
    const {element} = await mount();
    element.querySelector("[data-work-settings]").click();
    await settled();
    expect(element.querySelector("[data-open-agent-limits]")).toBeNull();
    expect(element.querySelector("[data-work-menu]").textContent).toContain("Merger takes in workers");
    element.querySelector("[data-work-menu] .agentset-row input, [data-work-menu] .agentset-row button").click();
    await settled();
    expect(element.querySelector("[data-work-menu]").textContent).not.toContain("Merger takes in workers");
});

test("opening the menu reads its remaining settings for this environment", async () => {
    const {element, context} = await mount();
    const reads = [];
    const read = context.read;
    context.read = async (line) => { reads.push(line); return read(line); };
    element.querySelector("[data-work-settings]").click();
    await settled();
    expect(reads).toContain("setting show journal.suites.coding.auto-mode --environment main");
    expect(reads).toContain("setting show journal.suites.coding.workers.builder-dispatches-workers --environment main");
    expect(reads.some((line) => line.includes("worker-run-limit"))).toBe(false);
});

test("a setting event refreshes the mode menu settings", async () => {
    const values = {"journal.suites.coding.workers.builder-dispatches-workers": true};
    const followed = [];
    const {element} = await mount({values, follow: (patterns, handler) => followed.push({patterns, handler})});
    element.querySelector("[data-work-settings]").click();
    await settled();
    values["journal.suites.coding.workers.builder-dispatches-workers"] = false;
    followed.find((one) => one.patterns.includes("setting.*")).handler({event: "setting.update"});
    await settled();
    expect(element.querySelector("[data-work-menu] [role=switch]").getAttribute("aria-checked")).toBe("false");
});

test("the auto switch lives here and sets auto mode", async () => {
    const {element, runs} = await mount();
    element.querySelector("[data-auto-toggle]").click();
    await settled();
    expect(runs).toEqual(["setting set journal.suites.coding.auto-mode false --environment main"]);
});

test("a switch while the agent works asks first and can be kept", async () => {
    const {element, runs, context} = await mount({driver: "coding.orchestrator"});
    const read = context.read;
    context.read = async (line) => (line.startsWith("usage bars") ? {ok: true, value: {task_id: 12, helpers: 0}} : read(line));
    element.querySelectorAll(".segmented-option")[0].click();
    await settled();
    expect(runs).toEqual([]);
    expect(element.querySelector("[data-mode-ask]").textContent).toContain("working on task 12");
    element.querySelector("[data-mode-keep]").click();
    await settled();
    expect(element.querySelector("[data-mode-ask]")).toBeNull();
    expect(runs).toEqual([]);
    element.querySelectorAll(".segmented-option")[0].click();
    await settled();
    element.querySelector("[data-mode-switch]").click();
    await settled();
    expect(runs).toEqual(["driver choose coding.builder --environment main"]);
});

