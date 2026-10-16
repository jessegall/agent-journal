import {expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {ui} from "../src/state/ui.js";

test("the chat's file edits pane keeps the view options the user picks, so lines and collapse apply there too", () => {
    const thread = readFileSync(resolve(__dirname, "../src/chat/Thread.vue"), "utf8");
    expect(thread).toMatch(/<FileFeed[^>]*:options="ui\.threadFeed"[^>]*@options="ui\.threadFeed = \$event"/);
    expect("threadFeed" in ui).toBe(true);
});
