import {expect, test} from "vitest";
import {relativeText} from "../src/format/relativeText.js";

test("a line keeps all its words, with the project folder left out of its paths", () => {
    expect(relativeText("cat /Users/me/code/Project builds/src/x.py", "Project builds")).toBe("cat src/x.py");
    const reason = "The user said stop and change nothing (messages 19792, 19793, 19796); every remaining task waits on the user's decisions";
    expect(relativeText(reason, "app")).toBe(reason);
});
