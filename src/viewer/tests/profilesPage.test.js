import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import ProfileRows from "../../core/modules/profiles/web/src/ProfileRows.vue";
import {profileWindowContext, PROGRAMS} from "./support/profileWindowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const RESEARCHER = {name: "journal-researcher", description: "Researches a question and reports what it found", agent_type: "helper", access: "read-only", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], module: "journal.suites.coding", notes: [], problem: "", module_text_changed: false, model: "sonnet", codex_model: "gpt-6.1-sol", program_models: {claude: "sonnet", codex: "gpt-6.1-sol"}, body: "You research.", shipped: true, uses: 3, last_used: Date.now() / 1000 - 600};
const BUILDER = {name: "builder", description: "Writes a bounded change", agent_type: "worker", access: "writing", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], module: "", notes: [], problem: "", module_text_changed: false, model: "", codex_model: "gpt-6-luna", program_models: {claude: "", codex: "gpt-6-luna"}, body: "You build.", shipped: false, uses: 0, last_used: 0};
const ROUTED = {...BUILDER, name: "routed", description: "Reads on one program, then another", program: "claude", preferred_program: true, fallback_programs: ["codex"]};
const TYPES = [{key: "helper", label: "Helper", access: "read-only", extends: "", declares_occupant: true}, {key: "worker", label: "Worker", access: "writing", extends: "helper", declares_occupant: false}];
const SKILLS = {ok: true, value: {profile: "journal-researcher", rows: [
    {key: "journal", description: "Find your way in the journal", state: "on", own: false, required: false, locked: true},
    {key: "journal-helpers", description: "Start a helper for a bounded read", state: "on", own: true, required: true, locked: false},
    {key: "journal-tasks", description: "Declare, log and finish the work", state: "on", own: false, required: false, locked: false},
    {key: "journal-dumps", description: "File what the user dropped", state: "off", own: false, required: false, locked: false},
]}};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
    document.body.innerHTML = "";
});

