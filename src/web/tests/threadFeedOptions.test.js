import {expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {ui} from "../src/state/ui.js";

test("the chat's file edits pane keeps the view options the user picks, so lines and collapse apply there too", () => {
    const thread = readFileSync(resolve(__dirname, "../src/chat/Thread.vue"), "utf8");
    expect(thread).toMatch(/<FileFeed[^>]*:options="ui\.threadFeed"[^>]*@options="ui\.threadFeed = \$event"/);
    expect("threadFeed" in ui).toBe(true);
});

test("the status line above the compose box never goes: when the agent is not working it reads idle or waiting in its place", () => {
    const thread = readFileSync(resolve(__dirname, "../src/chat/Thread.vue"), "utf8");
    expect(thread).toMatch(/<div v-if="busy && !waitingNow" class="thread-turn busy"/);
    expect(thread).toMatch(/<div v-else class="thread-turn busy"[^>]*>[\s\S]*?\{\{ waitingNow \? "waiting" : "idle" \}\}/);
    expect(thread).not.toMatch(/<Transition name="status">/);
});
