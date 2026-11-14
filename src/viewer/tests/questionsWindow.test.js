import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {questionsWindowContext} from "./support/questionsWindowContext.js";
import {itemsOf} from "./support/cardMenu.js";
import {mounted, page, settle, typeInto} from "./support/windowContext.js";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import QuestionCard from "../../core/modules/questions/web/src/QuestionCard.vue";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const OPEN = {id: 7, text: "Merge now?", context: "The tests pass.", state: "open", options: ["Now", "Later"], recommended: "Later", session_agent_id: 4, row_model: "plan", row_id: 1133, created_at: "2026-11-02T10:00:00+00:00", answer: ""};
const ANSWERED = {...OPEN, id: 5, text: "Which database?", state: "answered", answer: "sqlite", row_model: "", row_id: null};
const CLOSED = {...OPEN, id: 6, text: "Ship it?", state: "closed", row_model: "", row_id: null};

async function drawn(rows = [OPEN, ANSWERED, CLOSED], run = async () => ({ok: true, value: null})) {
    const window = questionsWindowContext({"question list": page(rows)});
    window.run = vi.fn(run);
    const element = await mounted(QuestionRows, window);
    document.body.append(element);
    await settle();
    return {element, window};
}

test("test_open_and_done_bars: the window has an Open bar with no count and a Done bar with its count, and an empty Open says None", async () => {
    const {element} = await drawn();
    const bars = [...element.querySelectorAll("[data-question-section] .bar")];
    expect(bars.map((bar) => bar.querySelector(".bar-title").textContent)).toEqual(["Open", "Done"]);
    expect(bars[0].querySelector("[data-question-count]")).toBeNull();
    expect(bars[1].querySelector("[data-question-count]").textContent).toBe("2");
    expect(element.querySelectorAll('[data-question-card][data-state="open"]')).toHaveLength(1);
    expect(element.querySelectorAll('[data-question-card].done')).toHaveLength(2);
    const quiet = await drawn([ANSWERED]);
    expect(quiet.element.querySelector("[data-questions-none]").textContent).toBe("None");
});

test("test_card_chips: a card has its number, the asking agent as a chip, the plan as a link and a clock time last, and the recommended option has a star", async () => {
    const {element} = await drawn();
    const card = element.querySelector('[data-question-card][data-state="open"]');
    const head = [...card.querySelector(".head").children];
    expect(head[0].textContent).toBe("7");
    expect(card.querySelector("[data-question-agent]").textContent).toContain("Agent 4");
    expect(card.querySelector("[data-question-plan]").textContent).toBe("Plan 1133");
    expect(head.at(-1).tagName).toBe("TIME");
    expect(head.at(-1).textContent).toMatch(/^\d{2}:\d{2}$/);
    expect(card.querySelector('[data-question-option="Later"] [data-question-recommended]')).not.toBeNull();
    expect(card.querySelector('[data-question-option="Now"] [data-question-recommended]')).toBeNull();
    expect(card.querySelector("[data-question-context]").textContent).toBe("The tests pass.");
});

test("picking selects, typing clears the pick, and Answer sends what is chosen through question answer", async () => {
    const {element, window} = await drawn([OPEN]);
    const answer = element.querySelector("[data-question-answer]");
    expect(answer.disabled).toBe(true);
    element.querySelector('[data-question-option="Now"]').click();
    await settle();
    expect(element.querySelector('[data-question-option="Now"]').getAttribute("aria-checked")).toBe("true");
    typeInto(element.querySelector("form input"), "Tomorrow");
    await settle();
    expect(element.querySelector('[data-question-option="Now"]').getAttribute("aria-checked")).toBe("false");
    answer.click();
    await settle();
    expect(window.run).toHaveBeenCalledWith(["question", "answer", "7", "--answer", "Tomorrow"]);
    expect(element.querySelector("[data-question-settled]").textContent).toBe("Tomorrow");
});

test("More has Elaborate and Close, and a right click on the card says the same", async () => {
    const {element, window} = await drawn([OPEN]);
    const card = element.querySelector("[data-question-card]");
    expect(itemsOf(card).map((entry) => entry.label)).toEqual(["Open", "Elaborate", "Close"]);
    await itemsOf(card).find((entry) => entry.label === "Close").run({say: () => {}});
    await settle();
    expect(window.run).toHaveBeenCalledWith(["question", "close", "7"]);
    expect(element.querySelector("[data-question-settled]").textContent).toBe("Closed");
});

test("test_chat_question_card_unchanged: the chat's question card still answers with a click on an option and tags the recommended one", async () => {
    const window = questionsWindowContext({});
    window.run = vi.fn(async () => ({ok: true, value: null}));
    const element = await mounted(QuestionCard, window, {row: OPEN});
    document.body.append(element);
    expect(element.querySelector('[data-question-option="Later"]').textContent).toContain("Recommended");
    element.querySelector('[data-question-option="Now"]').click();
    await settle();
    expect(window.run).toHaveBeenCalledWith(["question", "answer", "7", "--answer", "Now"]);
    expect(element.querySelector("[data-question-settled]").textContent).toBe("Answered: Now");
});
