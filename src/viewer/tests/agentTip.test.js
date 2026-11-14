import {readFileSync, readdirSync, statSync} from "node:fs";
import {join, resolve} from "node:path";
import {h} from "vue";
import {afterEach, expect, test} from "vitest";
import {AgentTip} from "@journal/window-kit";
import {context, mounted, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const MINUTE = 60000;
const WORKING = {id: 734, title: "Worker", name: "Mary Anning", program: "claude", model: "sonnet", effort: "high", role_label: "worker 734", activity: "working", retired: false, since: new Date(Date.now() - 7 * MINUTE).toISOString(), last_seen: new Date(Date.now() - 2 * MINUTE).toISOString()};
const IDLE = {...WORKING, activity: "ended", since: new Date(Date.now() - 60 * MINUTE).toISOString(), last_seen: new Date(Date.now() - 55 * MINUTE).toISOString()};
const RETIRED = {...IDLE, retired: true};

// each test asks for an agent of its own, since the tip's read is shared for a few seconds
async function shown(tip, id) {
    const window = context({[`agent tip row:${id}`]: {ok: true, value: {...tip, id, role_label: `worker ${id}`}}});
    const element = await mounted({render: () => h(AgentTip, {agentId: id, label: `Worker ${id}`}, () => "icon")}, window);
    const tipped = element.querySelector("[data-agent-tip]");
    tipped.dispatchEvent(new Event("mouseenter"));
    await settle();
    return {element, window, tipped};
}
const text = (element, name) => element.querySelector(`[data-agent-tip-${name}]`)?.textContent.trim();

test("the tip of a working agent shows its type and name, its program line, a working dot, since when and last seen", async () => {
    const {element} = await shown(WORKING, 734);
    expect(text(element, "head")).toBe("Worker Mary Anning");
    expect(text(element, "identity")).toBe("claude, sonnet, high, worker 734");
    expect(text(element, "status")).toBe("Working");
    expect(element.querySelector("[data-agent-tip-status] i").dataset.state).toBe("working");
    expect(text(element, "since")).toMatch(/^Since: \d.*, 7m ago$/);
    expect(text(element, "seen")).toBe("Seen: 2m ago");
});

test("the tip of an idle agent shows an idle dot with the same fields", async () => {
    const {element} = await shown(IDLE, 735);
    expect(text(element, "head")).toBe("Worker Mary Anning");
    expect(text(element, "identity")).toBe("claude, sonnet, high, worker 735");
    expect(text(element, "status")).toBe("Idle");
    expect(element.querySelector("[data-agent-tip-status] i").dataset.state).toBe("idle");
    expect(text(element, "since")).toMatch(/, 1h ago$/);
    expect(text(element, "seen")).toBe("Seen: 55m ago");
});

test("the tip of a retired agent shows a ring", async () => {
    const {element} = await shown(RETIRED, 736);
    expect(text(element, "status")).toBe("Retired");
    expect(element.querySelector("[data-agent-tip-status] i").dataset.state).toBe("retired");
});

test("an agent is read when it is first hovered, never when it is drawn, and a second hover reads nothing more", async () => {
    const window = context({"agent tip row:737": {ok: true, value: WORKING}});
    const element = await mounted({render: () => h("div", [h(AgentTip, {agentId: 737, label: "A"}, () => "a"), h(AgentTip, {agentId: 737, label: "B"}, () => "b")])}, window);
    expect(window.reads).toEqual([]);
    const [first, second] = element.querySelectorAll("[data-agent-tip]");
    first.dispatchEvent(new Event("mouseenter"));
    second.dispatchEvent(new Event("mouseenter"));
    await settle();
    first.dispatchEvent(new Event("mouseenter"));
    await settle();
    expect(window.reads).toEqual(["agent tip row:737"]);
});

test("a tip whose read failed says the agent's label and why", async () => {
    const window = context({});
    const element = await mounted({render: () => h(AgentTip, {agentId: 9, label: "Worker 9"}, () => "icon")}, window);
    element.querySelector("[data-agent-tip]").dispatchEvent(new Event("mouseenter"));
    await settle();
    expect(text(element, "head")).toBe("Worker 9");
    expect(text(element, "failure")).toContain("agent tip row:9");
});

const SOURCES = ["../../core", "../src", "../kit"].map((folder) => resolve(__dirname, folder));
const vueFiles = (folder) => readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (name === "node_modules" || name === "dist") return [];
    return statSync(path).isDirectory() ? vueFiles(path) : (name.endsWith(".vue") ? [path] : []);
});

test("no window writes its own agent tooltip: a title that opens an agent, or a hover tip that names a worker, is the shared tip", () => {
    const own = SOURCES.flatMap(vueFiles).filter((path) => /:title="`Open (\$\{agentLabel|worker)/.test(readFileSync(path, "utf8")) || /<HoverTip[^>]*data-task-agent/.test(readFileSync(path, "utf8")));
    expect(own).toEqual([]);
});
