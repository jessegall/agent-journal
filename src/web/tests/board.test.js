import {beforeEach, describe, expect, test, vi} from "vitest";
import {laneTitle, lens, named, visibleLanes} from "../src/board/lanes.js";
import {moveEffect, refused} from "../src/board/moves.js";
import {useBoardShift} from "../src/board/boardShift.js";
import {store} from "../src/state/store.js";

const lane = (key, title, cards = []) => ({key, title, cards});

beforeEach(() => {
    store.board.loaded = true;
    store.board.lens = {plan: 0, agent: "", done: true, board: 0};
    store.board.lanes = [lane("todo", "To do", [{n: 1, title: "Fix the door"}, {n: 2, title: "Paint it"}]), lane("done", "Done", [{n: 3, title: "Hang it"}])];
});

describe("lanes", () => {
    test("a lane key without a stored lane falls back to the key", () => {
        expect([laneTitle("todo"), laneTitle("gone")]).toEqual(["To do", "gone"]);
    });

    test.each([
        ["", 1, true],
        ["  ", 1, true],
        ["door", 1, true],
        ["DOOR", 1, true],
        ["#2", 2, true],
        ["door", 2, false],
    ])("the card filter %j on card %i keeps it: %s", (text, n, kept) => {
        const card = {n, title: n === 1 ? "Fix the door" : "Paint it"};
        expect(named(text)(card)).toBe(kept);
    });

    test("an unloaded board shows five empty lanes", () => {
        store.board.loaded = false;
        expect(visibleLanes(() => "", () => true).map((l) => l.title)).toEqual(["To do", "Held", "Doing", "Needs you", "Done"]);
    });

    test("hiding done drops the done lane and the filter trims cards", () => {
        lens({done: false});
        const meaning = (key) => (key === "done" ? "done" : "");
        expect(visibleLanes(meaning, named("paint")).map((l) => [l.key, l.cards.length])).toEqual([["todo", 1]]);
    });
});

describe("what a move does to a ticket", () => {
    const slots = (running, limit) => ({running: new Array(running).fill(1), limit});
    const ticket = (state = "ready") => ({type: "ticket", state});

    test.each([
        [{type: "todo"}, "start", ""],
        [ticket(), "", ""],
        [ticket(), "review", "waits for you"],
        [ticket(), "done", "closes once its branch is merged"],
        [ticket("draft"), "start", "confirm it first"],
        [ticket(), "start", "starts its agent"],
    ])("%j to %j: %s", (card, meaning, words) => {
        expect(moveEffect(card, meaning, slots(0, 2))).toBe(words);
    });

    test("a full set of agents queues the ticket", () => {
        expect(moveEffect(ticket(), "start", slots(2, 2))).toBe("queues, every agent is busy");
    });

    test("only a draft ticket is refused a start", () => {
        expect([refused(ticket("draft"), "start"), refused(ticket(), "start"), refused({type: "todo", state: "draft"}, "start")]).toEqual([true, false, false]);
    });
});

describe("shifting a card", () => {
    const card = {n: 7, lane: "todo"};
    const make = (send) => {
        const calls = {refuse: vi.fn(), notify: vi.fn(), refresh: vi.fn(async () => {}), move: vi.fn()};
        return {calls, ...useBoardShift({send, ...calls})};
    };

    test("a good move says so, offers an undo and refreshes", async () => {
        const {calls, shift, moving} = make(async () => {});
        await shift(card, "done");
        const note = calls.notify.mock.calls[0][0];
        expect(note.text).toBe("Moved #7 to Done");
        note.action();
        expect(calls.move).toHaveBeenCalledWith({...card, lane: "done"}, "todo");
        expect([calls.refresh.mock.calls.length, moving.value]).toEqual([1, 0]);
    });

    test("a refused move reports the refusal, still refreshes and stops moving", async () => {
        const failure = new Error("no");
        const {calls, shift, moving} = make(async () => Promise.reject(failure));
        await shift(card, "done");
        expect(calls.refuse).toHaveBeenCalledWith(failure);
        expect(calls.notify).not.toHaveBeenCalled();
        expect([calls.refresh.mock.calls.length, moving.value]).toEqual([1, 0]);
    });

    test("the card being moved is marked while the move runs", async () => {
        let during = 0;
        const {shift, moving} = make(async () => (during = moving.value));
        await shift(card, "done");
        expect(during).toBe(7);
    });
});
