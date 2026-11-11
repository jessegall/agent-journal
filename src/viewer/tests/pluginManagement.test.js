import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {pluginWindowContext} from "./support/pluginWindowContext.js";
import PluginRows from "../../core/modules/plugins/web/src/PluginRows.vue";
import {fileAddress} from "../../core/modules/plugins/web/src/fileAddress.js";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
}));
afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const PLUGIN = {id: 1, name: "sins", title: "Sins", release: "1.0", enabled: true, source: "owner/sins", failing: false};

const PREVIEW = {name: "sins", title: "Sins", version: "1.0", source: "owner/repo", rows: [{type: "setup", label: "packages", command: "npm install"}]};

async function drawn(refuse = false, previewAnswered = null) {
    const ran = [];
    const window = pluginWindowContext({"plugin list": page([PLUGIN])});
    window.read = async (line) => {
        if (line === "plugin dashboards") return page([{id: "sins", plugin: "sins", title: "Sins board"}]);
        if (line === "plugin descriptions") return page([{id: "sins", plugin: "sins", description: "Judges the code"}]);
        if (line === "plugin services") return page([ran.some((each) => each[2] === "stop") ? {id: "sins a", plugin: "sins", service: "a", running: false, pid: null} : {id: "sins a", plugin: "sins", service: "a", running: true, pid: 12}, {id: "sins b", plugin: "sins", service: "b", running: false, pid: null}]);
        if (line === "plugin list" || line === "plugin events") return page([PLUGIN]);
        line = line.split(" ");
        if (line[1] === "preview" && previewAnswered) await previewAnswered;
        if (line[1] === "preview") return refuse ? {ok: false, error: "no such plugin"} : {ok: true, value: PREVIEW};
        if (line[1] === "service-log") return {ok: true, value: {text: "watcher started\nwatching 3 folders"}};
        if (line[1] === "latest") return {ok: true, value: {line: "sins: v2 is newer than 1.0", is_newer: true}};
        if (line[1] === "dashboard") return {ok: true, value: {missing: "sins has written nothing on its dashboard yet."}};
        return {ok: true, value: {settings: [
            {key: "depth", type: "number", title: "Depth", help: "How deep to look", group: "", parent: "", choices: [], value: 3},
            {key: "mode", type: "choice", title: "Mode", help: "", group: "", parent: "", choices: ["fast", "full"], value: "fast"},
            {key: "strict", type: "flag", title: "Strict", help: "", group: "", parent: "", choices: [], value: false},
            {key: "loud", type: "flag", title: "Loud", help: "", group: "", parent: "", choices: [], value: "true"},
        ]}};
    };
    window.run = async (line) => (ran.push(line), refuse ? {ok: false, error: "no such plugin"} : {ok: true, value: line[1] === "upgrade" ? {name: "sins", installed: "1.0", version: "v2", changes: ["new setup packages: npm install"]} : {}});
    return {element: await mounted(PluginRows, window), ran};
}

const type = async (input, text) => {
    input.value = text;
    input.dispatchEvent(new Event("input"));
    await settle();
};

test("the Check button says Check and shows its spinner until the check answers", async () => {
    let answer;
    const previewAnswered = new Promise((resolve) => { answer = resolve; });
    const {element} = await drawn(false, previewAnswered);
    const form = element.querySelector("[data-plugin-install-form]");
    const button = form.querySelector("[data-plugin-check]");
    expect(button.textContent.trim()).toBe("Check");
    await type(form.querySelector("input"), "owner/repo");
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(button.getAttribute("aria-busy")).toBe("true");
    answer();
    await settle();
    expect(button.getAttribute("aria-busy")).toBe("false");
});

test("a plugin shows everything it would run, and installs only from there", async () => {
    const {element, ran} = await drawn();
    const form = element.querySelector("[data-plugin-install-form]");
    await type(form.querySelector("input"), "owner/repo");
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toEqual([]);
    expect(document.querySelector("[data-plugin-preview]").textContent).toContain("npm install");
    document.querySelector("[data-plugin-preview-install]").click();
    await settle();
    expect(ran).toContainEqual(["plugin", "install", "owner/repo", "--yes"]);
    expect(document.querySelector("[data-plugin-preview]")).toBeNull();
});

