import {createApp, h} from "vue";
import {expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));
vi.mock("../src/domain/markRegistry.js", async (importOriginal) => ({
    ...(await importOriginal()),
    markDeclaration: (type) => (type === "questions.question" ? {card: true} : {group: "agent", family_icon: "question", mark_icon: "question"}),
}));

function drawn(mark) {
    const element = document.createElement("div");
    createApp({render: () => h(MarkHost, {mark: {id: 1, text: "Question 1 answered", state: "shown", created_at: "2026-11-02T10:00:00Z", ...mark}})}).mount(element);
    return element;
}

test("an answered or closed question stays a card in its place", () => {
    for (const variant of ["open", "user", "agent", "closed"]) {
        expect(drawn({type: "questions.question", variant, state: variant === "open" ? "shown" : "ended"}).querySelector(".whole-card")).not.toBeNull();
    }
});

test("the card of a question the user answered sits on the user's side, and one the agent answered or one still open does not", () => {
    expect(drawn({type: "questions.question", variant: "user", state: "ended"}).querySelector(".whole-card.user-side")).not.toBeNull();
    for (const variant of ["agent", "open", "closed"]) {
        expect(drawn({type: "questions.question", variant, state: "ended"}).querySelector(".user-side")).toBeNull();
    }
});

test("the mark of an answer sits on the side of whoever answered", () => {
    expect(drawn({type: "questions.answer", variant: "user"}).querySelector(".user-side")).not.toBeNull();
    expect(drawn({type: "questions.answer", variant: "agent"}).querySelector(".user-side")).toBeNull();
});

test("the mark of an answer names the question and the answer given, on the user's side, as one mark", () => {
    const element = drawn({type: "questions.answer", variant: "user", text: "Question 23 answered: Monday"});
    expect(element.textContent).toContain("Question 23 answered: Monday");
    expect(element.querySelectorAll("[data-ref^='chat_mark:']")).toHaveLength(1);
    expect(element.querySelector(".user-side")).not.toBeNull();
});

test("the answer to a question is a bubble on the user's side", () => {
    const element = drawn({type: "questions.answer", variant: "user", state: "shown", text: "Question 1 answered: Yes"});
    expect(element.querySelector(".answer-bubble.user-side")).not.toBeNull();
});

