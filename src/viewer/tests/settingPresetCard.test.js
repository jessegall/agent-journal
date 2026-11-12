import {expect, test} from "vitest";
import {SettingPresetCard} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a card shows the name of the preset and one line about it", () => {
    const card = drawnSettingComponent(SettingPresetCard, {name: "Builder", line: "The main agent writes code itself."});
    expect(card.element.querySelector("strong").textContent).toBe("Builder");
    expect(card.element.querySelector(".line").textContent).toBe("The main agent writes code itself.");
});

test("a card has no Fill in button unless it is asked for", () => {
    expect(drawnSettingComponent(SettingPresetCard, {name: "Builder", line: "A line."}).element.querySelector("[data-preset-fill]")).toBeNull();
});

test("the Fill in button asks to fill the form with the preset", () => {
    const card = drawnSettingComponent(SettingPresetCard, {name: "Builder", line: "A line.", canFill: true});
    const button = card.element.querySelector("[data-preset-fill]");
    expect(button.textContent).toBe("Fill in Builder");
    button.click();
    expect(card.emitted.fill).toHaveLength(1);
});
