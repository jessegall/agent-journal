import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";

vi.mock("@journal/window-kit", async () => await import("../../core/modules/viewer/web/dist/kit/window-kit.js"));
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import Tasks from "../../core/modules/tasks/web/dist/tasks.js";
import Chat from "../../core/modules/messages/web/dist/chat.js";
import {perLine} from "./support/windowContext.js";

const ANSWERS = {
    "task board": {code: 0, value: {groups: [{state: "started", total: 1, rows: [{id: 2, title: "Ship the cart", state: "started"}]}, {state: "open", total: 1, rows: [{id: 1, title: "Fix the cart", state: "open"}]}]}},
    "message feed": {code: 0, value: {rows: [{id: 1, type: "user", text: "Ship the cart today"}], page: 1, size: 50, total: 1}},
    "chat-mark main": {code: 0, value: {rows: [{id: 1, type: "tasks.task", variant: "started", key: "task:1", text: "Task 1 started", state: "ended"}], page: 1, size: 50, total: 1}},
};

afterEach(() => vi.unstubAllGlobals());

const KEY_LINES = {board: "task board", messages: "message feed", marks: "chat-mark main"};
const DECLARED = (names) => Object.fromEntries(names.map((name) => [name, {tab: null, events: [], reload_seconds: 0, loading: "first", page_size: 0}]));

async function drawn(component, events, names) {
    vi.stubGlobal("fetch", perLine(async (url, request) => {
        if (String(url).startsWith("/api/window?")) return {ok: true, json: async () => ({declared: DECLARED(names), keys: Object.fromEntries(names.map((name) => [name, ANSWERS[KEY_LINES[name]]]))})};
        const line = JSON.parse(request.body).line.slice(0, 2).join(" ");
        return {json: async () => ANSWERS[line] ?? {code: 1, error: `no answer for ${line}`}};
    }));
    const element = document.createElement("div");
    document.body.appendChild(element);
    createApp(() => h(WindowHost, {name: "test.window", component, subscriptions: new WindowSubscriptions(), environment: "main", events})).mount(element);
    for (let round = 0; round < 8; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return element.textContent;
}

test("a built tasks window shows the rows its read answers with, through the shell's own window context", async () => {
    const text = await drawn(Tasks, ["task.*"], ["board"]);
    expect(text).toContain("Fix the cart");
    expect(text).toContain("Ship the cart");
    expect(text).not.toContain("No tasks yet");
});

test("a built chat window shows the messages its read answers with", async () => {
    const text = await drawn(Chat, ["message.*", "chat_mark.*", "dock_item.*"], ["messages", "marks"]);
    expect(text).toContain("Ship the cart today");
});

test("every built window imports only Vue, the window kit and its own chunks, so the shell's one context reaches it", async () => {
    const {readdirSync, readFileSync, statSync} = await import("node:fs");
    const {join} = await import("node:path");
    const roots = ["../../core/modules", "../../suites"].map((root) => new URL(root, import.meta.url).pathname);
    const folders = (root) => readdirSync(root).flatMap((name) => (statSync(join(root, name)).isDirectory() && name !== "node_modules" ? [join(root, name), ...folders(join(root, name))] : []));
    const dists = roots.flatMap(folders).filter((folder) => folder.endsWith("/web/dist") && !folder.includes("/viewer/web/dist"));
    expect(dists.length).toBeGreaterThan(5);
    for (const dist of dists) {
        for (const file of readdirSync(dist).filter((name) => name.endsWith(".js"))) {
            const imports = [...readFileSync(join(dist, file), "utf8").matchAll(/^import[^;]*?from\s*"([^"]+)";/gm)].map((match) => match[1]);
            for (const source of imports) expect(["vue", "@journal/window-kit", "@journal/setting-components"].includes(source) || source.startsWith("./"), `${dist}/${file} imports ${source}`).toBe(true);
        }
    }
});
