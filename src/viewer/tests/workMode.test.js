import {afterEach, expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import WorkMode from "../../suites/coding/web/src/WorkMode.vue";

const mounted = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));
const settled = async () => {
    for (let turn = 0; turn < 5; turn++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
};

async function mount({driver = "coding.builder", values = {}} = {}) {
    const runs = [];
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
        follow: () => {},
        option: () => ({value: null}),
    };
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    createApp({setup: () => () => h(WorkMode), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    await settled();
    return {element, runs, context};
}

test("the two modes show as version 4's segmented buttons, the current one on, and a pick chooses the driver", async () => {
    const {element, runs} = await mount({driver: "coding.orchestrator"});
    const options = [...element.querySelectorAll(".segmented-option")];
    expect(options.map((option) => option.textContent.trim())).toEqual(["Builder", "Orchestrator"]);
    expect(options[1].classList.contains("on")).toBe(true);
    options[0].click();
    await settled();
    expect(runs).toEqual(["driver choose coding.builder --environment main"]);
    expect(element.querySelector(".segmented-option.on").textContent.trim()).toBe("Builder");
});

test("the settings open under the caret, and a change sets the setting", async () => {
    const {element, runs} = await mount({values: {"journal.suites.coding.workers.worker-limit": 3}});
    expect(element.querySelector("[data-work-menu]")).toBeNull();
    element.querySelector("[data-work-settings]").click();
    await settled();
    const limit = element.querySelector("[data-work-menu] input");
    expect(limit.value).toBe("3");
    limit.value = "4";
    limit.dispatchEvent(new Event("change"));
    await settled();
    expect(runs).toEqual(["setting set journal.suites.coding.workers.worker-limit 4 --environment main"]);
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

