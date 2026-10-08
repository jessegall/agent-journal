import {describe, expect, test} from "vitest";
import {obvious, wordsOf} from "../src/kit/tip.js";

const control = (text = "") => Object.assign(document.createElement("button"), {textContent: text});

describe("a control that already says what it does carries no tooltip", () => {
    test("an icon or a cross with a plain close, remove or menu word is left without one", () => {
        for (const words of ["Close", "Close the plan", "Remove", "Hide the preview", "Pane menu", "Dismiss"]) {
            expect([words, obvious(control(), wordsOf(words)), obvious(control("×"), wordsOf(words))]).toEqual([words, true, true]);
        }
    });

    test("a tooltip that explains something stays: a second line, a key, a visible label, or words that are not a plain verb", () => {
        expect(obvious(control(), wordsOf({title: "Pane menu", line: "Detach it, split it, dock it and more."}))).toBe(false);
        expect(obvious(control(), wordsOf({title: "Close", keys: "Esc"}))).toBe(false);
        expect(obvious(control("Close"), wordsOf("Close"))).toBe(false);
        expect([wordsOf("Pause the plan"), wordsOf("Auto is on"), wordsOf("Builder")].map((words) => obvious(control(), words))).toEqual([false, false, false]);
    });
});
