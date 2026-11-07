import {afterEach, expect, test, vi} from "vitest";
import {pressButton} from "../src/chat/markButtons.js";

afterEach(() => vi.unstubAllGlobals());

async function pressed(button, mark, values = {}) {
    const asked = [];
    vi.stubGlobal("fetch", async (url, init) => {
        const {attribution, ...line} = JSON.parse(init.body);
        asked.push(line);
        return {json: async () => ({code: 0, value: null, error: ""})};
    });
    await pressButton(button, mark, "main", values);
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

test("a typed message stays one word with spaces, quotes, equal signs and leading flags", async () => {
    const message = '--skip=all A "quoted" message';
    expect(await pressed({runs: "task edit {row_id} --brief={message}"}, {id: 12}, {message})).toEqual([{window: "messages.chat", line: ["task", "edit", "12", `--brief=${message}`], environment: "main"}]);
});

test("quoted and escaped declaration arguments keep their boundaries", async () => {
    expect(await pressed({runs: `note edit {row_id} --brief="With spaces" --note=two\\ words --empty=''`}, {id: 12}))
        .toEqual([{window: "messages.chat", line: ["note", "edit", "12", "--brief=With spaces", "--note=two words", "--empty="], environment: "main"}]);
});
