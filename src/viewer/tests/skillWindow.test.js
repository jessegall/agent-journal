import {createApp, h, nextTick, ref} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {page} from "./support/windowContext.js";
import {skillWindowContext} from "./support/skillWindowContext.js";
import Skills from "../../core/modules/skills/web/src/skills.js";

const CATALOGUE = page([{folder: "journal-notes", description: "How to take notes", shipped: true, module: "journal.core.notes", digest: "now", keywords: [], commands: [], modified_at: 4}, {folder: "project-notes", description: "Project notes", shipped: false, module: "project", digest: "project", keywords: [], commands: [], modified_at: 8}]);
const SETTINGS = {ok: true, value: {session_start: [], after_compaction: [], main_agent: [], environment_overrides: false}};
const TEXT = {ok: true, value: {folder: "journal-notes", description: "How to take notes", text: "Write a note for every decision."}};
const apps = [];
afterEach(() => {apps.splice(0).forEach((app) => app.unmount()); document.body.innerHTML = ""; history.replaceState(null, "", "/"); vi.unstubAllGlobals();});

async function settled() {
    for (let round = 0; round < 8; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 10));
}

async function mounted(changes = {}) {
    const answers = {"agent main": {ok: true, value: {id: 7}}, "skill list": CATALOGUE, "skill requirements": SETTINGS, "trigger list": page([]), "agent-skill list": page([]), "skill show": TEXT, ...changes};
    const window = skillWindowContext(answers);
    window.option = () => ref(undefined);
    const read = window.read;
    window.read = (line) => read(Array.isArray(line) ? line.join(" ") : line);
    window.run = vi.fn(async () => ({ok: true, value: {}}));
    const heard = [];
    window.follow = (patterns, handler) => heard.push({patterns, handler});
    const element = document.createElement("div");
    document.body.appendChild(element);
    const app = createApp({render: () => h(Skills)}).provide(WINDOW_CONTEXT, window);
    apps.push(app);
    app.mount(element);
    await settled();
    return {element, window, heard, answers};
}
const click = async (element, name) => { [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === name).click(); await settled(); };

function stubFileLinks() {
    vi.stubGlobal("URL", class extends URL { static createObjectURL() {return "blob:skill";} static revokeObjectURL() {} });
}

test("the page combines the catalogue with source groups and one switch for each skill", async () => {
    const {element} = await mounted();
    expect(element.textContent).toContain("From the journal");
    expect(element.textContent).toContain("From this project");
    expect(element.querySelectorAll('[role="switch"]').length).toBe(2);
    expect(element.textContent).toContain("Choose a skill to read what it says");
});

test("the required switch changes one skill with one command", async () => {
    const {element, window} = await mounted();
    element.querySelector('[role="switch"]').click();
    await settled();
    expect(window.run).toHaveBeenCalledWith(["skill", "set-required", "journal-notes", "--agents", "all"]);
});

test("search and filters show clear empty states", async () => {
    const {element} = await mounted();
    await click(element, "Required 0");
    expect(element.textContent).toContain("No skill is required");
    await click(element, "Read by the main agent 0");
    expect(element.textContent).toContain("No skill is read in this conversation");
    const input = element.querySelector('[data-search-input]');
    input.value = "no-match"; input.dispatchEvent(new Event("input")); await settled();
    expect(element.textContent).toContain("No skill matches");
});

test("no installed skills and read failures have recovery messages", async () => {
    const {element, answers, heard} = await mounted({"skill list": page([])});
    expect(element.textContent).toContain("No skills are installed");
    answers["skill list"] = {ok: false, error: "The list failed"};
    await heard[1].handler({event: "setting.update"}); await new Promise((resolve) => setTimeout(resolve, 70)); await settled();
    expect(element.textContent).toContain("The list failed");
    expect(element.textContent).toContain("Try again");
});