test("a dashboard's file row opens the Files window at the row's line, or at the top when it names none", () => {
    expect(fileAddress("http://journal.test/viewer/?page=plugins", {path: "AGENTS.md", line: 12}, "coding.files")).toBe("http://journal.test/viewer/?page=coding.files&file=AGENTS.md&line=12");
    expect(fileAddress("http://journal.test/viewer/?page=plugins&line=9", {path: "src/a.py"}, "coding.files")).toBe("http://journal.test/viewer/?page=coding.files&file=src%2Fa.py");
});

const fromMenu = async (element, item) => {
    document.body.append(element);
    element.querySelector("[data-plugin-more] button, button[data-plugin-more]").click();
    await settle();
    document.querySelector(item).click();
    await settle();
};

test.each([true, false])("a plugin switch changes before the answer and returns on refusal, enabled=%s", async (enabled) => {
    let reply;
    const pending = new Promise((resolve) => (reply = resolve));
    const window = pluginWindowContext({
        "plugin list": page([{...PLUGIN, enabled}]),
        "plugin dashboards": page([]),
        "plugin descriptions": page([]),
        "plugin services": page([]),
    });
    const ran = [];
    window.run = (line) => {
        ran.push(line);
        return pending;
    };
    const element = await mounted(PluginRows, window);
    const control = element.querySelector('[data-row="1"] [role="switch"]');
    control.click();
    await settle();
    expect(control.getAttribute("aria-checked")).toBe(String(!enabled));
    reply({ok: false, error: "Plugin change refused"});
    await settle();
    expect(control.getAttribute("aria-checked")).toBe(String(enabled));
    expect(element.querySelector("[data-plugin-refusal]").textContent).toBe("Plugin change refused");
    expect(ran).toEqual([["plugin", enabled ? "disable" : "enable", "sins"]]);
});

test("checking for updates says what the source has", async () => {
    const {element} = await drawn();
    await fromMenu(element, "[data-plugin-latest]");
    expect(element.querySelector("[data-plugin-latest-line]").textContent).toBe("sins: v2 is newer than 1.0");
});

test("a newer release shows what changes and upgrades only from there", async () => {
    const {element, ran} = await drawn();
    await fromMenu(element, "[data-plugin-latest]");
    element.querySelector("[data-plugin-upgrade]").click();
    await settle();
    expect(ran).toEqual([["plugin", "upgrade", "sins"]]);
    expect(document.querySelector("[data-plugin-upgrade-change]").textContent).toContain("npm install");
    document.querySelector("[data-plugin-upgrade-apply]").click();
    await settle();
    expect(ran.at(-1)).toEqual(["plugin", "upgrade", "sins", "--yes"]);
    expect(element.querySelector("[data-plugin-latest-line]").textContent).toContain("is upgraded");
});

test("a plugin that declares a dashboard offers it and says when nothing is written yet", async () => {
    const {element} = await drawn();
    const button = element.querySelector("[data-plugin-board]");
    expect(button.textContent).toContain("Sins board");
    button.click();
    await settle();
    expect(document.body.textContent).toContain("sins has written nothing on its dashboard yet.");
});

test("the guide opens with every manifest key", async () => {
    const {element} = await drawn();
    element.querySelector("[data-plugin-make]").click();
    await settle();
    document.querySelector("[data-plugin-guide-open]").click();
    await settle();
    const guide = document.querySelector("[data-plugin-guide]").textContent;
    for (const key of ["journal-plugin.json", "hears", "holds", "services", "dashboard", "$JOURNAL_PLUGIN_DATA"]) expect(guide).toContain(key);
});

test("a refused install says why", async () => {
    const {element} = await drawn(true);
    const form = element.querySelector("[data-plugin-install-form]");
    await type(form.querySelector("input"), "owner/repo");
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(element.querySelector("[data-plugin-refusal]").textContent).toBe("no such plugin");
});

