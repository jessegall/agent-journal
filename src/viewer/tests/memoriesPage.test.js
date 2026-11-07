import {expect, test} from "vitest";
import {agentsLine, context, memoryLine, mounted, namesLine, page, pickButton, settle, typeInto} from "./support/memoriesContext.js";
import MemoriesPage from "../../core/modules/memories/web/src/MemoriesPage.vue";

const ENVIRONMENTS = page([{id: 1, name: "main"}, {id: 2, name: "docs"}]);
const MAIN_MEMORY = {id: 1, text: "Totals are in cents", weight: 5, state: "active", agent_id: null, environment_id: 1, task_id: 6700, reason: ""};
const WORKER_MEMORY = {id: 2, text: "My worktree is clean", weight: 7, state: "active", agent_id: 646, environment_id: 1, task_id: null, reason: ""};
const WORKER = {agent_id: 646, environment_id: 1, role: "worker", name: "Worker 646", started_at: "2026-11-05T10:00:00+00:00", ended_at: null, active_memories: 1, removed_memories: 0};
const ENDED = {agent_id: 638, environment_id: 1, role: "helper", name: "Ada Yonath", started_at: "2026-10-01T10:00:00+00:00", ended_at: "2026-10-02T10:00:00+00:00", active_memories: 0, removed_memories: 2};
const FAILED = {ok: false, failure: "refused", error: "the journal did not answer"};

// a window whose reads are answered by the first answer whose line starts the read: the given ones come before the usual ones
function answered(extra = {}, usual = USUAL) {
    return {...context({"environment list": ENVIRONMENTS, ...extra, ...Object.fromEntries(Object.entries(usual).filter(([line]) => !(line in extra)))})};
}

const USUAL = {
    "memory list --main-agent --environment main": page([MAIN_MEMORY]),
    "memory list --other-agents": page([WORKER_MEMORY]),
    "memory list --environment main": page([MAIN_MEMORY, WORKER_MEMORY]),
    "memory list --agent 646": page([WORKER_MEMORY]),
    "memory list --agent 638": page([{...WORKER_MEMORY, id: 3, agent_id: 638, text: "Ended note"}]),
    "memory agents --environment main --working": page([WORKER]),
    "memory agents --environment main --ended": page([ENDED]),
    "memory agents --agents": page([WORKER]),
    "agent show 646": {ok: true, value: {role: "worker", given_name: "", ended_at: null}},
    "agent show 638": {ok: true, value: {role: "helper", given_name: "Ada Yonath", ended_at: "2026-10-02T10:00:00+00:00"}},
};

const rowTexts = (element) => [...element.querySelectorAll("[data-memory]")].map((row) => row.querySelector(".memory-text").textContent);
const clickByText = async (element, selector, text) => {
    [...element.querySelectorAll(selector)].find((found) => found.textContent.includes(text)).click();
    await settle();
};
const readsWith = (window_, start) => window_.reads.filter((line) => line.startsWith(start));

test("the page opens on the main agent of its own environment and has no tab for another environment", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    expect(element.querySelector("[data-memory-tabs]")).toBeNull();
    expect(element.querySelector("[data-pane-title]").textContent.trim()).toBe("Main agent");
    expect(rowTexts(element)).toEqual(["Totals are in cents"]);
    expect(window_.reads.filter((line) => line.includes("--environment")).every((line) => line.includes("--environment main"))).toBe(true);
});

test("the column puts the main agent first with its count, then every other agent as one list, then every agent", async () => {
    const element = await mounted(MemoriesPage, answered());
    await settle();
    const names = [...element.querySelectorAll("[data-agent-column] .pinned [data-who-name]")].map((name) => name.textContent.trim());
    expect(names).toEqual(["Main agent", "Other agents", "Every agent"]);
    expect(element.querySelector("[data-main]").textContent).toContain("Reads these at every start");
});

test("with no worker or helper holding a memory the column says so and offers only the main agent", async () => {
    const element = await mounted(MemoriesPage, answered({"memory list --other-agents": page([]), "memory agents": page([])}));
    await settle();
    expect(element.querySelector("[data-no-agents]").textContent).toContain("No other agent has saved a memory yet");
    expect(element.querySelector("[data-others]")).toBeNull();
});

test("the agents holding memories are read in one line each for those at work and those ended, never one line per agent", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    expect(readsWith(window_, "memory agents").sort()).toEqual(["memory agents --environment main --ended --limit 1", "memory agents --environment main --working --limit 30"]);
    expect(element.querySelector("[data-working-head]").textContent).toContain("Working now");
    expect(element.textContent).toContain("Worker 646");
});

