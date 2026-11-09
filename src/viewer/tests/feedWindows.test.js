import {readFileSync, readdirSync, statSync} from "node:fs";
import {join, resolve} from "node:path";
import {expect, test, vi} from "vitest";
import {context, mounted} from "./support/windowContext.js";
import {context as agentContext} from "./support/agentWindowContext.js";
import {AGENT_EDIT_KEYS, fileFeedWindowContext} from "./support/fileFeedWindowContext.js";
import {terminalWindowContext} from "./support/terminalWindowContext.js";
import {outputWindowContext} from "./support/outputWindowContext.js";
import {expectFeedRules} from "./support/feedRules.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";
import AgentFileEdits from "../../suites/coding/web/src/AgentFileEdits.vue";
import Terminal from "../../suites/coding/web/src/Terminal.vue";
import TranscriptRows from "../../core/modules/agents/web/src/TranscriptRows.vue";
import Output from "../../core/modules/processes/web/src/Output.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

// a newest page that says another page follows it: the page number, the page size and the total tell it
const newestOf = (rows) => ({ok: true, value: {rows, page: 1, size: rows.length, total: rows.length + 10}});
const lastOf = (rows) => ({ok: true, value: {rows, page: 1, size: rows.length, total: rows.length}});

const row = (id) => ({id, author: "worker", row_type: "assistant", text: `row ${id}`, time: "2026-11-03T05:00:00.000Z"});
const edit = (id) => ({id, path: `src/file${id}.py`, edit_type: "edit", added: 1, removed: 0, rows: "[]", created_at: "2026-11-03T05:00:00+00:00"});
const call = (id) => ({id, agent_id: 7, hook: "pre_tool_use", tool: "Bash", summary: `call ${id}`, answer: "allow", refusal: ""});
const message = (id) => ({id, type: "agent", text: `message ${id}`, created_at: `2026-11-02T10:00:${String(id).padStart(2, "0")}Z`});

test("the transcript reads the newest page on open and one earlier page when scrolled to the top", async () => {
    await expectFeedRules(async () => {
        const window = agentContext({"agent transcript 7 --limit 50": newestOf([row(51), row(52)]), "agent transcript 7 --before-id 51": lastOf([row(50)])});
        return {element: await mounted(TranscriptRows, window, {name: "transcript.7"}), reads: window.reads};
    });
});

test("the file feed tab reads the newest page on open and one earlier page when scrolled to the top", async () => {
    await expectFeedRules(async () => {
        const window = context({"file-edit list --agent 7 --limit 50": newestOf([edit(3), edit(2)]), "file-edit list --agent 7 --before-id 2": lastOf([edit(1)])}, null, AGENT_EDIT_KEYS);
        return {element: await mounted(AgentFileEdits, window, {agent: 7}), reads: window.reads};
    });
});

test("the file feed window reads the newest page on open and one earlier page when scrolled to the top", async () => {
    await expectFeedRules(async () => {
        const window = fileFeedWindowContext({"file-edit list --limit 50": newestOf([edit(3), edit(2)]), "file-edit list --before-id 2": lastOf([edit(1)])});
        return {element: await mounted(FileFeed, window), reads: window.reads};
    });
});

test("the terminal reads the newest page on open and one earlier page when scrolled to the top", async () => {
    await expectFeedRules(async () => {
        const window = terminalWindowContext({}, 7);
        const newest = Array.from({length: 200}, (_, index) => call(400 - index));
        const reads = [];
        window.read = async (line) => {
            reads.push(line);
            return !line.startsWith("hook-call feed") ? {ok: false, error: line} : (line.includes("--before-id 201") ? lastOf([call(200)]) : {ok: true, value: {rows: newest}});
        };
        window.option = () => ({value: "commands"});
        return {element: await mounted(Terminal, window), reads};
    });
});

test("the chat reads the newest page on open and one earlier page when scrolled to the top", async () => {
    await expectFeedRules(async () => {
        const window = context({"message feed --limit 50": newestOf([message(52), message(51)]), "message feed --before-id 51": lastOf([message(50)]), "chat-mark main": lastOf([])});
        return {element: await mounted(Chat, window), reads: window.reads};
    }, {pane: (element) => element.querySelector(".history")});
});

test("the whole output reads the newest page on open and one earlier page when scrolled to the top", async () => {
    const page = (lines, first_byte, last_byte) => ({ok: true, value: {lines, first_byte, last_byte, total: last_byte, cut_bytes: 0}});
    await expectFeedRules(async () => {
        const window = outputWindowContext({
            "process feed --id 3": {ok: true, value: {rows: [{id: 3, state: "finished", line: "make"}]}},
            "output peek 3 --summary": {ok: true, value: {lines: ["read"]}},
            "output page 3 --before 900": page(["earlier"], 800, 900),
            "output page 3": page(["newest"], 900, 1000),
        }, 3);
        window.setting = async () => 3;
        const element = await mounted(Output, window);
        element.querySelector(".whole").click();
        await vi.waitFor(() => expect(element.textContent).toContain("newest"));
        return {element, reads: window.reads};
    }, {pane: (element) => element.querySelector("pre.output-lines")});
});

// every window that scrolls a feed passes the paginator to the pane that shows it; the panes that are not a feed are named here with why
const NOT_A_FEED = {"core/modules/processes/web/src/Output.vue": 1, "core/modules/plugins/web/src/PluginServiceTerminal.vue": 1};
const SOURCE_ROOTS = ["../../core/modules", "../../suites", "../src"];
const sourcesUnder = (folder) => readdirSync(folder).flatMap((name) => {
    if (name === "node_modules" || name === "dist" || name === "tests") return [];
    const path = join(folder, name);
    return statSync(path).isDirectory() ? sourcesUnder(path) : (name.endsWith(".vue") ? [path] : []);
});

test("every feed window gives its pane the paginator", () => {
    const panes = SOURCE_ROOTS.flatMap((root) => sourcesUnder(resolve(__dirname, root))).filter((path) => !path.endsWith("AutoScrollPane.vue") && !path.endsWith("OutputLines.vue"));
    const without = panes.flatMap((path) => {
        const source = readFileSync(path, "utf8");
        const drawn = [...source.matchAll(/<(AutoScrollPane|OutputLines)\b[^>]*>/g)].filter(([tag]) => !/:feed=/.test(tag));
        const allowed = Object.entries(NOT_A_FEED).find(([name]) => path.endsWith(name))?.[1] ?? 0;
        return drawn.length > allowed ? [path] : [];
    });
    expect(without).toEqual([]);
});
