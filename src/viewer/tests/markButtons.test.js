import {afterEach, expect, test, vi} from "vitest";
import {buttonLine, pressButton} from "../src/chat/markButtons.js";

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
    expect(await pressed(button, {id: 12})).toEqual([{window: "messages.chat", line: ["command-output", "stop", "12"], environment: "main"}]);
});

test("a line without a row place is sent as declared", async () => {
    const button = {icon: "x", label: "Open", runs: "window open memories.list"};
    expect(await pressed(button, null)).toEqual([{window: "messages.chat", line: ["window", "open", "memories.list"], environment: "main"}]);
});

test("a typed message stays one word with spaces, quotes, equal signs and leading flags", () => {
    const message = '--skip=all A "quoted" message';
    expect(buttonLine({runs: "task edit {row_id} --brief={message}"}, {id: 12}, {message})).toEqual(["task", "edit", "12", `--brief=${message}`]);
});

test("quoted and escaped declaration arguments keep their boundaries", () => {
    expect(buttonLine({runs: `note edit {row_id} --brief="With spaces" --note=two\\ words --empty=''`}, {id: 12}))
        .toEqual(["note", "edit", "12", "--brief=With spaces", "--note=two words", "--empty="]);
});
