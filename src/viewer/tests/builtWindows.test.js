import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";

vi.mock("@journal/window-kit", async () => await import("../../core/modules/viewer/web/dist/kit/window-kit.js"));
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import Tasks from "../../core/modules/tasks/web/dist/tasks.js";
import Chat from "../../core/modules/messages/web/dist/chat.js";

const ANSWERS = {
    "task list": {code: 0, value: {rows: [{id: 1, title: "Fix the cart", state: "open"}, {id: 2, title: "Ship the cart", state: "started"}], page: 1, size: 50, total: 2}},
    "message list": {code: 0, value: {rows: [{id: 1, type: "user", text: "Ship the cart today"}], page: 1, size: 50, total: 1}},
    "chat-mark list": {code: 0, value: {rows: [{id: 1, type: "tasks.task", variant: "started", key: "task:1", text: "Task 1 started", state: "ended"}], page: 1, size: 50, total: 1}},
};

afterEach(() => vi.unstubAllGlobals());

async function drawn(component, events) {
    vi.stubGlobal("fetch", async (url, request) => {
        const line = JSON.parse(request.body).line.slice(0, 2).join(" ");
        return {json: async () => ANSWERS[line] ?? {code: 1, error: `no answer for ${line}`}};
    });
    const element = document.createElement("div");
    document.body.appendChild(element);
    createApp(() => h(WindowHost, {name: "test.window", component, subscriptions: new WindowSubscriptions(), environment: "main", events})).mount(element);
    for (let round = 0; round < 8; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 20));
    return element.textContent;
}

test("a built tasks window shows the rows its read answers with, through the shell's own window context", async () => {
    const text = await drawn(Tasks, ["task.*"]);
    expect(text).toContain("Fix the cart");
    expect(text).toContain("Ship the cart");
    expect(text).not.toContain("No tasks yet");
});

test("a built chat window shows the messages its read answers with", async () => {
    const text = await drawn(Chat, ["message.*", "chat_mark.*", "dock_item.*"]);
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
            for (const source of imports) expect(["vue", "@journal/window-kit"].includes(source) || source.startsWith("./"), `${dist}/${file} imports ${source}`).toBe(true);
        }
    }
});
