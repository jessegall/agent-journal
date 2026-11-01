import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const read = (path) => readFileSync(resolve(__dirname, path), "utf8");

// task 5476: version 4 docks items at the bottom of the chat, above the composer
test("the chat draws its docked items between the history and the composer", () => {
    const chat = read("../../core/modules/messages/web/src/Chat.vue");
    const history = chat.indexOf('class="history"');
    const docks = chat.indexOf("<DockStack");
    const composer = chat.indexOf('<form class="composer"');
    expect(history).toBeGreaterThan(-1);
    expect(docks).toBeGreaterThan(history);
    expect(composer).toBeGreaterThan(docks);
});

// task 5476: version 4's buttons carry no border unless they are one of the few outlined ones (Open, Dump files)
test("a button has no visible border unless it is asked to be bordered", () => {
    const button = read("../src/kit/Btn.vue");
    expect(button).toMatch(/\.btn \{[^}]*border: 1px solid transparent;/);
    expect(button).toMatch(/\.btn\.bordered \{\s*border-color: var\(--border-2\);/);
});

test("the dock's action buttons and Dump files are the bordered ones", () => {
    expect(read("../src/chat/DockWrapper.vue")).toMatch(/<Btn small bordered :data-dock-action="button\.action"/);
    expect(read("../../core/modules/messages/web/src/Chat.vue")).toMatch(/<Btn small bordered data-dump-files/);
});
