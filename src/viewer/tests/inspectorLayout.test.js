import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import Inspector from "../src/resource/Inspector.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {startButtons} from "../src/domain/buttons.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {INSPECTOR_HOST} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {perLine, settle} from "./support/windowContext.js";

const TASK = {noun: "task", module: "journal.core.tasks", fingerprint: "a", reads: "task inspect {row_id}", label: "Task {id} · {state}", title: "{title}", description: "{brief}", width: "medium", components: [], comments: false, events: ["task.*"],
    links: {kinds: [], open: false, outside_plan: false, page_size: 10}, shareable: false};
const ROW = {id: 7, title: "Fix the totals", brief: "Sums are off", state: "started", priority: "normal"};
const SECTION = (name) => ({name, module: "acme.notes", title: name, entry_url: "", line: "", loading: "component", place: "section", slots: [], reads: [], runs: [], events: [], allowed: true, skeleton: [], options: []});
const BUTTON = {name: "tasks.block", slots: ["row.task"], label: "Block the task", runs: "task block {row_id}", fields: [], menu: [], icon: "lock", primary: false, condition: null, tip: "", confirm: "", danger: false};
const mounted = [];
let width = 500;

beforeEach(() => {
    width = 500;
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    vi.stubGlobal("fetch", perLine(async (url) => {
        if (String(url).startsWith("/api/buttons")) return {ok: true, status: 200, json: async () => ({buttons: [BUTTON], missing: {}})};
        return {ok: true, json: async () => ({code: 0, value: {}, error: ""})};
    }));
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {configurable: true, get: () => width});
});

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    delete HTMLElement.prototype.clientWidth;
});

async function catalogueOf(inspectors, ...sections) {
    const catalogue = new WindowCatalogue(async () => ({windows: sections.map(SECTION), inspectors}));
    await catalogue.load();
    return catalogue;
}

