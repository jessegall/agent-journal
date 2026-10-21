import {expect, test} from "vitest";
import {lift} from "../src/text/code.js";

test("code pasted without fences is one block from its first line: a decorator and a class line above an indented body belong to the block", () => {
    const pasted = "@dataclass(frozen=True)\nclass Timing(Model):\n    method: str = \"\"\n    ms: int = 0";
    const parts = lift(pasted);
    expect(parts.length).toBe(1);
    expect(parts[0].kind).toBe("html");
    expect(parts[0].html).toContain("dataclass");
    expect(parts[0].html).toContain("class");
    expect(parts[0].html.replace(/<[^>]+>/g, "")).toContain("ms: int = 0");
});

test("prose above an indented block stays prose", () => {
    const parts = lift("Here is the shape I mean.\n    one: 1\n    two: 2");
    expect(parts.length).toBe(2);
    expect(parts[0].kind).toBe("text");
    expect(parts[0].text).toBe("Here is the shape I mean.");
    expect(parts[1].kind).toBe("html");
});