test("opening a skill keeps the list and gives the skill an address", async () => {
    stubFileLinks();
    const {element, window} = await mounted();
    element.querySelector('[aria-label="journal-notes"]').click(); await settled();
    expect(window.reads).toContain("skill show --folder journal-notes");
    expect(element.querySelector('[data-skills-catalogue]')).not.toBeNull();
    expect(element.textContent).toContain("Write a note for every decision.");
    expect(new URL(location.href).searchParams.get("skill")).toBe("journal-notes");
});

test("a removed skill and a failed skill read are shown without losing the list", async () => {
    const {element} = await mounted({"skill show": {ok: false, failure: "refused", error: "gone"}});
    element.querySelector('[aria-label="journal-notes"]').click(); await settled();
    expect(element.textContent).toContain("The skill journal-notes is no longer available");
    expect(element.querySelector('[data-skills-catalogue]')).not.toBeNull();
});

test("environment overrides warn that changes still apply to the project", async () => {
    const {element} = await mounted({"skill requirements": {ok: true, value: {...SETTINGS.value, environment_overrides: true}}});
    expect(element.textContent).toContain("The environment lists still take priority");
});

test("compaction removes the read filter's skills", async () => {
    const {element, heard, answers} = await mounted({"agent-skill list": page([{id: 1, skill: "journal-notes", state: "loaded", digest: "now", loaded_at: "2026-11-06T10:00:00Z"}])});
    await click(element, "Read by the main agent 1");
    answers["agent-skill list"] = page([]);
    await heard[0].handler({event: "agent_skill.update"}); await new Promise((resolve) => setTimeout(resolve, 300)); await settled();
    expect(element.textContent).toContain("No skill is read in this conversation");
});

test("the trigger view has an empty state and an inline form with whole word matching", async () => {
    const {element} = await mounted();
    await click(element, "Triggers");
    expect(element.textContent).toContain("You have no triggers yet");
    await click(element, "Add a trigger");
    expect(element.querySelector('[data-trigger-match="word"]')).not.toBeNull();
    expect(element.textContent).toContain("Choose a skill");
    expect(element.querySelector('input[aria-label="Try a sentence"]')).not.toBeNull();
});

test("the trigger trial reads a requested key with its own state flags", async () => {
    const {element, window} = await mounted({"trigger try": {ok: true, value: {matches: true}}});
    await click(element, "Triggers");
    await click(element, "Add a trigger");
    const words = element.querySelector('[data-trigger-word]');
    words.value = "notes";
    words.dispatchEvent(new Event("input"));
    await settled();
    words.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    const sample = element.querySelector('input[aria-label="Try a sentence"]');
    sample.value = "Take notes";
    sample.dispatchEvent(new Event("input"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await settled();
    expect(window.reads).toContain("trigger try --phrases notes --sentence Take notes --match-mode word");
    expect(element.textContent).toContain("This would fire.");
});

test("a changed skill offers reading it again and a due skill explains the wait", async () => {
    stubFileLinks();
    const {element, window, answers, heard} = await mounted({"agent-skill list": page([{id: 2, skill: "journal-notes", state: "loaded", digest: "old", loaded_at: "2026-11-06T10:00:00Z"}])});
    element.querySelector('[aria-label="journal-notes"]').click(); await settled();
    expect(element.textContent).toContain("This skill changed");
    await click(element, "Make the agent read it again");
    expect(window.run).toHaveBeenCalledWith(["agent-skill", "reset", "2"]);
    answers["agent-skill list"] = page([{id: 2, skill: "journal-notes", state: "due"}]);
    await heard[0].handler({event: "agent_skill.update"}); await new Promise((resolve) => setTimeout(resolve, 300)); await settled();
    expect(element.textContent).toContain("The main agent still has to read this skill");
});

test("without a main agent a skill explains why read now is unavailable", async () => {
    stubFileLinks();
    const {element} = await mounted({"agent main": {ok: true, value: {id: null}}});
    element.querySelector('[aria-label="journal-notes"]').click(); await settled();
    expect(element.textContent).toContain("No main agent is running");
    expect(element.textContent).not.toContain("Make the agent read it now");
});
