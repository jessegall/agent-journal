import {beforeEach, describe, expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";
import {store} from "../src/state/store.js";

const TYPES = {todo: {title: "To-do"}, message: {title: "Message"}, comment: {title: "Comment"}, doc: {title: "Doc"}};

beforeEach(() => {
    store.spec = {types: TYPES, priority: Object.keys(TYPES)};
});

const base = {deleted: 0, completed: 0, refs: [], sections: [], brief: "", title: "", abstract: "", updated: 0};
const message = (n, created, fields = {}) => ({...base, ref: `message:${n}`, type: "message", n, created, seen: ["user"], data: {}, ...fields});
const pending = (id, created, fields = {}) => ({...base, ref: `pending:${id}`, type: "message", n: 0, pending: true, who: "user", created, seen: ["user"], data: {idempotency: id, files: {}}, ...fields});
const comment = (n, created, brief, who = "agent", fields = {}) => ({...base, ref: `comment:${n}`, type: "comment", n, created, seen: [who], brief, refs: ["todo:1"], data: {}, ...fields});
const agent = (data) => ({...base, ref: "agent:1", type: "agent", n: 1, created: 1, seen: ["agent"], data});
const none = {message: [], comment: [], question: [], reaction: [], agent: [], doc: []};
const turns = (rows, pend = [], older = false) => threadTurns({...none, ...rows}, pend, "main", older).turns;
const refs = (list) => list.map((t) => t.ref);

describe("a message just sent", () => {
    test("shows once while only the placeholder exists", () => {
        expect(refs(turns({}, [pending("a", 10)]))).toEqual(["pending:a"]);
    });

    test("is replaced by the real message with the same key, never shown twice", () => {
        const got = threadTurns({...none, message: [message(5, 10, {data: {idempotency: "a"}})]}, [pending("a", 10)], "main");
        expect(refs(got.turns)).toEqual(["message:5"]);
        expect(got.keys.get("message:5")).toBe("pending:a");
    });

    test("without a key it is matched by its words, and not when the message is older than the placeholder", () => {
        const text = {brief: "hello"};
        const near = turns({message: [message(5, 7, text)]}, [pending("a", 10, {...text, data: {files: {}}})]);
        const far = turns({message: [message(5, 1, text)]}, [pending("a", 10, {...text, data: {files: {}}})]);
        expect(refs(near)).toEqual(["message:5"]);
        expect(refs(far).sort()).toEqual(["message:5", "pending:a"]);
    });

    test("stays a placeholder until its files have arrived", () => {
        const waiting = pending("a", 10, {data: {idempotency: "a", files: {"a.txt": 1, "b.txt": 1}}});
        const partly = message(5, 10, {data: {idempotency: "a", files: {"a.txt": 1}}});
        expect(refs(turns({message: [partly]}, [waiting]))).toEqual(["pending:a"]);
        const whole = message(5, 10, {data: {idempotency: "a", files: {"a.txt": 1, "b.txt": 1}}});
        expect(refs(turns({message: [whole]}, [waiting]))).toEqual(["message:5"]);
    });

    test("a deleted or window message is not shown", () => {
        expect(turns({message: [message(1, 1, {deleted: 5}), message(2, 2, {data: {window: true}})]})).toEqual([]);
    });
});

describe("a receipt for filed work", () => {
    const filedMessage = message(7, 10, {completed: 11, updated: 11, refs: ["todo:3"]});

    test("follows a finished message that filed something and got no answer", () => {
        const got = turns({message: [filedMessage]});
        expect(refs(got)).toEqual(["message:7", "receipt:7"]);
        expect(got[1].title).toBe("Filed to-do 3 from your message.");
    });

    test("is left out once the agent reacted or commented on the message", () => {
        const reply = comment(1, 12, "ok", "agent", {refs: ["message:7"]});
        expect(refs(turns({message: [filedMessage], comment: [reply]}))).not.toContain("receipt:7");
    });

    test("is left out when the message only quoted another message", () => {
        expect(refs(turns({message: [message(8, 10, {completed: 11, refs: ["message:2"]})]}))).toEqual(["message:8"]);
    });
});

describe("agent replies", () => {
    test("the same answer twice in two minutes becomes one with both quotes", () => {
        const first = comment(1, 100, "> one\nSure");
        const second = comment(2, 110, "> two\nSure");
        const got = turns({comment: [first, second]});
        expect(got).toHaveLength(1);
        expect(got[0].brief).toBe("> one\n>\n> two\n\nSure");
    });

    test("different answers, or the same one long apart, stay apart", () => {
        expect(turns({comment: [comment(1, 100, "Sure"), comment(2, 110, "Nope")]})).toHaveLength(2);
        expect(turns({comment: [comment(1, 100, "Sure"), comment(2, 400, "Sure")]})).toHaveLength(2);
    });

    test("a comment on nothing known is not shown, and a visitor's comment becomes a card", () => {
        const loose = comment(3, 5, "lost", "agent", {refs: ["nothing:1"]});
        const visitor = comment(4, 6, "hi", "user", {data: {visitor: "Ann"}});
        const got = turns({comment: [loose, visitor]});
        expect(got.map((t) => [t.type, t.title])).toEqual([["card", "Ann commented on todo 1"]]);
    });
});

describe("folding runs", () => {
    const loads = (n) => agent({skill_loads: Array.from({length: n}, (_, i) => ({at: 10 + i, skill: `s${i}`}))});

    test("three skill loads stay single, four fold into one group", () => {
        expect(turns({agent: [loads(3)]})).toHaveLength(3);
        const folded = turns({agent: [loads(4)]});
        expect(folded).toHaveLength(1);
        expect(folded[0]).toMatchObject({type: "group", title: "4 skills loaded"});
        expect(folded[0].turns).toHaveLength(4);
    });

    test("a different turn in the middle ends the run", () => {
        const got = turns({agent: [loads(4)], comment: [comment(1, 11.5, "hm", "user")]});
        expect(got.map((t) => t.type)).toEqual(["skill", "skill", "comment", "skill", "skill"]);
    });

    test("a subagent's own rows are not part of the session's thread", () => {
        const sub = agent({parent: 9, skill_loads: [{at: 5, skill: "x"}]});
        expect(turns({agent: [sub]})).toEqual([]);
    });
});

describe("older turns", () => {
    test("when paging back, nothing older than the oldest message loaded is shown", () => {
        const got = turns({message: [message(1, 50), message(2, 60)], agent: [agent({thoughts: [{at: 10, text: "old"}, {at: 55, text: "new"}]})]}, [], true);
        expect(got.map((t) => t.title || t.ref)).toEqual(["message:1", "new", "message:2"]);
    });
});
