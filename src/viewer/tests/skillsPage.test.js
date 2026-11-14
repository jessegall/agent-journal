import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {route} from "../src/route.js";
import {page} from "./support/windowContext.js";
import {skillWindowContext} from "./support/skillWindowContext.js";
import Skills from "../../core/modules/skills/web/src/skills.js";

const CATALOGUE = page([
    {folder: "journal-notes", description: "How to take notes", shipped: true, module: "journal.core.notes", digest: "now", keywords: [], commands: [], modified_at: 4, path: ".agents/skills/journal-notes/SKILL.md"},
    {folder: "project-notes", description: "Project notes", shipped: false, module: "project", digest: "project", keywords: ["notes"], commands: [], modified_at: 8, path: ".claude/skills/project-notes/SKILL.md"},
]);
const SETTINGS = {ok: true, value: {session_start: [], after_compaction: [], main_agent: [], environment_overrides: false}};
const TEXT = {ok: true, value: {folder: "journal-notes", description: "How to take notes", text: "Write a note for every **decision**."}};
const PROFILES = page([{name: "helpers", skills: ["journal-notes"], required_skills: ["journal-notes", "other"]}, {name: "reviewers", skills: [], required_skills: []}]);
const apps = [];

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
});
afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    history.replaceState(null, "", "/");
    vi.unstubAllGlobals();
});

async function settled() {
    for (let round = 0; round < 8; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 10));
}

async function mounted(changes = {}) {
    const answers = {"agent main": {ok: true, value: {id: 7}}, "skill list": CATALOGUE, "skill requirements": SETTINGS, "trigger list": page([]), "agent-skill list": page([]), "skill show": TEXT, "profile list": PROFILES, ...changes};
    const window = skillWindowContext(answers);
    window.option = () => ref(undefined);
    const read = window.read;
    window.read = (line) => read(Array.isArray(line) ? line.join(" ") : line);
    window.run = vi.fn(async () => ({ok: true, value: {}}));
    window.follow = () => {};
    const element = document.createElement("div");
    document.body.appendChild(element);
    const app = createApp({render: () => h(Skills)}).provide(WINDOW_CONTEXT, window);
    apps.push(app);
    app.mount(element);
    await settled();
    return {element, window};
}
const rowOf = (element, folder) => element.querySelector(`[data-row="${folder}"]`);
const choose = async (element, folder) => {
    rowOf(element, folder).click();
    await settled();
};
const tab = async (element, key) => {
    element.querySelector(`[data-tab="${key}"]`).click();
    await settled();
};
const itemButton = (label) => [...document.body.querySelectorAll("[data-menu-item]")].find((item) => item.textContent.trim().replace(/›$/, "") === label);
const labels = (element, folder) => menuEntries(placeUnder(rowOf(element, folder)).items).filter((entry) => !entry.separator).map((entry) => entry.label);

test("test_reader_tabs: a skill opens in a reader with What it says, When it is read, Read by and Profiles, each with its own body", async () => {
    const {element} = await mounted();
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["From the journal", "From this project"]);
    await choose(element, "journal-notes");
    expect([...element.querySelectorAll("[data-tab]")].map((found) => found.textContent.trim().replace(/\s+/g, " "))).toEqual(["What it says", "When it is read 0", "Read by", "Profiles 1"]);
    expect(element.querySelector("[data-skill-text] strong").textContent).toBe("decision");
    await tab(element, "when");
    expect(element.querySelector("[data-skill-when]").textContent).toContain("Must the agent read it at the start?");
    expect(element.querySelector("[data-skill-trigger-add]")).not.toBeNull();
    await tab(element, "readby");
    expect(element.querySelector("[data-skill-status]").textContent).toContain("has not read this skill");
    await tab(element, "profiles");
    expect([...element.querySelectorAll("[data-skill-profile]")].map((found) => found.textContent.trim())).toEqual(["helpersMust read it"]);
});

test("test_open_skill_md_in_files: the Actions menu opens the skill's SKILL.md in the file inspector", async () => {
    const {element} = await mounted();
    await choose(element, "project-notes");
    element.querySelector("[data-actions-menu]").click();
    await settled();
    itemButton("Open SKILL.md in Files").click();
    await settled();
    await settled();
    expect(route.value.open).toMatchObject({table: "file", id: ".claude/skills/project-notes/SKILL.md"});
});

test("test_menu_items: a right click has Copy name and Turn on, and Turn on requires the skill for every agent with one command", async () => {
    const {element, window} = await mounted();
    expect(labels(element, "journal-notes")).toEqual(["Copy name", "Turn on"]);
    const spoken = [];
    await menuEntries(placeUnder(rowOf(element, "journal-notes")).items).find((entry) => entry.label === "Turn on").run({say: (text) => spoken.push(text)});
    expect(window.run).toHaveBeenCalledWith(["skill", "set-required", "journal-notes", "--agents", "all"]);
    expect(spoken).toEqual(["journal-notes is required at the start"]);
});

test("a required skill has the quiet word for who reads it, and its menu turns it off", async () => {
    const {element} = await mounted({"skill requirements": {ok: true, value: {...SETTINGS.value, session_start: ["journal-notes"], main_agent: []}}});
    expect(rowOf(element, "journal-notes").querySelector("[data-skill-required]").textContent).toBe("Every agent");
    expect(rowOf(element, "project-notes").querySelector("[data-skill-required]")).toBeNull();
    expect(labels(element, "journal-notes")).toEqual(["Copy name", "Turn off"]);
});

test("Require in a profile adds the skill to what the profile must read, through profile save", async () => {
    const {element, window} = await mounted();
    await choose(element, "journal-notes");
    element.querySelector("[data-actions-menu]").click();
    await settled();
    itemButton("Require in a profile").click();
    await settled();
    await settled();
    const field = document.body.querySelector('[data-field="profile"]');
    field.value = "helpers";
    field.dispatchEvent(new Event("change", {bubbles: true}));
    await settled();
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe("journal profile save helpers --required-skills journal-notes,other");
    document.body.querySelector("[data-create-send]").click();
    await settled();
    expect(window.run).toHaveBeenCalledWith(["profile", "save", "helpers", "--required-skills", "journal-notes,other"]);
});

test("a skill changed since the agent read it offers reading it again", async () => {
    const {element, window} = await mounted({"agent-skill list": page([{id: 2, skill: "journal-notes", state: "loaded", digest: "old", loaded_at: "2026-11-06T10:00:00Z"}])});
    await choose(element, "journal-notes");
    await tab(element, "readby");
    expect(element.querySelector("[data-skill-status]").textContent).toContain("This skill changed");
    element.querySelector("[data-skill-read-now]").click();
    await settled();
    expect(window.run).toHaveBeenCalledWith(["agent-skill", "reset", "2"]);
});
