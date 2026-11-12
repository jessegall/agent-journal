import {expect, test} from "vitest";
import {ChangeFoot} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const AUTO = {key: "auto", title: "Auto mode", from: "on", to: "off"};
const SIZE = {key: "size", title: "Context size", from: "100000", to: "200000"};
const foot = (props) => drawnSettingComponent(ChangeFoot, props);
const note = (drawn) => drawn.element.querySelector("[data-settings-note]").textContent;
const save = (drawn) => drawn.element.querySelector("[data-settings-apply]");
const cancel = (drawn) => drawn.element.querySelector("[data-settings-cancel]");

test("with no change the foot says so and Save is off", () => {
    const drawn = foot({changes: [], canSave: false});
    expect(note(drawn)).toBe("No changes.");
    expect(save(drawn).disabled).toBe(true);
});

test("one change is named with its new value", () => {
    expect(note(foot({changes: [AUTO], canSave: true}))).toBe("1 change: Auto mode off");
});

test("two changes are both named", () => {
    expect(note(foot({changes: [AUTO, SIZE], canSave: true}))).toBe("2 changes: Auto mode off, Context size: 200000");
});

test("Save asks to save and Cancel asks to cancel", () => {
    const drawn = foot({changes: [AUTO], canSave: true});
    expect(save(drawn).textContent).toBe("Save");
    save(drawn).click();
    cancel(drawn).click();
    expect(drawn.emitted.save).toHaveLength(1);
    expect(drawn.emitted.cancel).toHaveLength(1);
});

test("a stale foot leaves only Cancel working and says why", () => {
    const drawn = foot({changes: [AUTO], canSave: false, reason: "These settings changed since you opened them. Cancel to read them again."});
    expect(note(drawn)).toBe("These settings changed since you opened them. Cancel to read them again.");
    expect(save(drawn).disabled).toBe(true);
    expect(cancel(drawn).disabled).toBe(false);
});

test("the reason of a refusal or a blank number is shown instead of the changes", () => {
    const drawn = foot({changes: [AUTO], canSave: false, reason: "A number is missing."});
    expect(note(drawn)).toBe("A number is missing.");
    expect(drawn.element.querySelector("[data-settings-note]").classList.contains("bad")).toBe(true);
});

test("while saving the foot says so and neither button works", () => {
    const drawn = foot({changes: [AUTO], canSave: false, pending: true});
    expect(note(drawn)).toBe("Saving.");
    expect(cancel(drawn).disabled).toBe(true);
});

test("the environment is named when there is nothing to save", () => {
    expect(note(foot({changes: [], environment: "main"}))).toBe("No changes. For the environment main.");
});