test("ended agents stay folded, read only for their number, until they are opened; a search opens them", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    expect(element.textContent).not.toContain("Ada Yonath");
    element.querySelector("[data-ended-fold]").click();
    await settle();
    expect(readsWith(window_, "memory agents --environment main --ended --limit 30")).toHaveLength(1);
    expect(element.textContent).toContain("Ada Yonath");
    expect(element.textContent).toContain("2 removed");
});

test("more ended agents are shown thirty at a time", async () => {
    const many = Array.from({length: 30}, (_, place) => ({...ENDED, agent_id: 500 - place, name: `Ended ${place}`}));
    const window_ = answered({"memory agents --environment main --ended": {ok: true, value: {rows: many, page: 1, size: 30, total: 65}}});
    const element = await mounted(MemoriesPage, window_);
    await settle();
    element.querySelector("[data-ended-fold]").click();
    await settle();
    await clickByText(element, "[data-agents-more]", "Show 30 more of 65");
    expect(readsWith(window_, "memory agents --environment main --ended --limit 60")).toHaveLength(1);
});

test("a name found in the column and the kind of agent are sent to the server", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    typeInto(element.querySelector("[data-agent-find] input"), "worker 646");
    await settle();
    expect(readsWith(window_, 'memory agents --environment main --name "worker 646" --working').length).toBeGreaterThan(0);
    await pickButton(element, "Writing agents", "[data-agent-roles] button");
    expect(readsWith(window_, 'memory agents --environment main --access writing --name "worker 646"').length).toBeGreaterThan(0);
    await pickButton(element, "Read-only agents", "[data-agent-roles] button");
    expect(readsWith(window_, "memory agents --environment main --access read-only").length).toBeGreaterThan(0);
});

test("an agent with no match for the name says so", async () => {
    const window_ = answered({"memory agents --environment main --name nobody": page([])});
    const element = await mounted(MemoriesPage, window_);
    await settle();
    typeInto(element.querySelector("[data-agent-find] input"), "nobody");
    await settle();
    expect(element.querySelector("[data-no-agent-match]").textContent).toContain("No agent matches");
});

test("choosing one agent reads its memories alone and its name and role head them", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    await clickByText(element, "[data-who]", "Worker 646");
    expect(readsWith(window_, "memory page --agent 646 --environment main").length).toBeGreaterThan(0);
    expect(rowTexts(element)).toEqual(["My worktree is clean"]);
    expect(element.querySelector("[data-pane-title]").textContent).toContain("Worker 646");
    expect(element.querySelector("[data-ended-note]")).toBeNull();
    expect(element.querySelector("[data-open-agent]")).not.toBeNull();
});

test("an ended agent's memories say that they reach no agent while it is ended", async () => {
    const element = await mounted(MemoriesPage, answered());
    await settle();
    element.querySelector("[data-ended-fold]").click();
    await settle();
    await clickByText(element, "[data-who]", "Ada Yonath");
    expect(element.querySelector("[data-ended-note]").textContent).toContain("reach no agent while it is ended");
});

test("the workers and helpers are listed under the agent each memory belongs to, their names read together", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    await clickByText(element, "[data-who]", "Other agents");
    expect(element.querySelector("[data-group-link]").textContent).toBe("Worker 646");
    expect(readsWith(window_, "memory agents --agents")).toEqual([]);
    await clickByText(element, "[data-group-link]", "Worker 646");
    expect(element.querySelector("[data-pane-title]").textContent).toContain("Worker 646");
});

test("every agent lists the main agent's memories first under its own name", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    await clickByText(element, "[data-who]", "Every agent");
    expect([...element.querySelectorAll("[data-group-link]")].map((link) => link.textContent)).toEqual(["Main agent", "Worker 646"]);
});

test("a search, an order and the removed memories are asked of the server", async () => {
    const window_ = answered();
    const element = await mounted(MemoriesPage, window_);
    await settle();
    document.body.append(element);
    typeInto(element.querySelector("[data-memory-pane] [data-search-input]"), "cents");
    await settle();
    expect(readsWith(window_, "memory page --main-agent --environment main --state active --search cents --order newest --limit 20")).toHaveLength(1);
    element.querySelector("[data-search-menu]").click();
    await settle();
    document.querySelector("[data-memory-order='weight']").click();
    await settle();
    expect(readsWith(window_, "memory page --main-agent --environment main --state active --search cents --order weight").length).toBeGreaterThan(0);
    document.querySelector("[data-memory-state='removed']").click();
    await settle();
    expect(readsWith(window_, "memory page --main-agent --environment main --removed --state removed --search cents --order weight").length).toBeGreaterThan(0);
});

