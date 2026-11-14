import {expect, test} from "vitest";
import {AUTO, SENDS, WRITES, mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

const control = (element, key) => element.querySelector(`[data-setting="${key}"]`);
const press = async (element, key) => { control(element, key).querySelector("[role=switch]").click(); await settled(); };
const marked = (element) => [...element.querySelectorAll("[data-preset]")].filter((button) => button.getAttribute("aria-checked") === "true").map((button) => button.dataset.preset);
const note = (element) => element.querySelector("[data-settings-note]").textContent;

test("a form whose switches match a preset shows that preset in the band", async () => {
    const {element} = await mount();
    expect([...element.querySelectorAll("[data-preset]")].map((button) => button.textContent)).toEqual(["Builder", "Orchestrator", "Custom"]);
    expect(marked(element)).toEqual(["builder"]);
});

test("one switch changed shows Custom, and putting it back shows the preset again", async () => {
    const {element} = await mount();
    await press(element, SENDS);
    expect(marked(element)).toEqual(["custom"]);
    await press(element, SENDS);
    expect(marked(element)).toEqual(["builder"]);
});

test("the band is on every tab", async () => {
    const {element} = await mount();
    for (const tab of ["tests", "advanced", "agents", "work"]) {
        element.querySelector(`[data-tab=${tab}]`).click();
        await settled();
        expect(element.querySelector("[data-preset=builder]")).not.toBeNull();
    }
});

test("picking Orchestrator fills the switches in the draft, shows the count of switches that differ and saves nothing", async () => {
    const {element, runs} = await mount();
    element.querySelector("[data-preset=orchestrator]").click();
    await settled();
    expect(marked(element)).toEqual(["orchestrator"]);
    expect(control(element, AUTO).querySelector("[role=switch]").getAttribute("aria-checked")).toBe("false");
    expect(note(element)).toMatch(/^2 changes: /);
    expect(runs).toEqual([]);
});

test("Cancel drops the filled switches", async () => {
    const {element} = await mount();
    element.querySelector("[data-preset=orchestrator]").click();
    await settled();
    element.querySelector("[data-settings-cancel]").click();
    await settled();
    expect(marked(element)).toEqual(["builder"]);
    expect(note(element)).toContain("No changes");
});

test("Save sends the switches the preset changed", async () => {
    const {element, runs} = await mount();
    element.querySelector("[data-preset=orchestrator]").click();
    await settled();
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs).toEqual([["setting-screen", "apply", "work", "--revision", "w1", `${AUTO}=off`, `${WRITES}=off`]]);
});

test("the link opens the page inside the modal, and Back returns to the tab the user came from", async () => {
    const {element} = await mount();
    element.querySelector("[data-tab=tests]").click();
    await settled();
    element.querySelector("[data-preset-page]").click();
    await settled();
    expect(element.querySelector("[data-agent-settings-presets]")).not.toBeNull();
    expect(element.querySelector("[data-tab=tests]")).toBeNull();
    element.querySelector("[data-presets-back]").click();
    await settled();
    expect(element.querySelector("[data-agent-settings-presets]")).toBeNull();
    expect(element.querySelector("[data-tab=tests]").getAttribute("aria-selected")).toBe("true");
});

test("the page says a preset is eight switches and no kind of agent, with a card for each preset and the presets side by side", async () => {
    const {element} = await mount();
    element.querySelector("[data-preset-page]").click();
    await settled();
    const page = element.querySelector("[data-agent-settings-presets]");
    expect(page.textContent).toContain("A preset is a set of eight switches and nothing more");
    expect(page.textContent).toContain("not a type of agent");
    expect(page.textContent).toContain("the same program under every preset");
    expect([...page.querySelectorAll(".setting-preset-card strong")].map((name) => name.textContent)).toEqual(["Builder", "Orchestrator", "Custom"]);
    expect([...page.querySelectorAll("th")].map((cell) => cell.textContent)).toEqual(["Switch", "Builder", "Orchestrator", "Now"]);
    expect(page.querySelector(`[data-compare-row="${AUTO}"]`).dataset.differs).toBe("true");
    expect(page.querySelector(`[data-compare-row="${SENDS}"]`).dataset.differs).toBe("false");
});

test("Fill in on the page fills the form with that preset and the table shows it under Now", async () => {
    const {element} = await mount();
    element.querySelector("[data-preset-page]").click();
    await settled();
    const fills = [...element.querySelectorAll("[data-preset-fill]")];
    expect(fills.map((button) => button.textContent)).toEqual(["Fill in Builder", "Fill in Orchestrator"]);
    fills[1].click();
    await settled();
    const now = [...element.querySelector(`[data-compare-row="${AUTO}"]`).querySelectorAll("td")].map((cell) => cell.textContent);
    expect(now.slice(1)).toEqual(["On", "Off", "Off"]);
    element.querySelector("[data-presets-back]").click();
    await settled();
    expect(marked(element)).toEqual(["orchestrator"]);
});

test("a viewer who may only read can neither pick nor fill a preset", async () => {
    const {element} = await mount({readOnly: true});
    element.querySelector("[data-preset=orchestrator]").click();
    await settled();
    expect(marked(element)).toEqual(["builder"]);
    element.querySelector("[data-preset-page]").click();
    await settled();
    expect(element.querySelector("[data-preset-fill]")).toBeNull();
});
