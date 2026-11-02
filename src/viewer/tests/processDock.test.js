import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkButtons from "../src/chat/MarkButtons.vue";
import OutputDock from "../../core/modules/processes/web/src/OutputDock.vue";
import {nextTick, ref} from "vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {context, mounted, settle} from "./support/windowContext.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
afterEach(() => vi.unstubAllGlobals());

const DOCK = {icon: "dock", label: "Dock", runs: "dock add processes.output process {row_id}"};
const STOP_WATCHING = {icon: "close", label: "Stop watching", runs: "output unwatch {row_id}"};

// task 5499: a process mark docks its process above the composer, and the card stops watching it
function pressed(button) {
    const lines = [];
    vi.stubGlobal("fetch", async (url, init) => (lines.push(JSON.parse(init.body).line), {json: async () => ({code: 0, value: null, error: ""})}));
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(MarkButtons, {buttons: [button], mark: {target_id: 3}})).provide(WINDOW_CONTEXT, {environment: "development"}).mount(element);
    element.querySelector("button").click();
    return lines;
}

test("the Dock button of a process mark adds the process to the dock", async () => {
    const lines = pressed(DOCK);
    await settle();
    expect(lines).toEqual([["dock", "add", "processes.output", "process", "3"]]);
});

test("the card of a docked process stops watching it with its button", async () => {
    const lines = pressed(STOP_WATCHING);
    await settle();
    expect(lines).toEqual([["output", "unwatch", "3"]]);
});

test("a docked process's card shows the title and steps its output keeps, in place of the raw command", async () => {
    const window = context({
        "process card 3": {ok: true, value: {id: 3, state: "running", line: "pytest -q", title: "Running tests", steps_passed: 12, steps_failed: 1}},
        "output peek 3": {ok: true, value: {lines: []}},
    });
    const head = document.createElement("span");
    document.body.append(head);
    window.option = (key) => ref(key === "head" ? head : {id: 7, target_id: 3});
    await mounted(OutputDock, window);
    expect(head.querySelector(".output-dock-title").textContent).toBe("Running tests");
    expect(head.querySelector("[data-output-steps]").textContent).toBe("12 passed, 1 failed");
});

test("a docked process's card shows the run live, and unfolded its whole terminal output", async () => {
    const window = context({
        "process card 3": {ok: true, value: {id: 3, state: "running", line: "make build", title: "", steps_passed: 0, steps_failed: 0}},
        "output peek 3": {ok: true, value: {lines: ["compiling the cart", "[ 40%]"]}},
    });
    const head = document.createElement("span");
    document.body.append(head);
    window.option = (key) => ref(key === "head" ? head : {id: 7, target_id: 3});
    const element = await mounted(OutputDock, window);
    expect(head.querySelector(".output-dock-state").dataset.state).toBe("running");
    expect(head.querySelector(".output-dock-title").textContent).toBe("make build");
    expect(window.reads.some((line) => line.startsWith("output peek"))).toBe(false);
    head.querySelector("[data-output-toggle]").click();
    await settle();
    expect(window.reads).toContain("output peek 3 --all");
    expect(element.querySelector("[data-output-terminal]").textContent).toBe("compiling the cart\n[ 40%]");
});

test("a button that names variants shows only on a mark of one of them", async () => {
    const {default: MarkButtons} = await import("../src/chat/MarkButtons.vue");
    const {createApp, h} = await import("vue");
    const {WINDOW_CONTEXT} = await import("../src/windows/windowContext.js");
    const drawn = (variant) => {
        const element = document.createElement("div");
        const app = createApp({render: () => h(MarkButtons, {mark: {variant, target_id: 1}, buttons: [{icon: "dock", label: "Dock", runs: "dock add", variants: ["running"]}, {icon: "close", label: "Open", runs: "x"}]})});
        app.provide(WINDOW_CONTEXT, {environment: "main"});
        app.mount(element);
        return [...element.querySelectorAll("button")].map((button) => button.title);
    };
    expect(drawn("running")).toEqual(["Dock", "Open"]);
    expect(drawn("finished")).toEqual(["Open"]);
});

test("a docked process's running time moves on with the clock, with no read", async () => {
    vi.useFakeTimers({now: Date.parse("2026-11-02T10:00:10Z"), toFake: ["setInterval", "clearInterval", "Date"]});
    try {
        const reads = [];
        const window = context({});
        window.read = async (line) => (reads.push(line), {ok: true, value: {id: 3, state: "running", line: "make build", title: "", steps_passed: 0, steps_failed: 0, created_at: "2026-11-02T10:00:00Z"}});
        const head = document.createElement("span");
        document.body.append(head);
        window.option = (key) => ref(key === "head" ? head : {id: 7, target_id: 3});
        await mounted(OutputDock, window);
        const shown = () => [...head.querySelectorAll(".output-dock-figure")].map((figure) => figure.textContent).join(" ");
        expect(shown()).toContain("10s");
        const readsBefore = reads.length;
        vi.advanceTimersByTime(1000);
        await nextTick();
        expect(shown()).toContain("11s");
        expect(reads.length).toBe(readsBefore);
    } finally {
        vi.useRealTimers();
    }
});