test("a long list loads the next twenty behind the rows", async () => {
    const window_ = answered({"memory list --main-agent --environment main": {ok: true, value: {rows: [MAIN_MEMORY], page: 1, size: 20, total: 45}}});
    const element = await mounted(MemoriesPage, window_);
    await settle();
    element.querySelector("[data-memories-more]").click();
    await settle();
    expect(readsWith(window_, "memory page --main-agent --environment main --state active --order newest --limit 40")).toHaveLength(1);
});

test("a search that finds nothing offers to search every agent", async () => {
    const window_ = answered({"memory list --main-agent --environment main --state active --search deploy": page([])});
    const element = await mounted(MemoriesPage, window_);
    await settle();
    typeInto(element.querySelector("[data-memory-pane] [data-search-input]"), "deploy");
    await settle();
    expect(element.querySelector("[data-memory-empty]").dataset.kind).toBe("search");
    element.querySelector("[data-memory-everyone]").click();
    await settle();
    expect(element.querySelector("[data-pane-title]").textContent.trim()).toBe("Every agent");
    expect(element.querySelector("[data-memory-pane] [data-search-input]").value).toBe("deploy");
});

test("a main agent with no memories points at the memories of the workers and helpers", async () => {
    const element = await mounted(MemoriesPage, answered({"memory list --main-agent": page([])}));
    await settle();
    expect(element.querySelector("[data-memory-empty]").dataset.kind).toBe("main-others");
    element.querySelector("[data-memory-others]").click();
    await settle();
    expect(element.querySelector("[data-pane-title]").textContent.trim()).toBe("Other agents");
});

test("no memories anywhere says so and offers a new memory", async () => {
    const element = await mounted(MemoriesPage, answered({"memory list": page([]), "memory agents": page([])}));
    await settle();
    expect(element.querySelector("[data-memory-empty]").dataset.kind).toBe("main");
    expect(element.textContent).toContain("No memories yet");
});

test("memories that cannot be read say so and can be tried again", async () => {
    const window_ = answered({"memory list": FAILED, "memory agents": page([])});
    const element = await mounted(MemoriesPage, window_);
    await settle();
    expect(element.querySelector("[data-memory-empty]").dataset.kind).toBe("failure");
    expect(element.querySelector("[data-memory-failure]").textContent).toContain("the journal did not answer");
    const before = window_.reads.length;
    element.querySelector("[data-memory-retry]").click();
    await settle();
    expect(window_.reads.length).toBeGreaterThan(before);
});

test("a memory made on the page goes to the page's environment and the main agent", async () => {
    const lines = [];
    const window_ = {...answered(), run: async (line) => (lines.push(line), {ok: true, value: {}})};
    const element = await mounted(MemoriesPage, window_);
    await settle();
    element.querySelector("[data-memory-new]").click();
    await settle();
    const text = element.querySelector("[data-memory-form] textarea");
    typeInto(text, "Keep this");
    await settle();
    element.querySelector("[data-memory-form]").dispatchEvent(new Event("submit"));
    await settle();
    expect(lines).toEqual([["memory", "make", "Keep this", "--environment", "main"]]);
    expect(element.querySelector("[data-memory-notice]").textContent).toContain("Saved for the main agent");
});

test("a memory opens its panel", async () => {
    const element = await mounted(MemoriesPage, answered());
    await settle();
    element.querySelector('[data-memory="1"]').click();
    expect(location.href).toContain("memories:1");
});

test("at phone width a button opens the list of agents over the memories", async () => {
    const element = await mounted(MemoriesPage, answered());
    await settle();
    const browser = element.querySelector("[data-memory-browser]");
    expect(browser.classList.contains("picking")).toBe(false);
    element.querySelector("[data-whose]").click();
    await settle();
    expect(browser.classList.contains("picking")).toBe(true);
    await clickByText(element, "[data-who]", "Worker 646");
    expect(browser.classList.contains("picking")).toBe(false);
});

test("the command lines say whose memories, in which environment and how they are searched", () => {
    expect(memoryLine({who: "main", environment: "docs"})).toBe("memory list --main-agent --environment docs --state active --order newest --limit 20");
    expect(memoryLine({who: "agent:5", environment: "main", state: "all", search: 'say "hi"', order: "weight"})).toBe('memory list --agent 5 --environment main --removed --search "say \\"hi\\"" --order weight --limit 20');
    expect(memoryLine({who: "everyone", environment: "main", state: "removed"})).toBe("memory list --environment main --removed --state removed --order newest --limit 20");
    expect(agentsLine({environment: "main", ended: true, role: "read-only"})).toBe("memory agents --environment main --access read-only --ended --limit 30");
    expect(namesLine([4, 4, 9])).toBe("memory agents --agents 4 9 --limit 2");
});
