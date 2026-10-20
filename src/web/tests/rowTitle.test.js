import {expect, test} from "vitest";
import {TITLE_CHARACTERS, titleOf} from "../src/domain/row.js";

test("a message is titled by its first line, cut after a whole word when it is long", () => {
    const long = "The review found four real faults and one smaller point, each fixed on the branch before the pull request went up";
    const title = titleOf({table: "messages", text: `\n${long}\n\nThe rest of the message.`});
    expect(title.endsWith("…")).toBe(true);
    expect(title.length).toBeLessThanOrEqual(TITLE_CHARACTERS + 1);
    expect(long.startsWith(title.slice(0, -1))).toBe(true);
    expect(long[title.length - 1]).toBe(" ");
    expect(titleOf({table: "messages", text: "Short and whole.\nMore below."})).toBe("Short and whole.");
});
