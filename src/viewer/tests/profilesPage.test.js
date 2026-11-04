import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import ProfileRows from "../../core/modules/profiles/web/src/ProfileRows.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const RESEARCHER = {name: "journal-researcher", description: "Researches a question and reports what it found", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "You research.", shipped: true, uses: 3, last_used: Date.now() / 1000 - 600};
const BUILDER = {name: "builder", description: "Writes a bounded change", tools: "Read, Edit, Bash", profile_type: "worker", model: "", codex_model: "gpt-6-luna", body: "You build.", shipped: false, uses: 0, last_used: 0};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
    document.body.innerHTML = "";
});

// the page drawn in the document, over a journal that lists these profiles and answers each line it runs as the given function says
async function drawn(profiles = [RESEARCHER, BUILDER], run = async () => ({ok: true, value: null})) {
    const lines = [];
    const window_ = {...context({"profile list": page(profiles)}), run: async (line) => (lines.push(line), run(line))};
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ProfileRows)});
    app.provide(WINDOW_CONTEXT, window_);
    app.mount(host);
    await settle();
    return lines;
}

const open = async (name) => {
    host.querySelector(`[data-profile="${name}"]`).click();
    await settle();
};
const panel = () => document.querySelector("[data-profile-panel]");
const type = async (element, text) => {
    element.value = text;
    element.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
};

test("the page lists each profile with its description, kind, models and use, under a bar with the find box, New profile and the count", async () => {
    await drawn();
    expect(host.querySelector("[data-profile-count]").textContent).toBe("2 profiles in .claude/agents");
    const first = host.querySelector('[data-profile="journal-researcher"]').textContent.replace(/\s+/g, " ");
    expect(first).toContain("journal-researcher");
    expect(first).toContain("Researches a question and reports what it found");
    expect(first).toContain("subagent · sonnet on Claude · gpt-6.1-sol on Codex");
    expect(first).toContain("Dispatched 3 times, last");
    const second = host.querySelector('[data-profile="builder"]').textContent.replace(/\s+/g, " ");
    expect(second).toContain("worker · chosen at start on Claude · gpt-6-luna on Codex");
    expect(second).toContain("Never dispatched here");
    expect(host.querySelector("[data-profile-find]")).not.toBeNull();
    expect(host.querySelector("[data-profile-new]").textContent).toBe("New profile");
});

test("the find box keeps the profiles holding every word, and says when none matches", async () => {
    await drawn();
    const find = host.querySelector("[data-profile-find] input");
    await type(find, "worker luna");
    expect(host.querySelectorAll("[data-profile]")).toHaveLength(1);
    expect(host.querySelector('[data-profile="builder"]')).not.toBeNull();
    await type(find, "nothing like it");
    expect(host.textContent).toContain("No profile matches");
    expect(host.querySelectorAll("[data-profile]")).toHaveLength(0);
});

test("a profile opens in a panel at the side with its fields and a model picker for each agent program, not text fields", async () => {
    await drawn();
    await open("journal-researcher");
    expect(document.querySelector("[data-side-panel]")).not.toBeNull();
    expect(document.querySelector('[role="dialog"] h2').textContent).toBe("journal-researcher");
    expect(panel().querySelector("#profile-description").value).toBe(RESEARCHER.description);
    expect(panel().querySelector("#profile-tools").value).toBe("Read, Grep, Glob");
    expect(panel().querySelector("#profile-body").value).toBe("You research.");
    const pickers = [...panel().querySelectorAll("[data-drop-head]")].map((head) => head.textContent.trim());
    expect(pickers).toEqual(["sonnet", "gpt-6.1-sol"]);
    expect(panel().querySelector('input[aria-label="Model on Claude Code"]')).toBeNull();
    expect(panel().textContent).toContain("The journal ships this profile");
});

test("Save waits until something changed, and an edit with a new model is saved by the profile's name", async () => {
    const lines = await drawn();
    await open("journal-researcher");
    const save = document.querySelector("[data-profile-save]");
    expect(save.disabled).toBe(true);
    await type(panel().querySelector("#profile-description"), "Researches a question in the code");
    expect(save.disabled).toBe(false);
    panel().querySelectorAll("[data-drop-head]")[0].click();
    await settle();
    document.querySelector('[data-drop-item="opus"]').click();
    await settle();
    expect(panel().querySelector("[data-drop-head]").textContent.trim()).toBe("opus");
    save.click();
    await settle();
    expect(lines).toContainEqual(["profile", "save", "journal-researcher", "--description", "Researches a question in the code", "--tools", "Read, Grep, Glob", "--type", "subagent", "--model", "opus", "--codex-model", "gpt-6.1-sol", "--body", "You research."]);
    expect(host.querySelector("[data-profile-notice]").textContent).toBe("journal-researcher saved; the agent reads it at its next dispatch.");
});

test("a new profile asks for a name and a description before it can be saved, and is saved under that name", async () => {
    const lines = await drawn();
    host.querySelector("[data-profile-new]").click();
    await settle();
    expect(document.querySelector('[role="dialog"] h2').textContent).toBe("New profile");
    const save = document.querySelector("[data-profile-save]");
    expect(save.disabled).toBe(true);
    await type(panel().querySelector("#profile-name"), "critic");
    expect(save.disabled).toBe(true);
    await type(panel().querySelector("#profile-description"), "Reads a change and says what is wrong with it");
    expect(save.disabled).toBe(false);
    save.click();
    await settle();
    expect(lines.at(-1).slice(0, 3)).toEqual(["profile", "save", "critic"]);
    expect(lines.at(-1)).toContain("Read, Grep, Glob");
});

test("a name with a space cannot be saved", async () => {
    await drawn();
    host.querySelector("[data-profile-new]").click();
    await settle();
    await type(panel().querySelector("#profile-name"), "two words");
    await type(panel().querySelector("#profile-description"), "Whatever it does");
    expect(document.querySelector("[data-profile-save]").disabled).toBe(true);
});

test("an agent's save is refused, which the page says in words and the panel stays open", async () => {
    await drawn([RESEARCHER], async () => ({ok: false, error: "only a person saves a profile, since it says what an agent may do"}));
    await open("journal-researcher");
    await type(panel().querySelector("#profile-description"), "Changed");
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(host.querySelector("[data-profile-failure]").textContent).toContain("only a person saves a profile");
    expect(panel()).not.toBeNull();
});

test("Cancel closes the panel and saves nothing", async () => {
    const lines = await drawn();
    await open("builder");
    document.querySelector("[data-profile-cancel]").click();
    await settle();
    await new Promise((done) => setTimeout(done, 400));
    expect(panel()).toBeNull();
    expect(lines.filter((line) => line[0] === "profile")).toEqual([]);
});

test("a journal with no profiles says what a profile is", async () => {
    await drawn([]);
    expect(host.textContent).toContain("No profiles yet");
    expect(host.textContent).toContain("A profile is a subagent the agent can start for one kind of job");
});
