import {settle} from "./support/delayedWindowContext.js";
import {afterEach, expect, test} from "vitest";
import {context, mounted} from "./support/windowContext.js";

const KEYS = {hooks: {line: "managed-hook list", events: ["managed-hook.*"]}};
import ProjectHooks from "../../core/modules/settings/web/src/ProjectHooks.vue";

const hook = (id, fields = {}) => ({
    id,
    program: "claude",
    event: "PreToolUse",
    matcher: "Bash",
    command: `check-${id}`,
    source: ".claude/settings.json",
    tracked: true,
    state: "on",
    timeout: 30,
    effects: ["can_refuse", "can_rewrite"],
    ...fields,
});
const history = {
    runs: 2,
    refused: 1,
    rewritten: 0,
    timed_out: 0,
    failed: 0,
    last: {exit_code: 2, milliseconds: 4, timed_out: false, stdout: "", stderr: "unsafe"},
    last_at: "2026-11-03T12:00:00Z",
    last_outcome: "refused",
};
const DATA = {
    managed: [
        {hook: hook("first"), history},
        {hook: hook("second", {program: "codex", state: "off"}), history},
    ],
    pending: [hook("pending", {command: "pending-check"})],
    unmanaged: [
        {
            program: "claude",
            source: "/home/person/.claude/settings.json",
            event: null,
            reason: "User-level files are listed without changes.",
        },
    ],
    fallback: true,
};

afterEach(() => document.body.replaceChildren());

async function drawn({data = DATA, answer = {ok: true, value: {}}, face = "person"} = {}) {
    const ran = [];
    const window = context({"managed-hook list": {ok: true, value: structuredClone(data)}}, null, KEYS);
    window.face = face;
    window.run = async (words) => {
        ran.push(words);
        return answer;
    };
    return {element: await mounted(ProjectHooks, window), ran, window};
}

test("managed entries keep list order and show controls, effects and recent outcomes", async () => {
    const {element} = await drawn();
    expect([...element.querySelectorAll("[data-managed-hook]")].map((row) => row.dataset.managedHook)).toEqual(["first", "second"]);
    const row = element.querySelector('[data-managed-hook="first"]');
    for (const text of [
        "claude",
        "PreToolUse",
        "Bash",
        "check-first",
        ".claude/settings.json",
        "Tracked by Git",
        "Can refuse",
        "Can rewrite",
        "Refused",
        "Ended with code 2 after 4 ms",
        "Refusals: 1",
    ]) {
        expect(row.textContent).toContain(text);
    }
    expect(row.textContent).not.toContain("2026-11-03T12:00:00Z");
    expect(row.querySelector('input[type="number"]').value).toBe("30");
    expect(row.querySelectorAll("input")).toHaveLength(1);
    expect(element.textContent).toContain("pending-check");
    expect(element.textContent).toContain("User-level files are listed without changes.");
    expect(element.querySelector("[data-shell-fallback]").textContent).toContain("shell runner");
});

test("switching state calls the set command with the current time limit", async () => {
    const {element, ran} = await drawn();
    element.querySelector('[data-managed-hook="first"] [role="switch"]').click();
    await settle();
    expect(ran).toEqual([["managed-hook", "set", "first", "off", "30"]]);
});

test.each(["on", "off"])("a managed switch changes before the answer and returns on refusal, state=%s", async (state) => {
    let reply;
    const pending = new Promise((resolve) => (reply = resolve));
    const data = structuredClone(DATA);
    data.managed[0].hook.state = state;
    const {element, ran} = await drawn({data, answer: pending});
    const row = element.querySelector('[data-managed-hook="first"]');
    const control = row.querySelector('[role="switch"]');
    control.click();
    await settle();
    expect(control.getAttribute("aria-checked")).toBe(String(state !== "on"));
    reply({ok: false, error: "Command change refused"});
    await settle();
    expect(control.getAttribute("aria-checked")).toBe(String(state === "on"));
    expect(row.querySelector('[role="alert"]').textContent).toBe("Command change refused");
    expect(ran).toEqual([["managed-hook", "set", "first", state === "on" ? "off" : "on", "30"]]);
});

test("changing a time limit calls set and shows a refusal beside the entry", async () => {
    const {element, ran} = await drawn({answer: {ok: false, error: "Time limit refused"}});
    const row = element.querySelector('[data-managed-hook="first"]');
    const field = row.querySelector('input[type="number"]');
    field.value = "17";
    field.dispatchEvent(new Event("change"));
    await settle();
    expect(ran).toEqual([["managed-hook", "set", "first", "on", "17"]]);
    expect(row.textContent).toContain("Time limit refused");
});

test("giving every entry back asks for confirmation and can be cancelled", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-hooks-give-back]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-hooks-cancel]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-hooks-give-back]").click();
    await settle();
    element.querySelector("[data-hooks-confirm]").click();
    await settle();
    expect(ran).toEqual([["managed-hook", "give-back"]]);
    expect(element.textContent).toContain("off until the next scan");
});

test("scan runs the command and phone controls stay disabled", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-hooks-scan]").click();
    await settle();
    expect(ran).toEqual([["managed-hook", "scan"]]);
    const phone = await drawn({face: "phone"});
    expect([...phone.element.querySelectorAll("button, input")].every((field) => field.disabled)).toBe(true);
    expect(phone.ran).toEqual([]);
});
