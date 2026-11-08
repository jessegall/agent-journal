import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkButtons from "../src/chat/MarkButtons.vue";
import OutputDock from "../../core/modules/processes/web/src/OutputDock.vue";
import {nextTick, ref} from "vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {provideDockCard} from "../kit/windowContextKey.js";
import {context, settle} from "./support/windowContext.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
afterEach(() => vi.unstubAllGlobals());

// the process body is drawn inside a dock card, which gives it the card's data, its reload and the way to read its output
async function mounted(component, window) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component)});
    const data = ref(null);
    app.provide(WINDOW_CONTEXT, window);
    provideDockCard((key, value) => app.provide(key, value), {
        data,
        reload: async () => { data.value = (await window.read("process card 3")).value; },
        readOutput: async (line) => window.read(line.join(" ")),
    });
    app.mount(element);
    await settle();
    return element;
}

const DOCK = {icon: "dock", label: "Dock", runs: "dock add processes.output process {row_id}"};
const STOP_WATCHING = {icon: "close", label: "Stop watching", runs: "output unwatch {row_id}"};

// task 5499: a process mark docks its process above the composer, and the card stops watching it
function pressed(button) {
    const lines = [];
    vi.stubGlobal(
        "fetch",
        async (url, init) => (lines.push(JSON.parse(init.body).line), {json: async () => ({code: 0, value: null, error: ""})})
    );
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(MarkButtons, {buttons: [button], mark: {target_id: 3}}))
        .provide(WINDOW_CONTEXT, {environment: "development"})
        .mount(element);
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
        "process card 3": {
            ok: true,
            value: {id: 3, state: "running", line: "pytest -q", title: "Running tests", steps_passed: 12, steps_failed: 1},
        },
        "output peek 3": {ok: true, value: {lines: []}},
    });
    const head = document.createElement("span");
    document.body.append(head);
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(foot, time);
    const folded = ref(true);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded, row: ref({id: 7, target_id: 3})})[key];
    await mounted(OutputDock, window);
    expect(head.querySelector(".output-dock-title").textContent).toBe("Running tests");
    expect(foot.querySelector("[data-output-steps]").textContent).toBe("Steps: 12 passed, 1 failed");
});

async function dockedHead(run) {
    const window = context({"process card 3": {ok: true, value: {id: 3, state: "running", line: "pytest -q", ...run}}, "output peek 3": {ok: true, value: {lines: []}}});
    const head = document.createElement("span");
    document.body.append(head);
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(foot, time);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded: ref(true), row: ref({id: 7, target_id: 3})})[key];
    await mounted(OutputDock, window);
    return foot;
}

test("a process with no steps and no percent shows three pending dots below its title", async () => {
    const foot = await dockedHead({});
    expect(foot.querySelectorAll("[data-output-pending] i")).toHaveLength(3);
});

test("the pending dots go once a run has steps or a percent", async () => {
    expect((await dockedHead({steps_passed: 1})).querySelector("[data-output-pending]")).toBeNull();
    expect((await dockedHead({progress: 40})).querySelector("[data-output-pending]")).toBeNull();
});

test("a chained run's temporary title never shows its script in the header or tooltip", async () => {
    const line = "rm -rf /tmp/example && python3 - <<'PY'\nprint('private script')\nPY";
    const window = context({"process card 3": {ok: true, value: {id: 3, state: "running", line, title: "Removing files"}}});
    const head = document.createElement("span");
    document.body.append(head);
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(foot, time);
    const folded = ref(true);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded, row: ref({id: 7, target_id: 3})})[key];
    await mounted(OutputDock, window);
    expect(head.querySelector(".output-dock-title").textContent).toBe("Removing files");
    expect(head.querySelector(".output-dock-title").title).toBe("Removing files");
    expect(head.textContent).not.toContain("python3");
    expect(head.innerHTML).not.toContain("private script");
});

test("a docked process's card shows the run live, and unfolded its whole terminal output", async () => {
    const window = context({
        "process card 3": {
            ok: true,
            value: {id: 3, state: "running", line: "make build", title: "Running make", steps_passed: 0, steps_failed: 0},
        },
        "output page 3": {ok: true, value: {lines: ["compiling the cart", "[ 40%]"], first_byte: 0, last_byte: 26, total: 26}},
    });
    const head = document.createElement("span");
    document.body.append(head);
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(foot, time);
    const folded = ref(true);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded, row: ref({id: 7, target_id: 3})})[key];
    const element = await mounted(OutputDock, window);
    expect(head.querySelector(".output-dock-state").dataset.state).toBe("running");
    expect(head.querySelector(".output-dock-title").textContent).toBe("Running make");
    expect(window.reads.some((line) => line.startsWith("output page"))).toBe(false);
    folded.value = false;
    await settle();
    expect(window.reads).toContain("output page 3");
    expect(element.querySelector("[data-output-terminal]").textContent).toBe("compiling the cart\n[ 40%]");
});

