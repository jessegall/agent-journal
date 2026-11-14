import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import {foldedHeight, unfoldedHeight} from "./support/foldedHeights.js";
import MessageCard from "../kit/MessageCard.vue";
import {FOLDS, foldOf} from "../src/domain/messageFold.js";

let next = 100;
const base = {type: "agent", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", text: "A reply"};

afterEach(unfoldedHeight);

async function drawn(message, height) {
    foldedHeight(height);
    const element = await mounted(MessageCard, context({}), {message: {...base, id: next++, ...message}});
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await settle();
    return element;
}

const body = (element) => element.querySelector(".folded-body");
const more = (element) => element.querySelector(".fold");

test("the lengths are version 4's: a report folds above 70px and shows 46px, a message folds above 420px and shows 320px", () => {
    expect(FOLDS).toEqual({report: {at: 70, keep: 46}, message: {at: 420, keep: 320}});
});

test("a report is the kind of a message of a worker, and the user's words and the agent's reply are one kind", () => {
    expect([foldOf({type: "agent", worker_id: 9}), foldOf({type: "agent"}), foldOf({type: "user"}), foldOf({type: "comment"})]).toEqual([FOLDS.report, FOLDS.message, FOLDS.message, FOLDS.message]);
});

test("an agent's reply taller than 420px is folded to 320px until Show more opens it", async () => {
    const element = await drawn({}, 421);
    expect(body(element).classList.contains("folded")).toBe(true);
    expect(body(element).style.maxHeight).toBe("320px");
    expect(more(element).textContent).toBe("Show more");
    more(element).click();
    await settle();
    expect(body(element).classList.contains("folded")).toBe(false);
    expect(more(element).textContent).toBe("Show less");
});

test("a user's message is folded at the same height", async () => {
    const element = await drawn({type: "user"}, 421);
    expect(body(element).style.maxHeight).toBe("320px");
    expect(more(element)).not.toBeNull();
});

test("a message no taller than 420px is never folded", async () => {
    const element = await drawn({}, 420);
    expect(body(element).classList.contains("folded")).toBe(false);
    expect(more(element)).toBeNull();
});

test("a report taller than 70px is folded to 46px and one no taller is whole", async () => {
    const tall = await drawn({worker_id: 9}, 71);
    expect(body(tall).style.maxHeight).toBe("46px");
    expect(more(tall).textContent).toBe("Show more");
    const short = await drawn({worker_id: 9}, 70);
    expect(more(short)).toBeNull();
});
