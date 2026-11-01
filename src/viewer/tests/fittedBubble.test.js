import {expect, test} from "vitest";
import {fittedWidth} from "../src/chat/fittedBubble.js";

test("a bubble is as wide as its longest line and its padding", () => {
    expect(fittedWidth([{left: 12, right: 200}, {left: 12, right: 212.4}, {left: 12, right: 150}], 26)).toBe(227);
});

test("a bubble with nothing measured keeps its width", () => {
    expect(fittedWidth([], 26)).toBe(0);
});
