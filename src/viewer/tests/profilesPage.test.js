import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import ProfilePanel from "../../core/modules/profiles/web/src/ProfilePanel.vue";
import ProfileRows from "../../core/modules/profiles/web/src/ProfileRows.vue";
import {profileWindowContext, PROGRAMS} from "./support/profileWindowContext.js";

import {RESEARCHER, host, drawn, open, panel, type} from "./support/profilesPage.js";

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

test("the editor's fields are in five tabs, the first open and the skills tab counting what is on", async () => {
    await drawn();
    await open("journal-researcher");
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


