import {afterEach, expect, test, vi} from "vitest";
import {pressButton} from "../src/chat/markButtons.js";

afterEach(() => vi.unstubAllGlobals());

async function pressed(button, mark) {
    const asked = [];
    vi.stubGlobal("fetch", async (url, init) => {
        asked.push(JSON.parse(init.body));
        return {json: async () => ({code: 0, value: null, error: ""})};
    });
    await pressButton(button, mark, "main");
    return asked;
}

test("a button sends its declared line with the mark's row filled in", async () => {
    const button = {icon: "stop", label: "Stop", runs: "command-output stop {row_id}"};
    expect(await pressed(button, {target_id: 12})).toEqual([{window: "messages.chat", line: ["command-output", "stop", "12"], environment: "main"}]);
});

test("a line without a row place is sent as declared", async () => {
    const button = {icon: "x", label: "Open", runs: "window open memories.list"};
    expect(await pressed(button, {target_id: null})).toEqual([{window: "messages.chat", line: ["window", "open", "memories.list"], environment: "main"}]);
});
