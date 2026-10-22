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
    expect(thread).toMatch(/<template v-if="busy && !waitingNow">\s*<div class="thread-turn busy"/);
    expect(thread).toMatch(/<template v-else>\s*<div class="thread-turn busy"[^>]*>[\s\S]*?\{\{ waitingNow \? "waiting" : "idle" \}\}/);
    expect(thread).not.toMatch(/<Transition name="status">/);
});

test("a suggestion's description reaches its card whole, however long", async () => {
    const {threadTurns} = await import("../src/domain/thread.js");
    const long =
        "This project installs Code Commandments v4.324.1 as a package, and the package runs its own hooks beside the journal's, so the same sins are raised twice and the chat fills up.";
    const {
        turns: [turn],
    } = threadTurns(
        [
            {
                id: 1,
                author: "system",
                text: "Run it as a journal plugin instead?",
                created_at: "2026-10-22T19:00:00Z",
                data: {kind: "suggestion", row: "suggestions:3", description: long, detail: "", accept: "Switch"},
            },
        ],
        []
    );
    expect(turn.suggestion.detail).toBe(long);
});
