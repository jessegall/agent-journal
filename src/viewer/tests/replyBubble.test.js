import {expect, test} from "vitest";
import {styleDeclarations} from "./support/styleDeclarations.js";

const BUBBLE_WITH_QUOTE = ".message-card:has(.message-quote)";

test("a reply bubble has a minimum width of a fixed length, so a short reply still shows its quote", () => {
    expect(styleDeclarations("kit/MessageCard.vue", BUBBLE_WITH_QUOTE)).toMatch(/min-width:\s*\d+px;/);
});

test("the minimum width is not a percentage, which a bubble sized to its text resolves to nothing", () => {
    expect(styleDeclarations("kit/MessageCard.vue", BUBBLE_WITH_QUOTE)).not.toMatch(/min-width:[^;]*%/);
});
