import {expect, test} from "vitest";
import {AllowancePrompts, promptText, windowPermissions} from "../src/windows/allowancePrompts.js";

const access = {window: "notes.board", reads_allowed: "task list", reads_missing: "plan list", runs_allowed: "", runs_missing: "task start", component_trusted: false};

test("the prompt names the window and the lines it wants, reads and runs asked apart", () => {
    expect(promptText({title: "Notes board", type: "reads", lines: ["plan list"]})).toBe("Notes board wants to read: plan list. Allow?");
    expect(promptText({title: "Notes board", type: "runs", lines: ["task start"]})).toBe("Notes board wants to run: task start. Allow?");
});

test("a window's permissions say what it was allowed and which lines are still missing", () => {
    const permissions = windowPermissions(access, async () => true);
    expect(permissions.reads).toEqual(["task list"]);
    expect(permissions.missing).toEqual(["plan list", "task start"]);
});

test("ask shows the missing reads, then the missing runs, and allows each type the person agrees to", async () => {
    const lines = [];
    const prompts = new AllowancePrompts(async (line) => {
        lines.push(line);
        return {ok: true, value: null};
    });
    const asked = prompts.ask("Notes board", access);
    expect(prompts.current.value.type).toBe("reads");
    prompts.answer(true);
    await new Promise((resolve) => setTimeout(resolve));
    expect(prompts.current.value.type).toBe("runs");
    prompts.answer(true);
    expect(await asked).toBe(true);
    expect(lines).toEqual(["window allow notes.board --type reads", "window allow notes.board --type runs"]);
});

test("ask stops at the first type the person declines and allows nothing more", async () => {
    const lines = [];
    const prompts = new AllowancePrompts(async (line) => lines.push(line));
    const asked = prompts.ask("Notes board", access);
    prompts.answer(false);
    expect(await asked).toBe(false);
    expect(lines).toEqual([]);
    expect(prompts.current.value).toBe(null);
});
