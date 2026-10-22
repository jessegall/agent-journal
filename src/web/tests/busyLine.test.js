import {createApp, h} from "vue";
import {afterEach, describe, expect, test} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {store} = await import("../src/state/store.js");
const {busyLine, lineOf} = await import("../src/domain/agentState.js");
const {wordingsOf} = await import("../src/domain/busyWording.js");
const {line} = await import("../src/domain/statusQueue.js");
const {default: RunningCommand} = await import("../src/chat/RunningCommand.vue");

const agent = (more = {}) => ({status: "working", tool_running: false, doing: "", thinking: "", ...more});
let app = null;

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
});

describe("the chat's status line", () => {
    test("shows each part of a chained command as it runs, never the thought behind it", () => {
        const thinking = "Checking the tree before the commit";
        expect(busyLine(agent({tool_running: true, doing: "cd src", thinking}))).toEqual({thinking: "", doing: "cd src"});
        expect(busyLine(agent({tool_running: true, doing: "git status", thinking}))).toEqual({thinking: "", doing: "git status"});
    });

    test("shows another tool by its verb, the thought only when nothing runs, and a helper's job when there is no thought", () => {
        expect(busyLine(agent({tool_running: true, doing: "reading a file", thinking: "Read the router"})).doing).toBe("reading a file");
        expect(busyLine(agent({thinking: "Read the router"}))).toEqual({thinking: "Read the router", doing: ""});
        expect(busyLine(agent(), {task: "map the hooks"}).doing).toBe("Waiting: map the hooks");
        expect(busyLine(agent()).doing).toBe("thinking");
        expect(busyLine(agent({status: "compacting", tool_running: true, doing: "git status"})).doing).toBe("compacting");
    });

    test("draws the running part when the bar has no line of its own yet", async () => {
        store.bar = [];
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(RunningCommand, {idle: busyLine(agent({tool_running: true, doing: "git status"})).doing})});
        app.mount(host);
        await flush();
        expect(host.querySelector(".running-idle").textContent).toBe("git status");
    });

    test("shows a running command's time only once it has run past three seconds", () => {
        const running = {key: "c1 pytest -q", time: 1, done: false, for: 0, clock: true, parts: [{value: "testing"}, {value: "pytest"}, {value: "-q"}]};
        expect(line(running, 2).clock).toBe("");
        expect(line(running, 4).clock).toBe("4s");
        expect(line({...running, done: true, for: 1}, 9).clock).toBe("");
    });

    test("counts a file change's added lines up in green and its removed lines in red", async () => {
        store.bar = [{id: 1, key: "Edit src/app.py", time: Date.now() / 1000, done: true, for: 0.2, clock: true, hold: 0, lingers: 10, parts: [{value: "editing", color: "gray"}, {value: "src/app.py", color: "muted"}, {value: 2, prefix: "+", color: "green", increments: true}, {value: 1, prefix: "-", color: "red", increments: true}]}];
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(RunningCommand, {idle: "thinking"})});
        app.mount(host);
        await new Promise((r) => setTimeout(r, 500));
        await flush();
        const tokens = [...host.querySelectorAll(".running-token")];
        expect(tokens.map((t) => t.textContent.trim())).toEqual(["editing", "src/app.py", "+2", "-1"]);
        expect(tokens[2].classList.contains("green") && tokens[3].classList.contains("red")).toBe(true);
    });

    test("the top bar names the task in hand while a command runs, and a busy line in turn with none, never the command", () => {
        const running = agent({tool_running: true, doing: "journal setup restart"});
        const task = {id: 7, title: "the footer"};
        expect(lineOf(running, task)).not.toContain("journal setup restart");
        expect(lineOf(running, task)).toContain("the footer");
        const testing = agent({tool_running: true, tool: "Bash", doing: "python3 -m pytest -q", heard_at: "2026-10-22T12:00:07Z"});
        expect(wordingsOf("tests")).toContain(lineOf(testing, null));
        expect(lineOf({...testing}, null)).toBe(lineOf(testing, null));
        expect(lineOf(running, null)).not.toContain("journal setup restart");
        expect(wordingsOf("bearings")).toContain(lineOf(agent({heard_at: "2026-10-22T12:00:03Z"}), null));
    });

    test("rolls through the running parts of a chain, holding a shared command still while only its argument rolls", async () => {
        const row = (time, verb, command, argument, done = false) => ({id: time, key: `c1 ${command} ${argument}`, time, done, for: 0, clock: false, hold: 0, lingers: 10, parts: [{value: verb, color: "gray"}, {value: command, color: "muted"}, {value: argument, color: "muted"}]});
        const now = Date.now() / 1000;
        store.bar = [row(now - 2, "reading", "cat", "a.py")];
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(RunningCommand, {idle: "thinking"})});
        app.mount(host);
        await flush();
        const shown = () => [...host.querySelectorAll(".running-token")].map((t) => t.textContent.trim());
        const lineOf = () => host.querySelector(".running-line");
        expect(shown()).toEqual(["reading", "cat", "a.py"]);
        const first = lineOf();
        store.bar = [row(now - 2, "reading", "cat", "a.py", true), row(now - 1, "reading", "cat", "b.py")];
        await new Promise((r) => setTimeout(r, 300));
        await flush();
        expect(shown()).toContain("b.py");
        expect(lineOf()).toBe(first);
        store.bar = [row(now - 2, "reading", "cat", "a.py", true), row(now - 1, "reading", "cat", "b.py", true), row(now, "testing", "pytest", "-q")];
        await new Promise((r) => setTimeout(r, 300));
        await flush();
        expect(shown()).toContain("pytest");
        expect(lineOf()).not.toBe(first);
    });
});
