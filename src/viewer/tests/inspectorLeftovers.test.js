import {questionsWindowContext} from "./support/questionsWindowContext.js";
import {afterEach, expect, test} from "vitest";
import {opening, route} from "../src/route.js";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import SuggestionRows from "../../core/modules/suggestions/web/src/SuggestionRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {suggestionWindowContext} from "./support/suggestionWindowContext.js";

afterEach(() => opening([]));

test("a question and a suggestion open in the panel", async () => {
    const question = await mounted(QuestionRows, questionsWindowContext({"question list": page([{id: 4, text: "Ship it?", state: "open", options: []}])}));
    question.querySelector('[data-question-open="4"]').click();
    await settle();
    expect(route.value.open).toMatchObject({table: "questions", id: 4});
    opening([]);
    const suggestion = await mounted(SuggestionRows, suggestionWindowContext({"suggestion list": page([{id: 6, title: "Add a story", state: "open"}])}));
    suggestion.querySelector('[data-suggestion-open="6"]').click();
    await settle();
    expect(route.value.open).toMatchObject({table: "suggestions", id: 6});
});
