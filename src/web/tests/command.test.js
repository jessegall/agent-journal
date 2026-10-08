import {describe, expect, test} from "vitest";
import {oneLine} from "../src/format/command.js";

describe("a command shown in the viewer", () => {
    test("a short one stays as it is, with the project folder left out of its paths", () => {
        expect(oneLine("npm test")).toBe("npm test");
        expect(oneLine("cat /Users/me/code/Project builds/src/x.py", "Project builds")).toBe("cat src/x.py");
    });

    test("a multi-line one becomes its first word and project path on one line", () => {
        const loop = "python3 /Users/me/app/src/x.py --all\nfor f in a b; do\n  echo $f\ndone";
        expect(oneLine(loop, "app")).toBe("python3 src/x.py");
        expect(oneLine("for f in a b; do\n  echo $f\ndone")).toBe("for");
    });
});
