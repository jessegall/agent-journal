import {createApp, h, nextTick} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {expect, test} from "vitest";
import Output from "../../core/modules/processes/web/src/Output.vue";
import Outputs from "../../core/modules/processes/web/src/Outputs.vue";
import {context, page} from "./support/windowContext.js";

const run = (id, line, state, extra = {}) => ({id, line, state, exit_code: null, ...extra});

async function mounted(component, windowContext) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(element);
    await settle();
    return element;
}

async function settle() {
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
}

// a window context that keeps the lines it ran and the functions that follow events
function recording(answers, options = {}) {
    const windowContext = context(answers);
    windowContext.runs = [];
    windowContext.heard = [];
    windowContext.run = async (line) => {
        windowContext.runs.push(line);
        return {ok: true, value: null};
    };
    windowContext.follow = (patterns, heard) => windowContext.heard.push({patterns, heard});
    windowContext.setting = async (key, fallback) => options[key] ?? fallback;
    return windowContext;
}

test("the outputs window lists the runs as the journal gives them, newest first, each with its state and command", async () => {
    const windowContext = recording({"process list": page([run(2, "make test", "running"), run(1, "ls build", "finished")])});
    const element = await mounted(Outputs, windowContext);
    const rows = [...element.querySelectorAll(".run")];
    expect(rows.map((row) => row.querySelector(".line").textContent)).toEqual(["make test", "ls build"]);
    expect(rows.map((row) => row.querySelector(".state").textContent)).toEqual(["running", "finished"]);
});

test("a state change is shown without a reload", async () => {
    const answers = {"process list": page([run(1, "make test", "running")])};
    const windowContext = recording(answers);
    const element = await mounted(Outputs, windowContext);
    expect(element.querySelector(".state").textContent).toBe("running");
    answers["process list"] = page([run(1, "make test", "failed", {exit_code: 2})]);
    windowContext.heard.forEach((follow) => follow.heard());
    await settle();
    expect(element.querySelector(".state").textContent).toBe("failed");
    expect(windowContext.heard.some((follow) => follow.patterns.includes("process.*"))).toBe(true);
});

test("the stop and watch buttons of a running run run their lines and an ended run has neither", async () => {
    const windowContext = recording({"process list": page([run(2, "make test", "running"), run(1, "ls", "finished")])});
    const element = await mounted(Outputs, windowContext);
    const [running, ended] = [...element.querySelectorAll(".run")];
    running.querySelector(".stop").click();
    running.querySelector(".watch").click();
    await settle();
    expect(windowContext.runs).toEqual(["output stop 2", "output watch 2"]);
    expect(ended.querySelector(".stop")).toBeNull();
    expect(ended.querySelector(".watch")).toBeNull();
});

test("with no run the window says so", async () => {
    const element = await mounted(Outputs, recording({"process list": page([])}));
    expect(element.textContent).toContain("No commands yet");
});

test("the output window shows the reader's lines and the whole text on a button, and follows a running output", async () => {
    const answers = {
        "process show 4": {ok: true, value: run(4, "pytest -q", "running")},
        "output peek 4 --summary": {ok: true, value: {lines: ["output 4 is running: 3 lines, 40 characters", "3: FAILED a"]}},
        "output peek 4 --all": {ok: true, value: {lines: ["setup", "ok", "FAILED a"]}},
    };
    const windowContext = recording(answers, {output: 4});
    const element = await mounted(Output, windowContext);
    expect(element.textContent).toContain("3: FAILED a");
    answers["output peek 4 --summary"] = {ok: true, value: {lines: ["output 4 is running: 4 lines, 52 characters", "3: FAILED a", "4: FAILED b"]}};
    windowContext.heard.forEach((follow) => follow.heard());
    await settle();
    expect(element.textContent).toContain("4: FAILED b");
    element.querySelector(".whole").click();
    await settle();
    expect(element.textContent).toContain("setup");
    expect(windowContext.reads).toContain("output peek 4 --all");
});

test("a pruned output says so, and the output window has its stop and watch buttons", async () => {
    const pruned = recording({"process show 3": {ok: true, value: run(3, "make", "finished")}, "output peek 3 --summary": {ok: true, value: {lines: ["output 3 was pruned"]}}}, {output: 3});
    expect((await mounted(Output, pruned)).textContent).toContain("output 3 was pruned");
    const running = recording({"process show 5": {ok: true, value: run(5, "make", "running")}, "output peek 5 --summary": {ok: true, value: {lines: ["output 5 is running"]}}}, {output: 5});
    const element = await mounted(Output, running);
    element.querySelector(".stop").click();
    element.querySelector(".watch").click();
    await settle();
    expect(running.runs).toEqual(["output stop 5", "output watch 5"]);
});
