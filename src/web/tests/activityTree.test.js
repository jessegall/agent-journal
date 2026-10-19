// @vitest-environment node
import {expect, test} from "vitest";
import {ref} from "vue";

const {useActivity} = await import("../src/composables/activity.js");

const NOW = 1_700_000_000;
const at = (seconds) => new Date(seconds * 1000).toISOString();
const nothing = () => null;
const hook = (id, seconds, kind = "ToolStarting") => ({id, kind, created_at: at(seconds), actor: "agent:s1", data: {tool_name: "Read"}});
const change = (id, seconds, kind, data) => ({id, kind, created_at: at(seconds), actor: "user:1", data});
const shown = (entries, find = nothing) => useActivity(ref(entries), find);

test("the agent's hooks within one minute fold into one line, newest first", () => {
    const {items} = shown([hook(1, NOW), hook(2, NOW + 1), hook(3, NOW + 2)]);
    expect(items.value.length).toBe(1);
    expect(items.value[0].fold.entries.map((e) => e.id)).toEqual([3, 2, 1]);
});

test("hooks a minute apart are two lines, and a row's change stands on its own between them", () => {
    const {items} = shown([hook(1, NOW - 120), change(2, NOW - 60, "created", {table: "tasks", id: 4, title: "Ship it"}), hook(3, NOW)]);
    expect(items.value.map((item) => (item.fold ? "fold" : item.entry.id))).toEqual(["fold", 2, "fold"]);
});

test("a row's change is headed by what happened to it, and a closing reads as closed", () => {
    const {heading, title} = shown([]);
    expect(heading(change(1, NOW, "created", {table: "tasks", id: 4}))).toBe("New task");
    expect(heading(change(2, NOW, "updated", {table: "tasks", id: 4, changed: ["finished_at"]}))).toBe("Task closed");
    expect(heading({id: 3, kind: "nudge", data: {line: "carry on"}})).toBe("Agent instruction");
    expect(title(change(1, NOW, "created", {table: "tasks", id: 4, title: "Ship it"}))).toBe("Ship it");
});

test("a change to a table the viewer does not know is left out", () => {
    expect(shown([change(1, NOW, "created", {table: "nothing", id: 1})]).items.value).toEqual([]);
});
