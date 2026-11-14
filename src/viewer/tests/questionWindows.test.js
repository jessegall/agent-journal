import {questionsWindowContext} from "./support/questionsWindowContext.js";
import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, drawn, page} from "./support/windowContext.js";
import Questions from "../../core/modules/questions/web/src/questions.js";
import Waiting from "../../core/modules/questions/web/src/waiting.js";

const waitingWindowContext = (answers) => context(answers, null, {waits: {line: "wait waiting", events: ["wait.*"]}});

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
    const windowContext = questionsWindowContext(answers);
    const runs = [];
    windowContext.run = async (words) => {
        runs.push(words);
        return {ok: true, value: null};
    };
    return {windowContext, runs};
}

test("the waiting list shows each item with its label, its status and where it waits", async () => {
    const text = await drawn(Waiting, waitingWindowContext({
        "wait waiting": page([{id: 1, focus: "Which database?", state: "open", opened_at: new Date(Date.now() - 5 * 60000).toISOString(), targets: "questions:1"}]),
    }));
    expect(text).toContain("Which database?");
    expect(text).toContain("open");
    expect(text).toContain("questions:1");
    expect(text).toContain("5 min");
    expect(text).toContain("What the agent is waiting for");
});

test("an empty waiting list shows an empty state", async () => {
    expect(await drawn(Waiting, waitingWindowContext({"wait waiting": page([])}))).toContain("Nothing is waiting");
});

test("the questions list shows the recommended choice with a star after its words", async () => {
    const element = await mounted(Questions, questionsWindowContext({"question list": page([QUESTION])}));
    document.body.append(element);
    const postgres = element.querySelector('[data-question-option="postgres"]');
    expect(element.textContent).toContain("Which database?");
    expect(postgres.querySelector("[data-question-recommended]")).not.toBeNull();
    expect(element.querySelector('[data-question-option="sqlite"] [data-question-recommended]')).toBeNull();
    expect(postgres.compareDocumentPosition(element.querySelector('[data-question-option="sqlite"]')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("a picked choice answers the question when Answer is pressed", async () => {
    const {windowContext, runs} = recording({"question list": page([QUESTION])});
    const element = await mounted(Questions, windowContext);
    document.body.append(element);
    element.querySelector('[data-question-option="sqlite"]').click();
    await nextTick();
    expect(runs).toEqual([]);
    element.querySelector("[data-question-answer]").click();
    await nextTick();
    expect(runs).toEqual([["question", "answer", "1", "--answer", "sqlite"]]);
});

test("a typed answer answers the question with the text", async () => {
    const {windowContext, runs} = recording({"question list": page([QUESTION])});
    const element = await mounted(Questions, windowContext);
    document.body.append(element);
    const input = element.querySelector("form input");
    input.value = "MariaDB";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    element.querySelector("[data-question-answer]").click();
    await nextTick();
    expect(runs).toEqual([["question", "answer", "1", "--answer", "MariaDB"]]);
});

test("an empty questions list says None under the Open bar", async () => {
    expect(await drawn(Questions, questionsWindowContext({"question list": page([])}))).toContain("None");
});
