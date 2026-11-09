import {settle} from "./support/delayedWindowContext.js";
import {afterEach, expect, test} from "vitest";
import {context, mounted} from "./support/windowContext.js";
import ToolsPanel from "../../core/modules/tools/web/src/ToolsPanel.vue";

const KEYS = {tools: {line: "tool list", events: ["tool.*"]}};

const tool = (fields = {}) => ({
    name: "graphify",
    title: "Graphify",
    description: "Keeps a graph of the project's code in graphify-out.",
    is_installed: true,
    enabled: false,
    is_running: false,
    is_failed: false,
    refreshed_at: "2026-11-03T12:00:00Z",
    commit: "abc1234",
    ...fields,
});

afterEach(() => document.body.replaceChildren());

async function drawn(fields = {}, face = "person") {
    const ran = [];
    const window = context({"tool list": {ok: true, value: {tools: [tool(fields)]}}}, null, KEYS);
    window.face = face;
    window.run = async (words) => {
        ran.push(words);
        return {ok: true, value: {}};
    };
    return {element: await mounted(ToolsPanel, window), ran};
}

test("the Graphify card shows installed, off and the last refresh", async () => {
    const {element} = await drawn();
    const card = element.querySelector('[data-tool="graphify"]');
    expect(card.textContent).toContain("Graphify");
    expect(card.querySelector("[data-tool-state]").textContent).toBe("Off");
    expect(card.querySelector("[data-tool-installed]").textContent).toBe("Installed");
    expect(card.querySelector("[data-tool-refreshed]").textContent).toContain("Last refresh");
    expect(card.querySelector("[data-tool-install]")).toBeNull();
});

test("a tool that is not installed shows the install button and a refresh that cannot be pressed", async () => {
    const {element, ran} = await drawn({is_installed: false, refreshed_at: ""});
    expect(element.querySelector("[data-tool-installed]").textContent).toBe("Not installed");
    expect(element.querySelector("[data-tool-refreshed]").textContent).toBe("Never refreshed");
    expect(element.querySelector("[data-tool-refresh]").disabled).toBe(true);
    element.querySelector("[data-tool-install]").click();
    await settle();
    expect(ran).toEqual([["tool", "install", "graphify"]]);
});

test("the switch turns an off tool on", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-tool-switch]").click();
    await settle();
    expect(ran).toEqual([["tool", "on", "graphify"]]);
});

test("the switch turns an on tool off and refresh now runs the refresh", async () => {
    const {element, ran} = await drawn({enabled: true});
    expect(element.querySelector("[data-tool-state]").textContent).toBe("On");
    element.querySelector("[data-tool-refresh]").click();
    await settle();
    expect(ran).toEqual([["tool", "refresh", "graphify"]]);
    element.querySelector("[data-tool-switch]").click();
    await settle();
    expect(ran.at(-1)).toEqual(["tool", "off", "graphify"]);
});

test("a running refresh is shown and cannot be started again", async () => {
    const {element} = await drawn({enabled: true, is_running: true});
    expect(element.querySelector("[data-tool-state]").textContent).toBe("Refreshing");
    expect(element.querySelector("[data-tool-refresh]").disabled).toBe(true);
});
