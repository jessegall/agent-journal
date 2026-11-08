import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockWrapper from "../src/chat/DockWrapper.vue";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import {startButtons} from "../src/domain/buttons.js";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {perLine, settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

const BUTTON = {name: "plans.approve", module: "journal.core.plans", slots: ["dock.plans.waiting", "row.plan"], label: "Approve", runs: "plan approve {row_id}", fields: [], menu: [], condition: {field: "state", values: ["ready"]}};
const mounted = [];
const LISTING = (noun) => ({noun, reads: noun === "plan" ? "plan inspect {row_id}" : `${noun} show {row_id}`, label: "", title: "{title}", description: "", width: "small", components: [], comments: false, events: [],
    links: {kinds: [], open: false, outside_plan: false, page_size: 10}, shareable: false, lists_fields: true, draws_text: false});
const CATALOGUE = {inspector: LISTING, window: () => null, sectionsAt: () => []};

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    location.hash = "";
    vi.unstubAllGlobals();
});

async function prepare(buttons = [BUTTON]) {
    let state = "ready";
    const reads = [];
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        if (String(url).startsWith("/api/buttons")) return {ok: true, json: async () => ({buttons, missing: {}})};
        const {attribution, ...body} = JSON.parse(init.body);
        reads.push(body);
        if (body.line[1] === "approve") state = "approved";
        return {ok: true, json: async () => ({code: 0, value: {id: 12, state}, error: ""})};
    }));
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    return {reads, change: (value) => { state = value; }, state: () => state};
}

async function draw(component, props, context = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(component, props)});
    app.provide(WINDOW_CONTEXT, dockWindow(props.item ? [props.item] : [], context));
    app.mount(element);
    mounted.push(app);
    await settle();
    return element;
}

test("a dock reads its live row through its declaration and updates conditions on model events", async () => {
    const {reads, change} = await prepare();
    const subscriptions = new WindowSubscriptions();
    loadDockDeclarations([{type: "plans.waiting", title: "Plan", reads: ["plan show"], buttons: []}]);
    const element = await draw(DockWrapper, {item: {id: 3, type: "plans.waiting", target_model: "plan", target_id: 12}}, {subscriptions, followUndeclared: (patterns, heard) => subscriptions.follow("chat", patterns, heard)});
    expect(element.querySelector('[data-button="plans.approve"]')).not.toBeNull();
    expect(reads).toContainEqual({window: "plans.waiting", line: ["plan", "show", "12"], environment: "main"});
    change("approved");
    subscriptions.dispatch({event: "plan.approve", row_id: 12});
    await settle();
    expect(element.querySelector('[data-button="plans.approve"]')).toBeNull();
    mounted.pop().unmount();
    expect(subscriptions.follows).toHaveLength(0);
});

test("a generic panel draws its slot even when the row has no moves", async () => {
    await prepare([{...BUTTON, name: "secrets.edit", slots: ["row.secret"], runs: "secret edit {row_id}", label: "Edit secret", condition: null}]);
    location.hash = "#?open=secret:12";
    await draw(ResourcePanel, {environment: "main", catalogue: CATALOGUE, read: async () => ({ok: true, value: {id: 12, name: "Build key"}})});
    expect(document.querySelector('[data-button="secrets.edit"]')).not.toBeNull();
    expect(document.querySelector("[data-row-moves]")).toBeNull();
});

test("a plan panel reloads its state after a declared button succeeds", async () => {
    const {state} = await prepare();
    location.hash = "#?open=plan:12";
    await draw(ResourcePanel, {environment: "main", catalogue: CATALOGUE, read: async (line) => ({ok: true, value: line[1] === "inspect" ? {id: 12, title: "Plan", state: state(), phases: [], total: 0} : {rows: []}})});
    document.querySelector('[data-button="plans.approve"]').click();
    await settle();
    expect(document.querySelector('[data-button="plans.approve"]')).toBeNull();
});
