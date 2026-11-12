import {expect, test} from "vitest";
import {CONTEXT_KINDS, CONTEXT_PROFILES, mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

const choose = async (element, tab) => { element.querySelector(`[data-tab=${tab}]`).click(); await settled(); };
const capRow = (element, kind) => element.querySelector(`[data-cap-row="${kind}"]`);
const note = (element) => element.querySelector("[data-settings-note]").textContent;
const cap = (element, key) => [...element.querySelector(`[data-type-row="${key}"]`).querySelectorAll(".cap > span, .cap small")].map((part) => part.textContent);

async function typeScreen(key) {
    const shell = await mount();
    await choose(shell.element, "agents");
    shell.element.querySelector(`[data-type-row="${key}"]`).click();
    await settled();
    await settled();
    return shell;
}

test("the Advanced screen draws the caps by kind as a table with a row for each kind", async () => {
    const {element} = await mount();
    await choose(element, "advanced");
    expect([...element.querySelectorAll("[data-cap-row] .name")].map((name) => name.textContent)).toEqual(["Main agent", "Workers", "Read-only helpers"]);
    expect(capRow(element, "worker").querySelector("select").value).toBe("200000");
    expect(capRow(element, "main").querySelector(".where").textContent).toBe("Uses the size set for every agent: 400k");
});

test("choosing No cap on a kind writes kind:none for it and keeps the other kinds", async () => {
    const {element, runs} = await mount();
    await choose(element, "advanced");
    capRow(element, "main").querySelector('[data-segment="none"]').click();
    await settled();
    expect(note(element)).toMatch(/^1 change: /);
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs[0]).toContain(`${CONTEXT_KINDS}=["main:none","worker:200000"]`);
});

test("a type with a cap of its own is named under the table, with the way it is changed", async () => {
    const {element} = await mount();
    await choose(element, "advanced");
    expect(element.querySelector("[data-layout-note]").textContent.replace(/\s+/g, " ").trim()).toBe("Researcher 150k. They are changed on their own screens.");
});

test("the screen of a type shows its cap as one of three choices over the entry of its profile", async () => {
    const {element} = await typeScreen("helper:journal-designer");
    const row = element.querySelector("[data-context-cap]");
    expect(row.querySelector('[data-segment="kind"]').getAttribute("aria-checked")).toBe("true");
    expect(row.querySelector("[data-cap-line]").textContent).toBe("400k for its kind, set in Advanced");
});

test("choosing its own cap on the screen of a type writes the entry of the profile in the same request and the Helpers table shows it as Own value", async () => {
    const {element, runs} = await typeScreen("helper:journal-designer");
    element.querySelector('[data-context-cap] [data-segment="own"]').click();
    await settled();
    const select = element.querySelector("[data-context-cap] select");
    select.value = "200000";
    select.dispatchEvent(new Event("change"));
    await settled();
    element.querySelector("[data-back]").click();
    await settled();
    expect(cap(element, "helper:journal-designer")).toEqual(["200k", "Own value"]);
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs[0]).toContain(`${CONTEXT_PROFILES}=["journal-researcher:150000","journal-designer:200000"]`);
});

test("No cap on the screen of a type writes none for its profile, and the kind choice takes the entry away", async () => {
    const {element} = await typeScreen("helper:journal-researcher");
    expect(element.querySelector('[data-context-cap] [data-segment="own"]').getAttribute("aria-checked")).toBe("true");
    element.querySelector('[data-context-cap] [data-segment="none"]').click();
    await settled();
    element.querySelector("[data-back]").click();
    await settled();
    expect(cap(element, "helper:journal-researcher")).toEqual(["No cap", "Own value"]);
    element.querySelector('[data-type-row="helper:journal-researcher"]').click();
    await settled();
    element.querySelector('[data-context-cap] [data-segment="kind"]').click();
    await settled();
    element.querySelector("[data-back]").click();
    await settled();
    expect(cap(element, "helper:journal-researcher")).toEqual(["400k", "Set for every agent"]);
});

test("the workers screen has the cap of the worker profile and the line of every read-only profile has none", async () => {
    const {element} = await typeScreen("worker");
    expect(element.querySelector("[data-context-cap]")).not.toBeNull();
    element.querySelector("[data-back]").click();
    await settled();
    element.querySelector("[data-type-open=helper]").click();
    await settled();
    await settled();
    expect(element.querySelector("[data-context-cap]")).toBeNull();
});