test("the agent is asked to make a plugin by a message", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-make]").click();
    await settle();
    const wish = document.querySelector("[data-plugin-make-form] textarea");
    wish.value = "count my commits";
    wish.dispatchEvent(new Event("input"));
    await settle();
    document.querySelector("[data-plugin-make-send]").click();
    await settle();
    expect(ran).toContainEqual(["message", "send", "Please make a plugin: count my commits"]);
    expect(element.querySelector("[data-plugin-asked]")).not.toBeNull();
});

test("a plugin is removed with or without its data, after asking", async () => {
    const {element, ran} = await drawn();
    await fromMenu(element, "[data-plugin-remove]");
    expect(ran).toEqual([]);
    document.querySelector("[data-plugin-remove-purge]").click();
    await settle();
    expect(ran).toContainEqual(["plugin", "remove", "sins", "--purge"]);
});

test("a plugin's settings open and a change is saved", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-settings]").click();
    await settle();
    const input = document.querySelector("[data-plugin-setting='depth'] input");
    input.value = "5";
    input.dispatchEvent(new Event("change"));
    await settle();
    expect(ran).toContainEqual(["plugin", "configure", "sins", "depth", "5"]);
    expect(document.querySelector("[data-plugin-setting-list]").textContent).toContain("How deep to look");
});

test("a plugin's settings show the control of their type and a group's switches turn on together", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-settings]").click();
    await settle();
    expect(document.querySelector("[data-plugin-setting='strict'] [role=switch]")).not.toBeNull();
    expect(document.querySelector("[data-plugin-setting='mode'] [role=radio]")).not.toBeNull();
    document.querySelector("[data-plugin-all-on]").click();
    await settle();
    expect(ran).toContainEqual(["plugin", "configure", "sins", "strict", "true"]);
    expect(ran).not.toContainEqual(["plugin", "configure", "sins", "loud", "true"]);
});

async function recordDrawn(answer) {
    const window = pluginWindowContext({"plugin record": answer, "plugin list": page([PLUGIN])});
    const element = await mounted(PluginRows, window);
    element.querySelector("[data-plugin-record]").click();
    await settle();
    return {element, window};
}

test("what a plugin did lists its outputs with their times and no last fault", async () => {
    const createdAt = "2026-11-05T14:56:10.000000+00:00";
    const {window} = await recordDrawn({ok: true, value: {name: "sins", outputs: [{id: 1, output: "Judged 3 files", created_at: createdAt}], fault_count: 2, last_fault: "it timed out"}});
    expect(window.reads).toContain("plugin record sins");
    const body = document.querySelector("[data-plugin-record-body]");
    expect(body.querySelector("[data-plugin-output]").textContent).toBe("Judged 3 files");
    expect(body.querySelector("[data-plugin-output-time]").textContent).toBe(new Date(createdAt).toLocaleString([], {dateStyle: "medium", timeStyle: "medium"}));
    expect(body.textContent).not.toContain("it timed out");
});

test("a plugin that did nothing says so, and a refused read says why", async () => {
    await recordDrawn({ok: true, value: {name: "sins", outputs: [], fault_count: 0, last_fault: ""}});
    expect(document.querySelector("[data-plugin-record-body]").textContent).toContain("No activity yet.");
    document.body.innerHTML = "";
    const {element} = await recordDrawn({ok: false, error: "no plugin is called sins"});
    expect(element.querySelector("[data-plugin-record-failure]").textContent).toContain("no plugin is called sins");
});

test("a plugin's cards read as words, not JSON", async () => {
    await recordDrawn({ok: true, value: {name: "sins", outputs: [{id: 1, output: JSON.stringify({cards: [{key: "a", detail: "long line at 22"}]})}], fault_count: 0, last_fault: ""}});
    expect(document.querySelector("[data-plugin-output]").textContent).toBe("long line at 22");
});

test("what a plugin did names the services it keeps running", async () => {
    await recordDrawn({ok: true, value: {name: "sins", outputs: [], fault_count: 0, last_fault: "", services: [{name: "watcher", condition: "always"}]}});
    expect(document.querySelector("[data-plugin-services]").textContent).toContain("watcher");
});

test("a card says what the plugin is for and which of its services run", async () => {
    const {element} = await drawn();
    await settle();
    expect(element.querySelector("[data-plugin-description]").textContent).toBe("Judges the code");
    expect(element.querySelector('[data-plugin-service="sins a"]').textContent).toContain("running, process 12");
    expect(element.querySelector('[data-plugin-service="sins b"]').textContent).toContain("stopped");
});

