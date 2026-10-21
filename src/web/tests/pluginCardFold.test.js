import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const card = (id, data, text) => ({table: "messages", id, created_at: at(id), author: "system", created_by: "plugin:code-commandments", text, files: [], data, comments_on: [], idempotency: "", reply_to: null});

test("a plugin's collapsed card keeps its findings in its detail and is marked collapsed, so a click can open it", () => {
    const folded = card(1, {kind: "plugin", plugin: "code-commandments", card: "sin-found", icon: "warn", tone: "warn", detail: "poetic-variable-name at a.py:1\nsentence-variable-name at a.py:2", collapsed: true}, "2 sins in a.py");
    const open = card(2, {kind: "plugin", plugin: "code-commandments", card: "file-repented", icon: "check", tone: "good", detail: "a.py is clean", collapsed: false}, "a.py repented");
    const [first, second] = threadTurns([folded, open], []).turns;
    expect(first.kind).toBe("card");
    expect(first.data.detail).toContain("poetic-variable-name at a.py:1");
    expect(first.data.collapsed).toBe(true);
    expect(second.data.collapsed).toBe(false);
    expect(second.data.detail).toBe("a.py is clean");
});
