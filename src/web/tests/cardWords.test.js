import {expect, test} from "vitest";
import {cardTitle, limitNote, messageShown} from "../src/domain/cardTitle.js";

test("a count check's title says the number it compares with, and where it comes from", () => {
    const entry = {title: "Is a count over N?"};
    const node = {text: "reminders messages.hold_after_reminders"};
    expect(cardTitle(entry, node, {number: 5, setting: "Hold the write after"})).toBe("Is the count reminders over 5?");
    expect(limitNote({number: 5, setting: "Hold the write after"})).toBe("5 is the setting Hold the write after");
    expect(limitNote({number: 3, setting: ""})).toBe("");
});

test("a message is shown as far as three lines hold it, cut after a whole word", () => {
    expect(messageShown("short words")).toBe("short words");
    const long = Array.from({length: 40}, (_, i) => `word${i}`).join(" ");
    const shown = messageShown(long);
    expect(shown).toMatch(/ … \d+ more words$/);
    expect(shown.split(" … ")[0].length).toBeLessThanOrEqual(96);
    expect(messageShown("[messages.unread_held] read your messages")).toBe("read your messages");
});
