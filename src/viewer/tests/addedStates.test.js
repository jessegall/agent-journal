import {beforeAll, expect, test} from "vitest";
import {movesOf} from "../src/domain/resourceNouns.js";
import {loadStates, stateLabel, stateLook} from "../src/domain/states.js";

beforeAll(() => loadStates(async () => ({ok: true, json: async () => ({states: {plan: {reviewing: {label: "Under review", looks_like: "ready", open_moves: ["cancel"], module: "journal.core.templates"}}}})})));

test("an added state shows its own label and the look of the state it resembles", () => {
    expect(stateLabel("plan", "reviewing")).toBe("Under review");
    expect(stateLook("plan", "reviewing")).toBe("ready");
});

test("an added state keeps only the moves its model leaves open, with their prompts", () => {
    expect(movesOf("plan", {state: "reviewing"}).map((move) => [move.word, move.flag])).toEqual([["cancel", "--reason"]]);
});

test("a word nobody registered shows as itself and has no moves", () => {
    expect(stateLabel("plan", "nowhere")).toBe("Nowhere");
    expect(stateLook("plan", "nowhere")).toBe("nowhere");
    expect(movesOf("plan", {state: "nowhere"})).toEqual([]);
});
