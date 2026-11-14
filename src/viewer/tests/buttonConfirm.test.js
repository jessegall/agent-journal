import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ButtonSlot from "../src/kit/ButtonSlot.vue";
import {startButtons} from "../src/domain/buttons.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {perLine, settle} from "./support/windowContext.js";

const ROW = {id: 12, term: "task", title: "A task", state: "open"};
const BASE = {name: "tasks.lock", slots: ["row.task"], label: "Lock the task", runs: "task lock {row_id}", fields: [], menu: [], icon: "lock", primary: false, condition: null, tip: "", confirm: "", danger: false};
const mounted = [];
let offers, writes;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    offers = [];
    writes = [];
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        if (String(url).startsWith("/api/buttons")) return {ok: true, status: 200, json: async () => ({buttons: offers, missing: {}})};
        writes.push(JSON.parse(init.body));
        return {ok: true, json: async () => ({code: 0, value: {}, error: ""})};
    }));
});

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function slot(button) {
    offers = [button];
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ButtonSlot, {name: "row.task", row: ROW, environment: "main"})});
    app.directive("tip", {});
    app.mount(element);
    mounted.push(app);
    await settle();
    return element;
}

async function click(element, selector) {
    element.querySelector(selector).click();
    await settle();
}

test("a button with a confirm line asks first", async () => {
    const element = await slot({...BASE, confirm: "Lock this task?"});
    await click(element, '[data-button="tasks.lock"]');
    expect(writes).toHaveLength(0);
    expect(element.querySelector("[data-button-confirm]").textContent).toContain("Lock this task?");
    await click(element, "[data-button-confirm-yes]");
    expect(writes.at(-1)).toMatchObject({line: ["task", "lock", "12"], environment: "main"});
});

test("choosing Back runs nothing", async () => {
    const element = await slot({...BASE, confirm: "Lock this task?"});
    await click(element, '[data-button="tasks.lock"]');
    await click(element, "[data-button-confirm-back]");
    expect(writes).toHaveLength(0);
    expect(element.querySelector("[data-button-confirm]")).toBeNull();
    expect(element.querySelector('[data-button="tasks.lock"]')).not.toBeNull();
});

test("a danger button has the danger class", async () => {
    const element = await slot({...BASE, danger: true});
    expect(element.querySelector('[data-button="tasks.lock"]').classList.contains("danger")).toBe(true);
    const plain = await slot(BASE);
    expect(plain.querySelector('[data-button="tasks.lock"]').classList.contains("danger")).toBe(false);
});

test("a button with a warning says it in its tip and has a fallback icon", async () => {
    const element = await slot({...BASE, icon: "", warning: "shows no icon"});
    const button = element.querySelector('[data-button="tasks.lock"]');
    expect(button.title).toContain("shows no icon");
    expect(button.querySelector("svg")).not.toBeNull();
});

test("a button without a confirm line runs at once", async () => {
    const element = await slot(BASE);
    await click(element, '[data-button="tasks.lock"]');
    expect(writes).toHaveLength(1);
});
