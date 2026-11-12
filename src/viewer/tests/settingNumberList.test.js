import {expect, test} from "vitest";
import {SettingNumberList} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const typed = (list, index, text) => {
    const input = list.element.querySelector(`[data-entry="${index}"]`);
    input.value = text;
    input.dispatchEvent(new Event("input"));
};

test("a number list emits numbers", () => {
    const list = drawnSettingComponent(SettingNumberList, {modelValue: [45, 60]});
    typed(list, 1, "90");
    expect(list.emitted["update:modelValue"]).toEqual([[45, 90]]);
});

test("a word is refused with the rule and nothing is emitted", async () => {
    const list = drawnSettingComponent(SettingNumberList, {modelValue: [45]});
    typed(list, 0, "soon");
    await list.settled();
    expect(list.element.querySelector("[role=alert]").textContent).toBe("Use numbers only.");
    expect(list.emitted["update:modelValue"]).toBeUndefined();
});

test("the rule goes away and the numbers are emitted once the entry is a number", async () => {
    const list = drawnSettingComponent(SettingNumberList, {modelValue: [45]});
    typed(list, 0, "soon");
    typed(list, 0, "50");
    await list.settled();
    expect(list.element.querySelector("[role=alert]")).toBeNull();
    expect(list.emitted["update:modelValue"]).toEqual([[50]]);
});