test("the card names its services and has no list of events", async () => {
    const {element} = await drawn();
    await settle();
    expect(element.querySelector("[data-plugin-runs] .label").textContent).toBe("Services");
    expect(element.textContent).not.toContain("Listens to");
});

test.each(["sins a", "sins b"])("clicking the service %s opens its log in a dialog", async (service) => {
    const {element} = await drawn();
    await settle();
    expect(document.querySelector("[data-plugin-service-terminal]")).toBeNull();
    element.querySelector(`[data-plugin-service="${service}"]`).click();
    await settle();
    expect(document.querySelector("[role=dialog] [data-plugin-service-terminal]")).not.toBeNull();
});

const shownTerminal = async (service) => {
    const {element, ran} = await drawn();
    await settle();
    element.querySelector(`[data-plugin-service="${service}"]`).click();
    await settle();
    return {terminal: document.querySelector("[role=dialog] [data-plugin-service-terminal]"), ran};
};
const barButton = (terminal, action) => terminal.querySelector(`[data-plugin-service-action="${action}"]`);

test("the service dialog is a tall one whose terminal takes its whole body", async () => {
    const {terminal} = await shownTerminal("sins a");
    expect(terminal.closest(".dialog-panel").classList.contains("tall")).toBe(true);
    expect(terminal.closest(".dialog-body").classList.contains("padded")).toBe(false);
    expect(terminal.querySelector("pre.output-lines").textContent).toContain("watching 3 folders");
});

test("the bar above the log says a running service runs and offers to stop and restart it", async () => {
    const {terminal} = await shownTerminal("sins a");
    const bar = terminal.querySelector("[data-plugin-service-bar]");
    expect(bar.compareDocumentPosition(terminal.querySelector("pre.output-lines")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(bar.textContent).toContain("Running, process 12");
    expect(barButton(terminal, "stop")).not.toBeNull();
    expect(barButton(terminal, "restart")).not.toBeNull();
    expect(barButton(terminal, "start")).toBeNull();
});

test("the bar of a stopped service offers only to start it", async () => {
    const {terminal} = await shownTerminal("sins b");
    expect(terminal.querySelector("[data-plugin-service-bar]").textContent).toContain("Stopped");
    expect(barButton(terminal, "start")).not.toBeNull();
    expect(barButton(terminal, "stop")).toBeNull();
    expect(barButton(terminal, "restart")).toBeNull();
});

test.each([["sins a", "stop", "a"], ["sins a", "restart", "a"], ["sins b", "start", "b"]])("on %s the bar's %s runs that change of the service", async (service, action, name) => {
    const {terminal, ran} = await shownTerminal(service);
    barButton(terminal, action).click();
    await settle();
    expect(ran).toEqual([["plugin", "service", action, "sins", name]]);
});

test("a change the journal refuses is said in the service dialog", async () => {
    const {element} = await drawn(true);
    await settle();
    element.querySelector('[data-plugin-service="sins a"]').click();
    await settle();
    const terminal = document.querySelector("[role=dialog] [data-plugin-service-terminal]");
    barButton(terminal, "stop").click();
    await settle();
    expect(terminal.querySelector("[role=alert]").textContent).toContain("no such plugin");
});

test("the bar of an open service shows the new state after a change", async () => {
    const {terminal} = await shownTerminal("sins a");
    barButton(terminal, "stop").click();
    await settle();
    expect(terminal.querySelector("[data-plugin-service-bar]").textContent).toContain("Stopped");
    expect(barButton(terminal, "start")).not.toBeNull();
});

test("a page with no plugin says so and still offers to make one", async () => {
    const window = pluginWindowContext({"plugin list": page([]), "plugin dashboards": page([]), "plugin descriptions": page([]), "plugin services": page([])});
    const element = await mounted(PluginRows, window);
    expect(element.querySelector("[data-plugin-none]").textContent).toContain("No plugin is installed");
    expect(element.querySelector("[data-plugin-make]")).not.toBeNull();
});
