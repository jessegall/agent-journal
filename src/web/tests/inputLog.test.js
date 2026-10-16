import {afterEach, expect, test, vi} from "vitest";
import {logInputs} from "../src/platform/inputLog.js";

afterEach(() => vi.restoreAllMocks());

test("a key, a paste and a write by code to a field each print a line naming the field and the value", () => {
    const seen = vi.spyOn(console, "log").mockImplementation(() => {});
    logInputs(window);
    const box = document.createElement("textarea");
    box.className = "compose-box";
    document.body.appendChild(box);
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "v", metaKey: true, bubbles: true}));
    box.value = "pasted words";
    box.dispatchEvent(new InputEvent("input", {inputType: "insertFromPaste", bubbles: true}));
    box.value = "";
    const lines = seen.mock.calls.map(([line]) => line);
    expect(lines.some((l) => l.startsWith("[input] keydown textarea.compose-box Meta+v"))).toBe(true);
    expect(lines.some((l) => l.startsWith('[input] code set textarea.compose-box from "" to "pasted words"'))).toBe(true);
    expect(lines.some((l) => l.startsWith("[input] input textarea.compose-box insertFromPaste"))).toBe(true);
    expect(lines.some((l) => l.startsWith('[input] code set textarea.compose-box from "pasted words" to ""'))).toBe(true);
});
