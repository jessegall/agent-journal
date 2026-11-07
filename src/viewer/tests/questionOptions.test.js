import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import QuestionOptions from "../../core/modules/questions/web/src/QuestionOptions.vue";
import {context, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

function drawn(row, runs = []) {
    const shown = {...context({}), option: () => ({value: row}), run: async (line) => (runs.push(line), {ok: true, value: {}})};
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(QuestionOptions)});
    app.provide(WINDOW_CONTEXT, shown);
    app.mount(element);
    return element;
}

const OPEN = {id: 4, state: "open", options: ["Cart", "Totals"], recommended: "Totals"};

test("the option buttons run question answer with the option", async () => {
    const runs = [];
    const element = drawn(OPEN, runs);
    await settle();
    const buttons = [...element.querySelectorAll("[data-question-option]")];
    expect(buttons.map((button) => button.textContent.trim())).toEqual(["Cart", "Totals (recommended)"]);
    expect(buttons[1].classList.contains("primary")).toBe(true);
    buttons[0].click();
    await settle();
    expect(runs).toEqual([["question", "answer", "4", "--answer", "Cart"]]);
});

test("an answered or closed question shows no option", async () => {
    const element = drawn({...OPEN, state: "answered"});
    await settle();
    expect(element.querySelector("[data-question-options]")).toBeNull();
});