async function drawn(catalogue, answers, props = {}, subscriptions = new WindowSubscriptions()) {
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    const lines = [];
    const read = async (line) => {
        lines.push(line);
        return answers[line.join(" ")] ?? {ok: true, value: {rows: [], total: 0, kinds: {}, counterparts: []}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    const host = {catalogue, subscriptions, environment: "main", prompts: new AllowancePrompts(async () => ({ok: true})), shellRead: null};
    const app = createApp({render: () => h(Inspector, {noun: "task", id: 7, read, catalogue, environment: "main", ...props})});
    app.directive("tip", {});
    app.provide(INSPECTOR_HOST, host);
    app.provide(RESOURCE_SUBSCRIPTIONS, subscriptions);
    app.mount(element);
    mounted.push(app);
    await settle();
    return {element, lines};
}

test("it reads the declared line and draws the filled label and title", async () => {
    const {element, lines} = await drawn(await catalogueOf([TASK]), {"task inspect 7": {ok: true, value: ROW}});
    expect(lines[0]).toEqual(["task", "inspect", "7"]);
    expect(element.textContent).toContain("Task 7 · started");
    expect(element.querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
    expect(element.textContent).toContain("Sums are off");
});

test("it draws the declared actions through the row slot and no moves", async () => {
    const {element} = await drawn(await catalogueOf([TASK]), {"task inspect 7": {ok: true, value: ROW}});
    expect(element.querySelector("[data-inspector-actions] [data-button='tasks.block']").textContent).toContain("Block the task");
    expect(element.querySelector("[data-move]")).toBeNull();
});

test("it draws the text and the fields of a plain row", async () => {
    const {element, lines} = await drawn(await catalogueOf([]), {"memory show 7": {ok: true, value: {id: 7, text: "Remember **this**", importance: "high", state: "kept"}}}, {noun: "memory"});
    expect(lines[0]).toEqual(["memory", "show", "7"]);
    expect(element.querySelector("[data-resource-text]").innerHTML).toContain("<strong>this</strong>");
    expect(element.querySelector("[data-resource-fields]").textContent).toContain("Importance");
    expect(element.textContent).toContain("Memory 7 · Kept");
});

test("a component with a tab gets a tab bar", async () => {
    const listing = {...TASK, components: [{window: "acme.main", tab: ""}, {window: "acme.log", tab: "Log"}]};
    const {element} = await drawn(await catalogueOf([listing], "acme.main", "acme.log"), {"task inspect 7": {ok: true, value: ROW}});
    const labels = () => [...element.querySelectorAll("[data-inspector-tabs] [role='radio']")].map((tab) => tab.textContent.trim());
    expect(labels()).toEqual(["Details", "Log"]);
    expect([...element.querySelectorAll("[data-section]")].map((part) => part.dataset.section)).toEqual(["acme.main"]);
    element.querySelectorAll("[data-inspector-tabs] [role='radio']")[1].click();
    await settle();
    expect([...element.querySelectorAll("[data-section]")].map((part) => part.dataset.section)).toEqual(["acme.log"]);
    const plain = await drawn(await catalogueOf([TASK]), {"task inspect 7": {ok: true, value: ROW}});
    expect(plain.element.querySelector("[data-inspector-tabs]")).toBeNull();
});

test("a missing component draws a notice and the rest stays", async () => {
    const listing = {...TASK, components: [{window: "acme.gone", tab: ""}, {window: "acme.here", tab: ""}]};
    const {element} = await drawn(await catalogueOf([listing], "acme.here"), {"task inspect 7": {ok: true, value: ROW}});
    expect(element.querySelector("[data-section-missing]").textContent).toBe("acme.gone is not available");
    expect(element.querySelector("[data-section='acme.here']")).not.toBeNull();
    expect(element.querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
});

test("comments are a tab below wide and a rail at wide", async () => {
    const listing = {...TASK, comments: true, width: "wide"};
    const answers = {"task inspect 7": {ok: true, value: ROW}, "task comments 7 --page 1 --page-size 25": {ok: true, value: {rows: [{id: 1, body: "Looks right"}], total: 1}}};
    const narrow = await drawn(await catalogueOf([listing]), answers);
    expect([...narrow.element.querySelectorAll("[data-inspector-tabs] [role='radio']")].map((tab) => tab.textContent.trim())).toEqual(["Details", "Comments"]);
    expect(narrow.element.querySelector("[data-comment-side]")).toBeNull();
    width = 1200;
    const wide = await drawn(await catalogueOf([listing]), answers);
    expect(wide.element.querySelector("[data-inspector-tabs]")).toBeNull();
    expect(wide.element.querySelector("[data-comment-side]").textContent).toContain("Looks right");
});

test("no links section when links is null", async () => {
    const counted = {"link list --row task:7 --group-counterparts --page-size 1": {ok: true, value: {total: 3, kinds: {doc: 3}, counterparts: []}}};
    const none = await drawn(await catalogueOf([{...TASK, links: null}]), {"task inspect 7": {ok: true, value: ROW}, ...counted});
    expect(none.element.querySelector("[data-inspector-links]")).toBeNull();
    const some = await drawn(await catalogueOf([TASK]), {"task inspect 7": {ok: true, value: ROW}, ...counted});
    expect(some.element.querySelector("[data-inspector-links-count]").textContent).toBe("3");
});

test("a failed read shows the failure line", async () => {
    const {element} = await drawn(await catalogueOf([TASK]), {"task inspect 7": {ok: false, error: "no task 7"}});
    expect(element.querySelector("[data-resource-failure]").textContent).toBe("no task 7");
    expect(element.querySelector("[data-inspector-actions]")).toBeNull();
});

test("a reload on an event keeps the row, so a typed comment survives", async () => {
    const subscriptions = new WindowSubscriptions();
    const listing = {...TASK, comments: true};
    const {element, lines} = await drawn(await catalogueOf([listing]), {"task inspect 7": {ok: true, value: ROW}}, {}, subscriptions);
    element.querySelector(".comment-bar-open").click();
    await settle();
    const box = element.querySelector(".comment-bar textarea");
    box.value = "half a thought";
    box.dispatchEvent(new Event("input"));
    await settle();
    subscriptions.dispatch({event: "task.updated"});
    await new Promise((resolve) => setTimeout(resolve, 200));
    await settle();
    expect(lines.filter((line) => line.join(" ") === "task inspect 7")).toHaveLength(2);
    expect(element.querySelector(".comment-bar textarea").value).toBe("half a thought");
});
