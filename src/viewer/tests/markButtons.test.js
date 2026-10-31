import {expect, test} from "vitest";
import {buttonLine} from "../src/chat/markButtons.js";

test("a button sends its declared line with the mark's row filled in", () => {
    const button = {icon: "stop", label: "Stop", runs: "command-output stop {row_id}"};
    expect(buttonLine(button, {target_id: 12})).toBe("command-output stop 12");
});

test("a line without a row place is sent as declared", () => {
    expect(buttonLine({icon: "x", label: "Open", runs: "window open memories.list"}, {target_id: null})).toBe("window open memories.list");
});
