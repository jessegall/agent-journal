import {questionsWindowContext} from "./support/questionsWindowContext.js";
import {expect, test} from "vitest";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

const QUESTION = {id: 7, text: "Merge now?", state: "open", options: ["Now", "Later"], recommended: "Later", created_at: "2026-11-02T10:00:00+00:00"};
const held = (run) => ({...questionsWindowContext({"question list": page([QUESTION])}), run});

test("each option is a line of its own and the recommended one is tagged", async () => {
    const element = await mounted(QuestionRows, held(async () => ({ok: true, value: null})));
    const options = [...element.querySelectorAll("[data-question-option]")];
    expect(options.map((option) => option.dataset.questionOption)).toEqual(["Now", "Later"]);
    expect(options[1].textContent).toContain("Recommended");
    expect(options[0].textContent).not.toContain("Recommended");
    expect(element.querySelector("form input").placeholder).toContain("own words");
    expect(element.querySelector("[data-question-time]").getAttribute("datetime")).toBe(QUESTION.created_at);
});

test("an answer shows at once, before the server has answered", async () => {
    const asked = [];
    const element = await mounted(QuestionRows, held((words) => (asked.push(words), new Promise(() => {}))));
    element.querySelector('[data-question-option="Now"]').click();
    await settle();
    expect(element.querySelector("[data-question-settled]").textContent).toBe("Answered: Now");
    expect(element.querySelector("[data-question-option]")).toBeNull();
    expect(asked).toEqual([["question", "answer", "7", "--answer", "Now"]]);
});

test("a refused answer brings the options back with the reason", async () => {
    const element = await mounted(QuestionRows, held(async () => ({ok: false, error: "already closed"})));
    element.querySelector('[data-question-option="Now"]').click();
    await settle();
    expect(element.querySelector("[data-question-option]")).not.toBeNull();
    expect(element.querySelector("[data-question-failure]").textContent).toBe("already closed");
});

test("close goes at once and elaborate asks the agent in a message", async () => {
    const asked = [];
    const element = await mounted(QuestionRows, held(async (words) => (asked.push(words), {ok: true, value: null})));
    element.querySelector("[data-question-elaborate]").click();
    await settle();
    expect(asked[0].slice(0, 2)).toEqual(["message", "send"]);
    expect(asked[0][2]).toContain("question 7");
    expect(element.querySelector("[data-question-elaborate]").textContent).toContain("Asked to elaborate");
    element.querySelector("[data-question-close]").click();
    await settle();
    expect(asked[1]).toEqual(["question", "close", "7"]);
    expect(element.querySelector("[data-question-settled]").textContent).toBe("Closed");
});