test("a button that names variants shows only on a mark of one of them", async () => {
    const {default: MarkButtons} = await import("../src/chat/MarkButtons.vue");
    const {createApp, h} = await import("vue");
    const {WINDOW_CONTEXT} = await import("../src/windows/windowContext.js");
    const drawn = (variant) => {
        const element = document.createElement("div");
        const app = createApp({
            render: () =>
                h(MarkButtons, {
                    mark: {variant, target_id: 1},
                    buttons: [
                        {icon: "dock", label: "Dock", runs: "dock add", variants: ["running"]},
                        {icon: "close", label: "Open", runs: "x"},
                    ],
                }),
        });
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
        window.read = async (line) => (
            reads.push(line),
            {
                ok: true,
                value: {
                    id: 3,
                    state: "running",
                    line: "make build",
                    title: "",
                    steps_passed: 0,
                    steps_failed: 0,
                    created_at: "2026-11-02T10:00:00Z",
                },
            }
        );
        const head = document.createElement("span");
        document.body.append(head);
        const foot = document.createElement("span");
        const time = document.createElement("span");
        document.body.append(foot, time);
        const folded = ref(true);
        window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded, row: ref({id: 7, target_id: 3})})[key];
        await mounted(OutputDock, window);
        const shown = () => [...time.querySelectorAll(".output-dock-figure")].map((figure) => figure.textContent).join(" ");
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

async function foldedTime(run, collapsed) {
    const window = context({"process card 3": {ok: true, value: {id: 3, state: "running", line: "make build", created_at: "2026-11-02T10:00:00Z", ...run}}, "output peek 3": {ok: true, value: {lines: []}}});
    const head = document.createElement("span");
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(head, foot, time);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded: ref(true), collapsed: ref(collapsed), row: ref({id: 7, target_id: 3})})[key];
    await mounted(OutputDock, window);
    return {time, head};
}

test("a card folded to its title line shows only the percent in place of the duration, with no steps or failures", async () => {
    const {time, head} = await foldedTime({progress: 42, steps_passed: 12, steps_failed: 1}, true);
    expect([...time.children].map((child) => child.className)).toEqual(["output-dock-percent"]);
    expect(time.querySelector("[data-output-percent]").textContent).toBe("42%");
    expect(time.textContent).not.toMatch(/passed|failed|Steps/);
    expect(head.textContent).not.toMatch(/passed|failed|Steps/);
});

test("a process with no progress shows no percent, and an unfolded card shows none either", async () => {
    const idle = (await foldedTime({progress: 0}, true)).time;
    expect(idle.querySelector("[data-output-percent]")).toBeNull();
    expect(idle.querySelector(".output-dock-figure")).not.toBeNull();
    expect((await foldedTime({progress: 42}, false)).time.querySelector("[data-output-percent]")).toBeNull();
});

// a run that ends between two reads: the first read says it runs at 96%, the next says it ended with the row's percent still 96
async function endedBetweenReads(ending) {
    const window = context({"output peek 3": {ok: true, value: {lines: []}}});
    const answers = [{id: 3, state: "running", line: "make build", created_at: "2026-11-02T10:00:00Z", progress: 96}, {id: 3, line: "make build", created_at: "2026-11-02T10:00:00Z", ended_at: "2026-11-02T10:00:05Z", progress: 96, ...ending}];
    let reads = 0;
    const read = window.read;
    window.read = async (line) => (line === "process card 3" ? {ok: true, value: answers[Math.min(reads++, answers.length - 1)]} : read(line));
    const heard = [];
    window.follow = (patterns, handler) => heard.push(handler);
    const head = document.createElement("span");
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(head, foot, time);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded: ref(true), collapsed: ref(true), row: ref({id: 7, target_id: 3})})[key];
    await mounted(OutputDock, window);
    expect(time.querySelector("[data-output-percent]").textContent).toBe("96%");
    heard.forEach((handler) => handler({event: "process.finished", row_id: 3}));
    await settle();
    return {time, head};
}

test("a run that ends between two reads shows 100% and passed, never its last percent", async () => {
    const {time, head} = await endedBetweenReads({state: "finished"});
    expect(time.querySelector("[data-output-percent]").textContent).toBe("100%");
    expect(head.querySelector("[data-state='good']")).not.toBeNull();
    expect(head.querySelector(".output-dock-fill").style.width).toBe("100%");
});

test("a run that ends between two reads in failure shows the failure and no percent", async () => {
    const {time, head} = await endedBetweenReads({state: "failed"});
    expect(time.querySelector("[data-output-percent]")).toBeNull();
    expect(head.querySelector("[data-state='bad']")).not.toBeNull();
});

// an unfolded card whose output box is still empty
async function emptyBox(run, runs) {
    const window = context({"process card 3": {ok: true, value: {id: 3, state: "running", line: "make build", created_at: "2026-11-02T10:00:00Z", agent_id: 21, reads_progress: false, ...run}}, "output peek 3": {ok: true, value: {lines: []}}});
    window.run = async (line) => (runs.push(line), {ok: true, value: null});
    const head = document.createElement("span");
    const foot = document.createElement("span");
    const time = document.createElement("span");
    document.body.append(head, foot, time);
    window.option = (key) => ({head: ref(head), foot: ref(foot), time: ref(time), folded: ref(false), collapsed: ref(false), row: ref({id: 7, target_id: 3})})[key];
    const element = await mounted(OutputDock, window);
    await vi.waitFor(() => expect(element.querySelector("[data-output-terminal]")).not.toBeNull());
    return element;
}

test("an empty output box says No output yet, and a run with no reader offers a button that sends the agent its message", async () => {
    const runs = [];
    const element = await emptyBox({}, runs);
    expect(element.querySelector("[data-output-terminal]").textContent).toBe("No output yet");
    const ask = element.querySelector("[data-output-reader-ask]");
    expect(ask.textContent.trim()).toBe("Ask the agent to draw a reader");
    ask.click();
    expect(runs).toEqual([["message", "send", "Output 3 has no reader that gives its progress, and its box is empty: draw a reader for it with journal reader add.", "--target-agent", "21"]]);
});

test("a run whose reader gives progress, or one that ended, offers no reader button", async () => {
    expect((await emptyBox({reads_progress: true}, [])).querySelector("[data-output-reader-ask]")).toBeNull();
    expect((await emptyBox({state: "finished", ended_at: "2026-11-02T10:00:05Z"}, [])).querySelector("[data-output-reader-ask]")).toBeNull();
});
