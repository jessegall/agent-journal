import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import PluginRows from "../../core/modules/plugins/web/src/PluginRows.vue";

afterEach(() => (document.body.innerHTML = ""));

const PLUGIN = {id: 1, name: "sins", title: "Sins", release: "1.0", enabled: true, source: "owner/sins", failing: false};

async function drawn(refuse = false) {
    const ran = [];
    const window = context({"plugin list": page([PLUGIN])});
    window.read = async (line) => (Array.isArray(line) ? {ok: true, value: {settings: [{key: "depth", type: "number", title: "Depth", value: 3}]}} : page([PLUGIN]));
    window.run = async (line) => (ran.push(line), refuse ? {ok: false, error: "no such plugin"} : {ok: true, value: {}});
    return {element: await mounted(PluginRows, window), ran};
}

const type = async (input, text) => {
    input.value = text;
    input.dispatchEvent(new Event("input"));
    await settle();
};

test("a plugin is installed from a source", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-install]").click();
    await settle();
    const form = element.querySelector("[data-plugin-install-form]");
    await type(form.querySelector("input"), "owner/repo");
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["plugin", "install", "owner/repo", "--yes"]);
});

test("a refused install says why", async () => {
    const {element} = await drawn(true);
    element.querySelector("[data-plugin-install]").click();
    await settle();
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
    const form = element.querySelector("[data-plugin-make-form]");
    await type(form.querySelector("input"), "count my commits");
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["message", "send", "Please make a plugin: count my commits"]);
});

test("a plugin is removed with or without its data, after asking", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-remove]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-plugin-remove-purge]").click();
    await settle();
    expect(ran).toContainEqual(["plugin", "remove", "sins", "--purge"]);
});

test("a plugin's settings open and a change is saved", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-plugin-settings]").click();
    await settle();
    const input = element.querySelector("[data-plugin-setting='depth']");
    input.value = "5";
    input.dispatchEvent(new Event("change"));
    await settle();
    expect(ran).toContainEqual(["plugin", "configure", "sins", "depth", "5"]);
});

async function recordDrawn(answer) {
    const window = context({"plugin record": answer, "plugin list": page([PLUGIN])});
    const element = await mounted(PluginRows, window);
    element.querySelector("[data-plugin-record]").click();
    await settle();
    return {element, window};
}

test("what a plugin did lists its outputs and its last fault", async () => {
    const {window} = await recordDrawn({ok: true, value: {name: "sins", outputs: [{id: 1, output: "Judged 3 files"}], fault_count: 2, last_fault: "it timed out"}});
    expect(window.reads).toContain("plugin record sins");
    const body = document.querySelector("[data-plugin-record-body]");
    expect(body.querySelector("[data-plugin-output]").textContent).toBe("Judged 3 files");
    expect(body.textContent).toContain("it timed out");
});

test("a plugin that did nothing says so, and a refused read says why", async () => {
    await recordDrawn({ok: true, value: {name: "sins", outputs: [], fault_count: 0, last_fault: ""}});
    expect(document.querySelector("[data-plugin-record-body]").textContent).toContain("It has done nothing yet");
    document.body.innerHTML = "";
    const {element} = await recordDrawn({ok: false, error: "no plugin is called sins"});
    expect(element.querySelector("[data-plugin-record-failure]").textContent).toContain("no plugin is called sins");
});
