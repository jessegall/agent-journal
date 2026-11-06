import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, settle} from "./support/windowContext.js";
import HelperStartForm from "../../core/modules/profiles/web/src/HelperStartForm.vue";
import {profileWindowContext} from "./support/profileWindowContext.js";

const IDLE = {can_start: false, reason: 'helper 42 is idle: journal helper send 42 "<job>"', programs: ["claude", "codex"], idle_helpers: [{id: 42, name: "Lady Lovelace"}], can_start_fresh: true, fresh_reason: ""};
let app, host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

async function drawn(state = IDLE, run = async () => ({ok: true})) {
    const window = {...profileWindowContext({}), read: vi.fn(async () => ({ok: true, value: state})), run: vi.fn(run)};
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(HelperStartForm, {profile: "journal-researcher"})});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(host);
    await settle();
    return window;
}

async function type(selector, value) {
    const field = host.querySelector(selector);
    field.value = value;
    field.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
}

test("the helper form offers Send for the selected profile despite the idle-start refusal", async () => {
    const window = await drawn();
    expect(window.read).toHaveBeenCalledWith("helper availability --profile journal-researcher");
    expect(host.textContent).toContain("Lady Lovelace · Idle");
    await type("[data-helper-brief]", "Read src/cart.py");
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(true);
    host.querySelector('[data-helper-send="42"]').click();
    await settle();
    expect(window.run).toHaveBeenCalledExactlyOnceWith(["helper", "send", "42", "Read src/cart.py"]);
    expect(host.querySelector("[data-helper-brief]").value).toBe("");
    expect(host.textContent).toContain("Job sent.");
});

test("the helper form starts another helper only with the reason and selected program", async () => {
    const window = await drawn();
    await type("[data-helper-brief]", "Review the database");
    await type("[data-helper-fresh-reason]", "   ");
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(true);
    await type("[data-helper-fresh-reason]", "An independent comparison");
    const program = host.querySelector("[data-helper-program]");
    program.value = "codex";
    program.dispatchEvent(new Event("change", {bubbles: true}));
    await settle();
    expect(window.read).toHaveBeenLastCalledWith("helper availability --profile journal-researcher --program codex");
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(false);
    host.querySelector("form").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(window.run).toHaveBeenCalledExactlyOnceWith(["helper", "start", "journal-researcher", "--brief", "Review the database", "--program", "codex", "--fresh", "An independent comparison"]);
});

test("the helper form keeps a new start blocked by the server limit while offering Send", async () => {
    const window = await drawn({...IDLE, can_start_fresh: false, fresh_reason: "1 of journal-researcher are kept"});
    await type("[data-helper-brief]", "Read the tests");
    await type("[data-helper-fresh-reason]", "Another reader");
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(true);
    expect(host.querySelector("[data-helper-send]").disabled).toBe(false);
    expect(host.querySelector("[data-helper-fresh-blocked]").textContent).toContain("1 of journal-researcher are kept");
    host.querySelector("form").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(window.run).not.toHaveBeenCalled();
});

test("the helper form preserves the job and displays the command refusal", async () => {
    await drawn(IDLE, async () => ({ok: false, error: "The helper is busy now."}));
    await type("[data-helper-brief]", "Read the tests");
    host.querySelector("[data-helper-send]").click();
    await settle();
    expect(host.textContent).toContain("The helper is busy now.");
    expect(host.querySelector("[data-helper-brief]").value).toBe("Read the tests");
    expect(host.querySelector("[data-helper-send]").disabled).toBe(false);
});

test("the helper form blocks both actions while the command is pending", async () => {
    let finish;
    const window = await drawn(IDLE, () => new Promise(resolve => { finish = resolve; }));
    await type("[data-helper-brief]", "Read the tests");
    await type("[data-helper-fresh-reason]", "A second reader");
    host.querySelector("[data-helper-send]").click();
    await settle();
    expect(host.querySelector("[data-helper-send]").disabled).toBe(true);
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(true);
    host.querySelector("form").dispatchEvent(new Event("submit", {cancelable: true}));
    expect(window.run).toHaveBeenCalledTimes(1);
    finish({ok: true});
    await settle();
});

test("the helper form removes stale actions when availability cannot be read", async () => {
    const window = await drawn();
    await type("[data-helper-brief]", "Read the tests");
    window.read.mockResolvedValue({ok: false, error: "Availability could not be read."});
    const program = host.querySelector("[data-helper-program]");
    program.value = "codex";
    program.dispatchEvent(new Event("change", {bubbles: true}));
    await settle();
    expect(host.querySelector("[data-helper-send]")).toBeNull();
    expect(host.querySelector("[data-helper-start-button]").disabled).toBe(true);
    expect(host.textContent).toContain("Availability could not be read.");
});
