import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";
import {FOLDS, foldKind, foldOf} from "../src/domain/messageFold.js";

const base = {id: 4, type: "agent", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};
const words = (count) => "word ".repeat(count).trim();
const drawn = (message) => mounted(MessageCard, context({}), {message: {...base, ...message}});

test("an agent's reply past its length is folded to its shown lines until Show more opens it", async () => {
    const element = await drawn({text: words(FOLDS.agent.chars)});
    const text = element.querySelector("[data-message-text]");
    expect(text.classList.contains("message-folded")).toBe(true);
    expect(text.style.getPropertyValue("--fold-lines")).toBe(String(FOLDS.agent.shown));
    expect(element.querySelector("[data-message-more]").textContent).toBe("Show more");
    element.querySelector("[data-message-more]").click();
    await settle();
    expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(false);
    expect(element.querySelector("[data-message-more]").textContent).toBe("Show less");
});

test("a short message of any kind is never folded", async () => {
    for (const message of [{type: "user", text: "Ship it"}, {type: "agent", text: "Done"}, {type: "agent", worker_id: 3, text: "Merged"}]) {
        const element = await drawn(message);
        expect(element.querySelector("[data-message-more]")).toBeNull();
        expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(false);
    }
});

test("each kind of message folds at its own length, by characters and by lines", () => {
    const person = {type: "user"};
    const agent = {type: "agent"};
    const report = {type: "agent", worker_id: 9};
    expect([foldKind(person), foldKind({type: "comment"}), foldKind(agent), foldKind(report)]).toEqual(["person", "person", "agent", "report"]);
    for (const [message, kind] of [[person, "person"], [agent, "agent"], [report, "report"]]) {
        const fold = FOLDS[kind];
        expect(foldOf({...message, text: "x".repeat(fold.chars)}).long).toBe(false);
        expect(foldOf({...message, text: "x".repeat(fold.chars + 1)}).long).toBe(true);
        expect(foldOf({...message, text: Array(fold.lines).fill("a").join("\n")}).long).toBe(false);
        expect(foldOf({...message, text: Array(fold.lines + 1).fill("a").join("\n")}).long).toBe(true);
    }
});

test("a person's message folds too, at the length of a person's message", async () => {
    const element = await drawn({type: "user", text: "x ".repeat(FOLDS.person.chars)});
    expect(element.querySelector("[data-message-more]")).not.toBeNull();
    expect(element.querySelector("[data-message-text]").style.getPropertyValue("--fold-lines")).toBe(String(FOLDS.person.shown));
});