// the page drawn in the document, over a journal that lists these profiles and answers each line it runs as the given function says
async function drawn(profiles = [RESEARCHER, BUILDER], run = async () => ({ok: true, value: null}), programs = PROGRAMS) {
    const lines = [];
    const window_ = {...profileWindowContext({"agent programs": page(programs), "profile skills": SKILLS, "profile list": {...page(profiles), value: {...page(profiles).value, types: TYPES}}}), run: async (line) => (lines.push(line), run(line))};
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

test("the page lists each profile with its description, type, models and use, under a bar with the find box, New profile and the count", async () => {
    await drawn();
    expect(host.querySelector("[data-profile-count]").textContent).toBe("2 profiles");
    const first = host.querySelector('[data-profile="journal-researcher"]').textContent.replace(/\s+/g, " ");
    expect(first).toContain("journal-researcher");
    expect(first).toContain("Researches a question and reports what it found");
    expect(first).toContain("Type: Helper · Access: Read-only · sonnet on Claude Code · gpt-6.1-sol on Codex · Comes with the journal");
    expect(first).toContain("Uses: 3 times, last");
    const second = host.querySelector('[data-profile="builder"]').textContent.replace(/\s+/g, " ");
    expect(second).toContain("Type: Worker · Access: Writing · chosen at start on Claude Code · gpt-6-luna on Codex");
    expect(second).toContain("Uses: none");
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
    const actions = document.querySelector('[role="dialog"] > [data-inspector-actions]');
    expect(actions.previousElementSibling.matches(".body")).toBe(true);
    expect(actions.querySelector("[data-profile-save]")).not.toBeNull();
    expect(panel().querySelector("#profile-description").value).toBe(RESEARCHER.description);
    expect(panel().querySelector("#profile-tools")).toBeNull();
    expect(panel().querySelector("#profile-body").value).toBe("You research.");
    const pickers = [...panel().querySelectorAll("[data-drop-head]")].map((head) => head.textContent.trim());
    expect(pickers).toEqual(["sonnet", "gpt-6.1-sol"]);
    expect(panel().querySelector('input[aria-label="Model on Claude Code"]')).toBeNull();
    expect(document.querySelector("[data-profile-meta]").textContent).toContain("Comes with the journal");
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
    expect(lines).toContainEqual(["profile", "save", "journal-researcher", "--description", "Researches a question in the code", "--type", "helper", "--access", "read-only", "--program", "", "--no-program-if-possible", "--fallback-programs", "", "--tier", "", "--model", "opus", "--codex-model", "gpt-6.1-sol", "--mcp-tools", "", "--occupant", "when-cold", "--body", "You research."]);
    expect(host.querySelector("[data-profile-notice]").textContent).toBe("journal-researcher saved. The agent will use it the next time it starts a helper with this profile.");
});

test("the panel shows the stored conversation choice of a helper profile, and picking New for each job saves it as each-launch", async () => {
    const lines = await drawn();
    await open("journal-researcher");
    const picked = () => panel().querySelector('[data-profile-occupant] [aria-checked="true"]').textContent.trim();
    expect(picked()).toBe("Start over after a long pause");
    [...panel().querySelectorAll("[data-profile-occupant] button")].find((button) => button.textContent.trim() === "New for each job").click();
    await settle();
    expect(picked()).toBe("New for each job");
    document.querySelector("[data-profile-save]").click();
    await settle();
    const saved = lines.find((line) => line[1] === "save");
    expect(saved.slice(saved.indexOf("--occupant"), saved.indexOf("--occupant") + 2)).toEqual(["--occupant", "each-launch"]);
});

test("a base profile shows a Base badge and the profiles that extend it show none", async () => {
    await drawn([RESEARCHER, {...BUILDER, name: "journal-worker", is_base: true}, {...BUILDER, name: "journal-worker-medior", is_base: false}]);
    const badged = [...host.querySelectorAll("[data-profile]")].filter((row) => row.querySelector("[data-profile-base]")).map((row) => row.dataset.profile);
    expect(badged).toEqual(["journal-worker"]);
});

test("a worker profile shows no conversation choice and its save names no occupant", async () => {
    const lines = await drawn();
    await open("builder");
    expect(panel().querySelector("[data-profile-occupant]")).toBeNull();
    await type(panel().querySelector("#profile-description"), "Writes one bounded change");
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(lines.find((line) => line[1] === "save")).not.toContain("--occupant");
});

test("a profile names the programs to try instead, in the order typed, and saves them as one list", async () => {
    const lines = await drawn([RESEARCHER, ROUTED]);
    await open("routed");
    const field = panel().querySelector("[data-profile-fallbacks]");
    expect(field.value).toBe("codex");
    await type(field, "codex,claude");
    document.querySelector("[data-profile-save]").click();
    await settle();
    const line = lines.at(-1);
    expect(line.slice(0, 3)).toEqual(["profile", "save", "routed"]);
    expect(line[line.indexOf("--fallback-programs") + 1]).toBe("codex,claude");
    expect(line).toContain("--program-if-possible");
});

test("a profile that always uses its program offers no list of programs to try instead", async () => {
    await drawn([RESEARCHER, ROUTED]);
    await open("routed");
    const choices = [...panel().querySelectorAll("[data-profile-program-choice] button")];
    choices.find((button) => button.textContent.trim() === "Always this program").click();
    await settle();
    expect(panel().querySelector("[data-profile-fallbacks]")).toBeNull();
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
    expect(lines.at(-1)).toContain("helper");
});

test("a profile can save a tier without naming a model", async () => {
    const lines = await drawn();
    host.querySelector("[data-profile-new]").click();
    await settle();
    await type(panel().querySelector("#profile-name"), "tier-reader");
    await type(panel().querySelector("#profile-description"), "Reads a difficult question");
    const choices = [...panel().querySelectorAll("[data-profile-tier] button")];
    choices.find((button) => button.textContent.trim() === "Strongest").click();
    await settle();
    document.querySelector("[data-profile-save]").click();
    await settle();
    const line = lines.at(-1);
    expect(line.slice(0, 3)).toEqual(["profile", "save", "tier-reader"]);
    expect(line[line.indexOf("--tier") + 1]).toBe("strongest");
    expect(line[line.indexOf("--model") + 1]).toBe("");
    expect(line[line.indexOf("--codex-model") + 1]).toBe("");
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
    await drawn([RESEARCHER], async () => ({ok: false, error: "only a user saves a profile, since it says what an agent may do"}));
    await open("journal-researcher");
    await type(panel().querySelector("#profile-description"), "Changed");
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(host.querySelector("[data-profile-failure]").textContent).toContain("only a user saves a profile");
    expect(panel()).not.toBeNull();
});

test("a changed shipped profile says so, locks its type and offers the journal's version", async () => {
    const lines = await drawn([{...RESEARCHER, changed: ["model"], model: "opus"}, BUILDER]);
    expect(host.querySelector('[data-profile="journal-researcher"]').textContent).toContain("Changed");
    await open("journal-researcher");
    expect(panel().querySelector("[data-profile-type-locked]").textContent).toBe("Helper");
    expect(document.querySelector("[data-profile-meta]").textContent).toContain("Comes with the journal");
    document.querySelector("[data-profile-reset]").click();
    await settle();
    expect(lines).toContainEqual(["profile", "reset", "journal-researcher"]);
});

test("a type that cannot write offers no Writing and moves the access to Read-only", async () => {
    await drawn();
    await open("builder");
    expect(panel().querySelector("[data-profile-access]").textContent).toContain("Writing");
    [...panel().querySelectorAll("[data-profile-type] button")].find((button) => button.textContent.includes("Helper")).click();
    await settle();
    expect(panel().querySelector("[data-profile-access]").textContent).not.toContain("Writing");
});

test("a changed text shows Compare with the journal's new version", async () => {
    await drawn([{...RESEARCHER, changed: ["body"], module_text_changed: true, body: "Mine", module_body: "The journal's"}, BUILDER]);
    await open("journal-researcher");
    panel().querySelector("[data-profile-compare]").click();
    await settle();
    expect(panel().textContent).toContain("The journal's");
});

test("a row names what stands in the way", async () => {
    await drawn([{...BUILDER, notes: ["Could write before"]}, {...RESEARCHER, name: "broken", problem: "Unreadable: bad front matter"}, {...RESEARCHER, name: "moved", module_text_changed: true}]);
    expect(host.textContent).toContain("Could write before");
    expect(host.textContent).toContain("Unreadable: bad front matter");
    expect(host.textContent).toContain("Text changed: the journal's instructions have a new version");
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
    expect(host.textContent).toContain("A profile gives an agent its instructions, type and model");
});


test("a third provider supplies program and model choices and its save option", async () => {
    const programs = [...PROGRAMS, {name: "sample", title: "Sample program", model_option: "--sample-model", models: [{name: "sample-fast", tier: "fast"}]}];
    const lines = await drawn([RESEARCHER], undefined, programs);
    await open(RESEARCHER.name);
    expect(panel().textContent).toContain("The parent program");
    expect(panel().textContent).toContain("Model on Sample program");
    panel().querySelector('[data-profile-model="sample"] [data-drop-head]').click();
    await settle();
    document.querySelector('[data-drop-item="sample-fast"]').click();
    await settle();
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(lines[0]).toEqual(expect.arrayContaining(["--sample-model", "sample-fast"]));
});

test("the panel lists every skill with a switch and marks the ones made for the profile's type, and a switch is saved as the skills the profile names", async () => {
    const lines = await drawn();
    await open("journal-researcher");
    const rows = [...panel().querySelectorAll("[data-profile-skill]")];
    expect(rows.map((row) => row.dataset.profileSkill)).toEqual(["journal", "journal-helpers", "journal-tasks", "journal-dumps"]);
    expect(rows.map((row) => row.querySelector("[data-profile-skill-switch]").getAttribute("aria-checked"))).toEqual(["true", "true", "true", "false"]);
    expect(rows.map((row) => row.querySelector("[data-profile-skill-own]") !== null)).toEqual([false, true, false, false]);
    const save = document.querySelector("[data-profile-save]");
    expect(save.disabled).toBe(true);
    rows[3].querySelector("[data-profile-skill-switch]").click();
    await settle();
    expect(rows[3].querySelector("[data-profile-skill-switch]").getAttribute("aria-checked")).toBe("true");
    expect(save.disabled).toBe(false);
    save.click();
    await settle();
    expect(lines.at(-1).slice(-2)).toEqual(["--skills", "journal,journal-helpers,journal-tasks,journal-dumps"]);
});

const skillRow = (key) => panel().querySelector(`[data-profile-skill="${key}"]`);
const requiredSwitch = (key) => skillRow(key).querySelector("[data-profile-skill-required]");
const openSkills = async (name = "journal-researcher") => {
    const lines = await drawn();
    await open(name);
    document.querySelector('[data-inner-tabs] [data-tab="skills"]').click();
    await settle();
    return lines;
};

test("the panel is wide and its fields are in five tabs, the first open and the skills tab counting what is on", async () => {
    await drawn();
    await open("journal-researcher");
    expect(document.querySelector("[data-side-panel] .panel").classList.contains("wide")).toBe(true);
    const tabs = [...document.querySelectorAll("[data-inner-tabs] [data-tab]")];
    expect(tabs.map((tab) => tab.dataset.tab)).toEqual(["about", "model", "instructions", "tools", "skills"]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[4].textContent).toContain("3");
});

test("choosing a tab shows its fields and keeps what was typed in another", async () => {
    await drawn();
    await open("journal-researcher");
    const title = document.querySelector("#profile-title");
    await type(title, "Researcher");
    document.querySelector('[data-inner-tabs] [data-tab="instructions"]').click();
    await settle();
    expect(document.querySelector('[data-profile-tab="instructions"]').style.display).not.toBe("none");
    expect(document.querySelector('[data-profile-tab="about"]').style.display).toBe("none");
    expect(document.querySelector("#profile-title").value).toBe("Researcher");
});

test("the header names the profile and says it comes with the journal", async () => {
    await drawn();
    await open("journal-researcher");
    const meta = document.querySelector("[data-profile-meta]").textContent;
    expect(meta).toContain("journal-researcher");
    expect(meta).toContain("Comes with the journal");
});

test("a change shows Unsaved changes, and none shows nothing", async () => {
    await drawn();
    await open("journal-researcher");
    expect(document.querySelector("[data-profile-unsaved]")).toBe(null);
    await type(document.querySelector("#profile-title"), "Researcher");
    expect(document.querySelector("[data-profile-unsaved]").textContent).toBe("Unsaved changes");
});

test("a skill that is on has a Required toggle, showing what the profile requires, and one that is off has none", async () => {
    await openSkills();
    expect(requiredSwitch("journal-helpers").getAttribute("aria-checked")).toBe("true");
    expect(requiredSwitch("journal-tasks").getAttribute("aria-checked")).toBe("false");
    expect(requiredSwitch("journal-dumps")).toBe(null);
});

test("the Required toggle is saved as the skills the profile requires", async () => {
    const lines = await openSkills();
    requiredSwitch("journal-tasks").click();
    await settle();
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(lines.at(-1).slice(-2)).toEqual(["--required-skills", "journal-helpers,journal-tasks"]);
});

test("switching a required skill off clears Required, and switching it on again starts with Required off", async () => {
    const lines = await openSkills();
    skillRow("journal-helpers").querySelector("[data-profile-skill-switch]").click();
    await settle();
    expect(requiredSwitch("journal-helpers")).toBe(null);
    skillRow("journal-helpers").querySelector("[data-profile-skill-switch]").click();
    await settle();
    expect(requiredSwitch("journal-helpers").getAttribute("aria-checked")).toBe("false");
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(lines.at(-1).slice(-2)).toEqual(["--required-skills", ""]);
});

test("the last Required taken off is saved as an empty list, so that it really goes", async () => {
    const lines = await openSkills();
    requiredSwitch("journal-helpers").click();
    await settle();
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(lines.at(-1).slice(-2)).toEqual(["--required-skills", ""]);
});

test("a skill every agent reads at the start is locked on, with a note in place of the toggle", async () => {
    await openSkills();
    const row = skillRow("journal");
    expect(row.querySelector("[data-profile-skill-switch]").disabled).toBe(true);
    expect(requiredSwitch("journal")).toBe(null);
    expect(row.querySelector("[data-profile-skill-locked]").textContent).toBe("Every agent reads this at the start");
});

test("the skills tab counts what is on and what is required as the switches move", async () => {
    await openSkills();
    expect(panel().querySelector("[data-profile-skill-count]").textContent).toBe("3 of 4 on, 1 required");
    requiredSwitch("journal-tasks").click();
    await settle();
    expect(panel().querySelector("[data-profile-skill-count]").textContent).toBe("3 of 4 on, 2 required");
});

test("a new profile has no skill list yet and says to save first", async () => {
    await drawn();
    host.querySelector("[data-profile-new]").click();
    await settle();
    document.querySelector('[data-inner-tabs] [data-tab="skills"]').click();
    await settle();
    expect(panel().querySelector("[data-profile-skills]")).toBe(null);
    expect(panel().textContent).toContain("Save the profile first, then choose its skills.");
});

test("a failed save is shown inside the panel, not only behind it", async () => {
    await drawn([RESEARCHER], async (line) => (line[1] === "save" ? {ok: false, error: "only a user saves a profile"} : {ok: true, value: null}));
    await open("journal-researcher");
    await type(document.querySelector("#profile-title"), "Researcher");
    document.querySelector("[data-profile-save]").click();
    await settle();
    expect(panel().querySelector("[data-profile-panel-failure]").textContent).toContain("only a user saves a profile");
});
