import {expect, test} from "vitest";
import {visibleQueue} from "../src/domain/statusQueue.js";

const item = (time, key, more = {}) => ({time, key, done: true, hold: 0.5, lingers: 10, parts: [], ...more});

test("a line far behind jumps to the first file of the newest command's roll, so every changed file is still shown", () => {
    const queue = [item(1, "ls"), item(2, "cat"), item(3, "grep"), item(4, "c1 edit"), ...["a.py", "b.py", "c.py"].map((path, i) => item(4.001 * (i + 1), `c1 edit ${path}`, {group: "c1 edit"}))];
    const shown = visibleQueue(queue, {time: 1, since: 0}, 10);
    expect(shown.message.key).toBe("c1 edit a.py");
});
