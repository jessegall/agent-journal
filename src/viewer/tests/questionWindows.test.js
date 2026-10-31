import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, drawn, page} from "./support/windowContext.js";
import Questions from "../../core/modules/questions/web/src/questions.js";
import Waiting from "../../core/modules/questions/web/src/waiting.js";

const QUESTION = {id: 1, text: "Which database?", options: ["postgres", "sqlite"], recommended: "postgres", state: "open"};

async function mounted(component, windowContext) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(element);
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    return element;
}

function recording(answers) {
    const windowContext = context(answers);
    const runs = [];
    windowContext.run = async (words) => {
        runs.push(words);
        return {ok: true, value: null};
    };
    return {windowContext, runs};
}

test("the waiting list shows each item with its label, its status and where it waits", async () => {
    const text = await drawn(Waiting, context({
        "wait list": page([{id: 1, focus: "Which database?", state: "open"}]),
        "wait-target list": page([{id: 1, wait_id: 1, row_table: "questions", row_id: 1}]),
    }));
    expect(text).toContain("Which database?");
    expect(text).toContain("open");
    expect(text).toContain("questions:1");
});

test("an empty waiting list shows an empty state", async () => {
    expect(await drawn(Waiting, context({"wait list": page([]), "wait-target list": page([])}))).toContain("Nothing is waiting");
});

test("the questions list shows the recommended choice first and marked", async () => {
    const text = await drawn(Questions, context({"question list": page([QUESTION])}));
    expect(text).toContain("Which database?");
    expect(text.indexOf("postgres (recommended)")).toBeGreaterThan(-1);
    expect(text.indexOf("postgres")).toBeLessThan(text.indexOf("sqlite"));
});

test("a click on a choice answers the question with it", async () => {
    const {windowContext, runs} = recording({"question list": page([QUESTION])});
    const element = await mounted(Questions, windowContext);
    element.querySelectorAll("button.question-choice")[1].click();
    await nextTick();
    expect(runs).toEqual([["question", "answer", "1", "--answer", "sqlite"]]);
});

test("a typed answer answers the question with the text", async () => {
    const {windowContext, runs} = recording({"question list": page([QUESTION])});
    const element = await mounted(Questions, windowContext);
    const input = element.querySelector("input.question-answer");
    input.value = "MariaDB";
    input.dispatchEvent(new Event("input"));
    element.querySelector("button.question-send").click();
    await nextTick();
    expect(runs).toEqual([["question", "answer", "1", "--answer", "MariaDB"]]);
});

test("the close button closes the question", async () => {
    const {windowContext, runs} = recording({"question list": page([QUESTION])});
    const element = await mounted(Questions, windowContext);
    element.querySelector("button.question-close").click();
    await nextTick();
    expect(runs).toEqual([["question", "close", "1"]]);
});

test("an empty questions list shows an empty state", async () => {
    expect(await drawn(Questions, context({"question list": page([])}))).toContain("No open questions");
});
