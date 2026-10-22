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
        store.bar = {queue: []};
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(RunningCommand, {idle: busyLine(agent({tool_running: true, doing: "git status"})).doing})});
        app.mount(host);
        await flush();
        expect(host.querySelector(".running-idle").textContent).toBe("git status");
    });
});
