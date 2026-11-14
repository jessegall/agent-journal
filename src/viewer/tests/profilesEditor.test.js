import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import ProfilePanel from "../../core/modules/profiles/web/src/ProfilePanel.vue";
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
    host.querySelector(`[data-row="${name}"]`).click();
    await settle();
};
const panel = () => document.querySelector("[data-profile-panel]");
const type = async (element, text) => {
    element.value = text;
    element.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
};

test("the find box keeps the profiles holding the words, and says when none matches", async () => {
    await drawn();
    const find = host.querySelector("[data-profile-find] input");
    await type(find, "luna");
    expect(host.querySelectorAll("[data-reader-row]")).toHaveLength(1);
    expect(host.querySelector('[data-row="builder"]')).not.toBeNull();
    await type(find, "nothing like it");
    expect(host.querySelectorAll("[data-reader-row]")).toHaveLength(0);
});

test("a profile opens in a panel at the side with its fields and a model picker for each agent program, not text fields", async () => {
    await drawn();
    await open("journal-researcher");
    expect(document.querySelector("[data-profile-reader]")).not.toBeNull();
    expect(document.querySelector("[data-profile-reader] h2").textContent).toBe("journal-researcher");
    expect(document.querySelector("[data-inspector-actions] [data-profile-save]")).not.toBeNull();
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
    const badged = [...host.querySelectorAll("[data-reader-row]")].filter((row) => row.querySelector("[data-profile-base]")).map((row) => row.dataset.row);
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
    expect(document.querySelector("[data-profile-reader] h2").textContent).toBe("New profile");
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
    expect(host.querySelector('[data-row="journal-researcher"]').textContent).toContain("Changed");
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

test("a profile names what stands in the way in its editor", async () => {
    await drawn([{...BUILDER, notes: ["Could write before"]}, {...RESEARCHER, name: "broken", problem: "Unreadable: bad front matter"}, {...RESEARCHER, name: "moved", module_text_changed: true}]);
    await open("builder");
    expect(document.body.textContent).toContain("Could write before");
    await open("broken");
    expect(document.body.textContent).toContain("Unreadable: bad front matter");
    await open("moved");
    expect(document.body.textContent).toContain("Text changed: the journal's instructions have a new version");
});

test("test_list_and_panel: the page lists the profiles by type with their models, and a chosen one opens in the editor beside the list with its use", async () => {
    await drawn();
    expect(host.querySelector("[data-page-count]").textContent).toBe("2");
    expect([...host.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Helper", "Worker"]);
    const first = host.querySelector('[data-row="journal-researcher"]').textContent.replace(/\s+/g, " ");
    expect(first).toContain("journal-researcher");
    expect(first).toContain("sonnet on Claude Code · gpt-6.1-sol on Codex");
    const second = host.querySelector('[data-row="builder"]').textContent.replace(/\s+/g, " ");
    expect(second).toContain("chosen at start on Claude Code · gpt-6-luna on Codex");
    expect(host.querySelector("[data-profile-find]")).not.toBeNull();
    expect(host.querySelector("[data-profile-new]").textContent).toBe("New profile");
    await open("journal-researcher");
    expect(host.querySelector("[data-profile-reader] .profile-abstract").textContent).toContain("Uses: 3 times, last");
});

const menuLabels = (name) => menuEntries(placeUnder(host.querySelector(`[data-row="${name}"]`)).items).filter((entry) => !entry.separator);

test("test_menu_items: a right click has Open, Duplicate, Copy name, Reset and Remove, Reset only for a changed supplied profile and Remove only for one the journal does not supply", async () => {
    const lines = await drawn([{...RESEARCHER, changed: ["description"]}, BUILDER]);
    expect(menuLabels("journal-researcher").map((entry) => entry.label)).toEqual(["Open", "Duplicate", "Copy name", "Reset", "Remove"]);
    const [researcher, builder] = [menuLabels("journal-researcher"), menuLabels("builder")];
    expect(researcher.find((entry) => entry.label === "Reset").disabled).toBeFalsy();
    expect(researcher.find((entry) => entry.label === "Remove").disabled).toBe(true);
    expect(builder.find((entry) => entry.label === "Reset").disabled).toBe(true);
    expect(builder.find((entry) => entry.label === "Remove").armedLabel).toBe("Remove: click again");
    await researcher.find((entry) => entry.label === "Reset").run({say: () => {}});
    await settle();
    expect(lines).toContainEqual(["profile", "reset", "journal-researcher"]);
    await builder.find((entry) => entry.label === "Remove").run({say: () => {}});
    await settle();
    expect(lines).toContainEqual(["profile", "remove", "builder"]);
    await menuLabels("builder").find((entry) => entry.label === "Duplicate").run({say: () => {}});
    await settle();
    expect(document.querySelector("[data-profile-reader] h2").textContent).toBe("builder copy");
});

test("test_section_slot: the editor keeps a slot under its tabs for the sections that later plans add", async () => {
    const element = document.createElement("div");
    document.body.append(element);
    const slotted = createApp({render: () => h(ProfilePanel, {profile: {...BUILDER, title: "Builder", changed: []}, programs: PROGRAMS, types: TYPES}, {sections: ({profile}) => h("section", {"data-added-section": profile.name}, "Triggers")})});
    slotted.provide(WINDOW_CONTEXT, profileWindowContext({"profile skills": SKILLS}));
    slotted.mount(element);
    await settle();
    expect(element.querySelector("[data-profile-sections] [data-added-section]").textContent).toBe("Triggers");
    expect(element.querySelector("[data-profile-sections] [data-added-section]").dataset.addedSection).toBe("builder");
    slotted.unmount();
});
