import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {trackMutationObservers} from "./support/mutationObservers.js";
import WindowPane from "../src/windows/WindowPane.vue";
import WindowShell from "../src/windows/WindowShell.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {perLine} from "./support/windowContext.js";

const entry = (name, place = "pane") => ({name, module: "sample", title: name, place, shows: "environment", icon: "window", options: [],
    entry_url: "", line: "task list", loading: "document", reads: ["task list"], runs: [], events: [], unavailable_reason: "", allowed: true});
const dropdown = entry("usage.fitness", "dropdown");
const agentDropdown = {...dropdown, shows: "one-agent"};
const applications = [];
let checkObservers;

beforeEach(() => {
    checkObservers = trackMutationObservers();
    vi.useFakeTimers();
    sessionStorage.clear();
    vi.stubGlobal("fetch", vi.fn(perLine(async () => ({json: async () => ({code: 1, value: null, error: "refused"})}))));
});

afterEach(() => {
    applications.splice(0).forEach((app) => app.unmount());
    checkObservers();
    document.body.innerHTML = "";
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

async function mount(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(component, props));
    applications.push(app);
    app.mount(element);
    await nextTick();
    await vi.advanceTimersByTimeAsync(50);
    return element;
}

test("a dropdown has a page route and can be added to a pane even without a bar counter", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [entry("notes.board"), agentDropdown, entry("coding.mode", "bar")]}));
    await catalogue.load();
    expect(catalogue.window(dropdown.name)).toBe(catalogue.dropdown(dropdown.name));
    expect(catalogue.placed("home").map((window) => window.name)).toContain(dropdown.name);
    expect(catalogue.placed("home").map((window) => window.name)).not.toContain("coding.mode");
});

test("a dropdown opened in a pane stays open and renders its contents", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [dropdown]}));
    await catalogue.load();
    const removed = vi.fn();
    const element = await mount(WindowPane, {name: dropdown.name, catalogue, subscriptions: new WindowSubscriptions(), environment: "dropdown-pane", onRemove: removed});
    expect(removed).not.toHaveBeenCalled();
    expect(element.textContent).toContain("refused");
    expect(element.textContent).not.toContain("No installed module has this window");
});

test("a dropdown in a home pane receives the current main agent", async () => {
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        const line = JSON.parse(init?.body || "{}").line || [];
        const usage = line[0] === "usage" && line[1] === "show";
        return {json: async () => usage ? {code: 0, value: {agents: [{id: 42, role: "main", program: "codex", session: "probe"}], windows: []}, error: ""}
            : {code: 1, value: null, error: "refused"}};
    }));
    const catalogue = new WindowCatalogue(async () => ({windows: [agentDropdown]}));
    const element = await mount(WindowShell, {environment: "dropdown-agent", layout: [dropdown.name], catalogue, events: () => () => {}});
    expect(element.querySelector(`[data-window="${dropdown.name}"]`)?.dataset.agent).toBe("42");
});

test("an agent dropdown with no agent shows an empty state without sending a malformed read", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [agentDropdown]}));
    await catalogue.load();
    const element = await mount(WindowPane, {name: agentDropdown.name, catalogue, subscriptions: new WindowSubscriptions(), environment: "no-agent"});
    expect(element.textContent).toContain("No agent is running here");
    expect(globalThis.fetch).not.toHaveBeenCalled();
});
