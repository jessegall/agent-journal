import {expect, test} from "vitest";
import {SettingPerTypeOverrideRow} from "@journal/setting-components";
import {drawnSettingComponent, typedInto as typed} from "./support/settingComponent.js";

const row = (props) => drawnSettingComponent(SettingPerTypeOverrideRow, {label: "Helpers running", everyValue: 4, ownValue: null, ...props});
const source = (drawn) => drawn.element.querySelector("[data-setting-source]").textContent;

test("with no own value the row shows the value of every profile and says so", () => {
    const drawn = row({});
    expect(drawn.element.querySelector("input").value).toBe("4");
    expect(source(drawn)).toBe("Every profile");
    expect(drawn.element.querySelector("[data-back-to-every-profile]")).toBeNull();
});

test("an own value is shown instead, with the source word Own value and a way back", () => {
    const drawn = row({ownValue: 2});
    expect(drawn.element.querySelector("input").value).toBe("2");
    expect(source(drawn)).toBe("Own value");
    expect(drawn.element.querySelector("[data-back-to-every-profile]")).not.toBeNull();
});

test("an edit emits an own value and the source word changes once it is kept", async () => {
    const drawn = row({});
    typed(drawn, "6");
    expect(drawn.emitted["update:ownValue"]).toEqual([6]);
    drawn.state.ownValue = 6;
    await drawn.settled();
    expect(source(drawn)).toBe("Own value");
});

test("an edit never changes the value of every profile", async () => {
    const drawn = row({});
    typed(drawn, "6");
    drawn.state.ownValue = 6;
    await drawn.settled();
    expect(drawn.state.everyValue).toBe(4);
    drawn.element.querySelector("[data-back-to-every-profile]").click();
    expect(drawn.emitted["update:ownValue"]).toEqual([6, null]);
    drawn.state.ownValue = null;
    await drawn.settled();
    expect(drawn.element.querySelector("input").value).toBe("4");
});

test("going back to every profile gives the own value up and the source word returns", async () => {
    const drawn = row({ownValue: 2});
    drawn.element.querySelector("[data-back-to-every-profile]").click();
    expect(drawn.emitted["update:ownValue"]).toEqual([null]);
    drawn.state.ownValue = null;
    await drawn.settled();
    expect(source(drawn)).toBe("Every profile");
});
