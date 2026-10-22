import {createApp, h} from "vue";
import {afterEach, describe, expect, test} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {store} = await import("../src/state/store.js");
const {busyLine} = await import("../src/domain/agentState.js");
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
