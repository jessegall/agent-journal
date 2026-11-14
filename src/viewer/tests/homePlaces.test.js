import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import ProcessQueueRun from "../src/resource/ProcessQueueRun.vue";
import DiffCard from "../src/kit/DiffCard.vue";
import DataTable from "../src/kit/DataTable.vue";
import Terminal from "../../suites/coding/web/src/Terminal.vue";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import TaskRow from "../../core/modules/tasks/web/src/TaskRow.vue";
import AgentMemoryRow from "../../core/modules/memories/web/src/AgentMemoryRow.vue";
import {terminalWindowContext} from "./support/terminalWindowContext.js";
import {context as codingContext} from "./support/codingWindowContext.js";
import {context as plainContext, appended, mounted, settle} from "./support/windowContext.js";
import {mountedMessageCard} from "./support/mountedMessageCard.js";

const copied = [];
const spoken = [];
const say = (text, undo = null) => spoken.push([text, undo]);
let shown = null;

beforeEach(() => {
    copied.length = 0;
    spoken.length = 0;
    Object.defineProperty(navigator, "clipboard", {value: {writeText: async (text) => copied.push(text)}, configurable: true});
    location.hash = "";
});

afterEach(() => {
    shown?.unmount?.();
    shown = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

// the window's context with its runs written down, each answered ok
const recording = (base) => {
    const runs = [];
    return {runs, window: {...base, run: async (line) => (runs.push(line.join(" ")), {ok: true, value: null})}};
};
// what the menu of a right click on the element shows, in the order it is drawn, and the way to choose an item as the shell does
function menuAt(element) {
    const place = placeUnder(element);
    const entries = menuEntries(place.items);
    const byLabel = (label) => entries.find((entry) => entry.label === label);
    return {
        head: place.head,
        labels: entries.filter((entry) => !entry.separator).map((entry) => entry.label),
        byLabel,
        choose: async (label, child = null) => {
            const entry = byLabel(label);
            await (child ? entry.children.find((one) => one.label === child) : entry).run({say});
            await settle();
        },
    };
}

test("test_chat_message_items: a message has Reply, React with its faces, Copy text, Copy link and Pin, each doing its own thing", async () => {
    const {runs, window} = recording(plainContext({}));
    const replied = [];
    const reacted = [];
    shown = await mountedMessageCard({message: {id: 7, type: "user", text: "Ship it today", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", read_at: null}, onReply: (row) => replied.push(row.id), onReact: (row, face) => reacted.push(face)}, window);
    const menu = menuAt(shown.host.querySelector("[data-message]"));
    expect(menu.head).toBe("Ship it today");
    expect(menu.labels).toEqual(["Reply", "React", "Copy text", "Copy link", "Pin to the top of the chat"]);
    expect(menu.byLabel("React").children.length).toBeGreaterThan(5);
    await menu.choose("Reply");
    await menu.choose("React", "👍");
    await menu.choose("Copy text");
    await menu.choose("Copy link");
    await menu.choose("Pin to the top of the chat");
    expect(replied).toEqual([7]);
    expect(reacted).toEqual(["👍"]);
    expect(copied).toEqual(["Ship it today", `${location.href.split("#")[0]}#open=messages:7`]);
    expect(runs).toEqual(["pin make Ship it today --link messages:7"]);
    expect(spoken.at(-1)).toEqual(["Pinned", null]);
});

test("test_terminal_command_items: a command has Show output, Copy command and Run again, which types it into the agent's terminal", async () => {
    const window = terminalWindowContext({}, 7);
    const runs = [];
    window.read = async (line) => (line.startsWith("hook-call feed") ? {ok: true, value: {rows: [{id: 1, agent_id: 7, hook: "pre_tool_use", tool: "Bash", summary: "make check", answer: "allow", refusal: ""}]}} : {ok: false, error: line});
    window.option = () => ({value: "commands"});
    window.run = async (line) => (runs.push(line.join(" ")), {ok: true, value: null});
    const element = await mounted(Terminal, window);
    await settle();
    document.body.append(element);
    const row = element.querySelector("[data-terminal-command]");
    const menu = menuAt(row);
    expect(menu.labels).toEqual(["Show output", "Copy command", "Run again"]);
    await menu.choose("Show output");
    expect(row.querySelector(".terminal-text").getAttribute("aria-expanded")).toBe("true");
    expect(menuAt(row).labels[0]).toBe("Hide output");
    await menu.choose("Copy command");
    await menu.choose("Run again");
    expect(copied).toEqual(["make check"]);
    expect(runs).toEqual(["agent type 7 make check"]);
    expect(spoken.at(-1)[0]).toBe("Sent");
});

test("test_agent_card_items: an agent card has Open, Pause, Copy name, Open its task and Stop, and a stopped agent can neither be paused nor stopped", async () => {
    const {runs, window} = recording({...codingContext({}), tabs: []});
    const row = {id: 5, number: 5, session: "s-5", program: "claude", role: "worker", ended_at: null, state: "running"};
    const toggled = [];
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: [{id: 9, title: "A job", state: "started"}]}, onToggle: () => toggled.push(1)})}, window);
    document.body.append(element);
    const menu = menuAt(element.querySelector("[data-agent-open]"));
    expect(menu.labels).toEqual(["Open", "Pause", "Copy name", "Open its task", "Stop"]);
    await menu.choose("Open");
    await menu.choose("Pause");
    await menu.choose("Stop");
    expect(toggled).toEqual([1]);
    expect(runs).toEqual(["agent pause 5", "agent stop 5"]);
    expect(menu.byLabel("Stop").danger).toBe(true);
    document.body.innerHTML = "";
    const ended = await mounted({render: () => h(AgentCard, {row: {...row, ended_at: "2026-11-01T10:00:00Z"}, facts: {tasks: []}})}, window);
    document.body.append(ended);
    const stopped = menuAt(ended.querySelector("[data-agent-open]"));
    expect(stopped.byLabel("Pause").disabled).toBe(true);
    expect(stopped.byLabel("Stop").disabled).toBe(true);
    expect(stopped.byLabel("Open its task").disabled).toBe(true);
});

