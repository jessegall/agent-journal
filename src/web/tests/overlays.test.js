// @vitest-environment node
import {expect, test} from "vitest";
import {closeQuestion, closeUpdate, openQuestion, openUpdate, questionView, updateView} from "../src/state/overlays.js";

test("opening a question or an update names who opened it, and closing clears both", () => {
    const owner = {name: "chat"};
    openQuestion(5, owner);
    expect([questionView.n, questionView.owner]).toEqual([5, owner]);
    closeQuestion();
    expect([questionView.n, questionView.owner]).toEqual([0, null]);
});

test("the question and update overlays are separate", () => {
    openQuestion(1, {});
    openUpdate(2, {});
    closeQuestion();
    expect([questionView.n, updateView.n]).toEqual([0, 2]);
    closeUpdate();
    expect(updateView.n).toBe(0);
});
