// @vitest-environment node
import {expect, test} from "vitest";
import {closeQuestion, openQuestion, questionView} from "../src/state/overlays.js";

test("opening a question names who opened it, and closing clears it", () => {
    const owner = {name: "chat"};
    openQuestion(5, owner);
    expect([questionView.id, questionView.owner]).toEqual([5, owner]);
    closeQuestion();
    expect([questionView.id, questionView.owner]).toEqual([0, null]);
});