test("test_task_row_items: a task row has Open, Copy number, Copy title and Cancel task, which can be undone by reopening", async () => {
    const {runs, window} = recording(plainContext({}));
    const element = await mounted(TaskRow, window, {row: {id: 12, title: "Fix the socket", state: "started", tags: []}});
    document.body.append(element);
    const menu = menuAt(element.querySelector("[data-row]"));
    expect(menu.head).toBe("Task 12");
    expect(menu.labels).toEqual(["Open", "Copy number", "Copy title", "Cancel task"]);
    await menu.choose("Open");
    expect(location.hash).toContain("open=tasks:12");
    await menu.choose("Copy number");
    await menu.choose("Copy title");
    await menu.choose("Cancel task");
    expect(copied).toEqual(["task 12", "Fix the socket"]);
    expect(runs).toEqual(["task cancel 12 --reason Cancelled from the task list"]);
    expect(spoken.at(-1)).toEqual(["Task 12 cancelled", {line: ["task", "reopen", "12"]}]);
    const done = await mounted(TaskRow, window, {row: {id: 13, title: "Done", state: "completed", tags: []}});
    expect(menuAt(done.querySelector("[data-row]")).byLabel("Cancel task").disabled).toBe(true);
});

test("test_queue_process_items: a process in the queue has Show output, Copy command and Open its task", async () => {
    const toggled = [];
    const run = {id: 70, task_id: 11, owner_agent_id: 21, category: "build", line: "make package", state: "running", section: "running", created_at: "2026-11-03T10:00:00Z", started_at: "2026-11-03T10:00:05Z", ended_at: null};
    const element = appended(ProcessQueueRun, {run, environment: "main", position: 1, read: async () => ({ok: true, value: {rows: []}}), expanded: false, onToggle: () => toggled.push(1)});
    await settle();
    const menu = menuAt(element.querySelector("[data-queue-process]"));
    expect(menu.labels).toEqual(["Show output", "Copy command", "Open its task"]);
    await menu.choose("Show output");
    await menu.choose("Copy command");
    await menu.choose("Open its task");
    expect(toggled).toEqual([1]);
    expect(copied).toEqual(["make package"]);
    expect(location.hash).toContain("open=tasks:11");
});

test("test_feed_file_items: a file of the feed has Open file, Fold and Copy path", async () => {
    const folded = [];
    const element = appended(DiffCard, {path: "src/app/Main.vue", change: "edit", added: 2, removed: 1, at: "2026-11-03T10:00:00Z", rows: [], onFold: () => folded.push(1)});
    await settle();
    const menu = menuAt(element.querySelector(".diff-card-head"));
    expect(menu.labels).toEqual(["Open file", "Fold", "Copy path"]);
    await menu.choose("Fold");
    await menu.choose("Copy path");
    await menu.choose("Open file");
    expect(folded).toEqual([1]);
    expect(copied).toEqual(["src/app/Main.vue"]);
    expect(decodeURIComponent(location.hash)).toBe("#/file?q=src/app/Main.vue");
});

test("an agent's memory has Open, Weigh, Copy text, Edit and Remove with an Undo that restores it, and a removed one has Bring it back", async () => {
    const {runs, window} = recording(plainContext({}));
    const element = await mounted(AgentMemoryRow, window, {row: {id: 3, text: "Run the tests first", state: "active", weight: 7}});
    document.body.append(element);
    const menu = menuAt(element.querySelector("[data-memory]"));
    expect(menu.labels).toEqual(["Open", "Weigh", "Copy text", "Edit", "Remove"]);
    await menu.choose("Weigh", "9: owed work");
    await menu.byLabel("Remove").run({say});
    await settle();
    expect(runs).toEqual(["memory weigh 3 9", "memory remove 3 --reason Removed from the memory list"]);
    expect(spoken.at(-1)).toEqual(["Removed memory 3", {line: ["memory", "restore", "3"]}]);
    const gone = await mounted(AgentMemoryRow, window, {row: {id: 4, text: "Old", state: "removed", weight: 5}});
    expect(menuAt(gone.querySelector("[data-memory]")).labels).toEqual(["Open", "Weigh", "Copy text", "Edit", "Bring it back"]);
});

test("a row of a table has Open, Copy number and Copy row", async () => {
    const opened = [];
    const element = appended(DataTable, {columns: ["Id", "Command"], rows: [{cells: ["41", "make check"], open: "output:41"}, {cells: ["42", "make site"]}], onOpen: (ref) => opened.push(ref)});
    const [first, second] = element.querySelectorAll(".table-row:not(.head)");
    const menu = menuAt(first);
    expect(menu.labels).toEqual(["Open", "Copy number", "Copy row"]);
    await menu.choose("Open");
    await menu.choose("Copy number");
    await menu.choose("Copy row");
    expect(opened).toEqual(["output:41"]);
    expect(copied).toEqual(["41", "41 make check"]);
    expect(menuAt(second).byLabel("Open").disabled).toBe(true);
});

test("a reference to a row in any text opens it or copies its words, before the row around it", () => {
    document.body.innerHTML = `<div><button data-peek="plans:1131" title="Plan 1131">plan 1131</button></div>`;
    const menu = menuAt(document.body.querySelector("[data-peek]"));
    expect(menu.head).toBe("Plan 1131");
    expect(menu.labels).toEqual(["Open", "Copy reference"]);
});
