import {describe, expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const message = (id, seconds, fields = {}) => ({table: "messages", id, created_at: at(seconds), author: "user", text: "", files: [], data: {}, comments_on: [], idempotency: "", ...fields});
const pending = (key, seconds, fields = {}) => ({table: "messages", id: 0, key: `pending:${key}`, pending: true, created_at: at(seconds), author: "user", text: "", files: [], idempotency: key, ...fields});
const card = (id, seconds, data, text = "") => message(id, seconds, {author: "system", text, data});
const turns = (messages, pend = [], older = false) => threadTurns(messages, pend, older).turns;
const keys = (list) => list.map((t) => t.key);

describe("a message just sent", () => {
    test("shows once while only the placeholder exists", () => {
        expect(keys(turns([], [pending("a", 10)]))).toEqual(["pending:a"]);
    });

    test("is replaced by the real message with the same key, never shown twice", () => {
        const got = threadTurns([message(5, 10, {idempotency: "a"})], [pending("a", 10)]);
        expect(keys(got.turns)).toEqual(["messages:5"]);
        expect(got.keys.get("messages:5")).toBe("pending:a");
    });

    test("without a key it is matched by its words, and not when the message is older than the placeholder", () => {
        const words = {text: "hello", idempotency: ""};
        const near = turns([message(5, 7, words)], [pending("a", 10, words)]);
        const far = turns([message(5, 1, words)], [pending("a", 10, words)]);
        expect(near.map((t) => t.id)).toEqual([5]);
        expect(far.map((t) => t.id).sort()).toEqual([0, 5]);
    });

    test("stays a placeholder until its files have arrived", () => {
        const waiting = pending("a", 10, {files: ["a.txt", "b.txt"]});
        expect(turns([message(5, 10, {idempotency: "a", files: ["a.txt"]})], [waiting]).map((t) => t.id)).toEqual([0]);
        expect(turns([message(5, 10, {idempotency: "a", files: ["a.txt", "b.txt"]})], [waiting]).map((t) => t.id)).toEqual([5]);
    });
});

describe("who said it", () => {
    test("the user's and the agent's words are messages, a thought is a thought, and a message under a row is a comment", () => {
        const got = turns([message(1, 1), message(2, 2, {author: "agent"}), message(3, 3, {author: "agent", data: {kind: "thought"}}), message(4, 4, {comments_on: ["tasks:1"]})]);
        expect(got.map((t) => [t.kind, t.who])).toEqual([
            ["message", "user"],
            ["message", "agent"],
            ["thought", "agent"],
            ["comment", "user"],
        ]);
    });
});

describe("the journal's cards", () => {
    test("a card draws its icon, tone and the row it opens, and a visitor's comment is one", () => {
        const visitor = card(4, 6, {kind: "card", icon: "chat", tone: "", detail: "hi", row: "docs:1", visitor: "Ann"}, "Ann commented on docs:1 through a shared link");
        const [got] = turns([visitor]);
        expect([got.kind, got.data.icon, got.data.row, got.data.visitor, got.data.label]).toEqual(["card", "chat", "docs:1", "Ann", "Ann commented on docs:1 through a shared link"]);
    });

    test("a question card carries its options and its answer", () => {
        const [got] = turns([card(2, 2, {kind: "question", row: "questions:7", options: ["a", "b"], answer: "b"}, "Which?")]);
        expect(got.kind).toBe("question");
        expect(got.question).toMatchObject({id: 7, options: ["a", "b"], answer: "b"});
    });

    test("a compaction is its own turn", () => {
        expect(turns([card(1, 5, {kind: "compacted"})])[0].kind).toBe("compacted");
    });
});

describe("folding runs", () => {
    const loads = (n) => Array.from({length: n}, (_, i) => card(i + 1, 10 + i, {kind: "skill", detail: `s${i}`}));

    test("three skill loads stay single, four fold into one group", () => {
        expect(turns(loads(3))).toHaveLength(3);
        const folded = turns(loads(4));
        expect(folded).toHaveLength(1);
        expect(folded[0]).toMatchObject({kind: "group", title: "4 skills loaded"});
        expect(folded[0].turns).toHaveLength(4);
    });

    test("a group of the same card counts the settled ones", () => {
        const sin = (i, settled) => card(i + 1, 10 + i, {kind: "card", icon: "warn", tone: settled ? "good" : "warn"}, "Sin found");
        const cards = [sin(0, "fixed"), sin(1, "fixed"), sin(2), sin(3), sin(4)];
        const folded = turns(cards);
        expect(folded[0]).toMatchObject({kind: "group", title: "5 × Sin found"});
    });

    test("a different turn in the middle ends the run", () => {
        const got = turns([...loads(2), message(9, 11.5, {text: "hm"}), ...loads(4).slice(2).map((m) => ({...m, id: m.id + 20}))]);
        expect(got.map((t) => t.kind)).toEqual(["skill", "skill", "message", "skill", "skill"]);
    });
});

describe("older turns", () => {
    test("when paging back, no card older than the oldest message loaded is shown", () => {
        const got = turns([message(1, 50), message(2, 60), card(3, 10, {kind: "skill", detail: "old"}), card(4, 55, {kind: "skill", detail: "new"})], [], true);
        expect(got.map((t) => t.id)).toEqual([1, 4, 2]);
    });
});

describe("a message from another session", () => {
    test("is a message bubble naming the session that sent it, with its words", () => {
        const [turn] = turns([card(7, 10, {kind: "peer", peer: "Coco"}, "the report is ready")]);
        expect(turn.kind).toBe("message");
        expect(turn.data.peer).toBe("Coco");
        expect(turn.text).toBe("the report is ready");
    });
});

describe("a reminder whispered to the agent", () => {
    test("is a mark with its words, never an empty one", () => {
        const [turn] = turns([card(9, 10, {kind: "whisper", icon: "rules", row: "facts:2"}, "Reminded the agent about fact 2")]);
        expect(turn.kind).toBe("whisper");
        expect(turn.title).toBe("Reminded the agent about fact 2");
    });
});
