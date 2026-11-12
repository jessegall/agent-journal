import {expect, test} from "vitest";
import {isFull, SettingUsageBar} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a count under its limit says n of limit and does not say full", () => {
    const bar = drawnSettingComponent(SettingUsageBar, {count: 2, limit: 4});
    expect(bar.element.querySelector(".words").textContent.trim()).toBe("2 of 4");
    expect(bar.element.querySelector("[data-usage-full]")).toBeNull();
    expect(bar.element.querySelector(".filled").style.width).toBe("50%");
});

test("a count that reaches its limit turns amber and says full", () => {
    const bar = drawnSettingComponent(SettingUsageBar, {count: 4, limit: 4});
    expect(bar.element.querySelector(".setting-usage").classList.contains("full")).toBe(true);
    expect(bar.element.querySelector("[data-usage-full]").textContent).toBe("full");
});

test("a count over its limit shows how much is over", () => {
    const bar = drawnSettingComponent(SettingUsageBar, {count: 5, limit: 4});
    expect(bar.element.querySelector("i").style.width).toBe("20%");
});

test("with no limit it shows the count alone and no bar", () => {
    const bar = drawnSettingComponent(SettingUsageBar, {count: 7, limit: null});
    expect(bar.element.querySelector(".words").textContent.trim()).toBe("7");
    expect(bar.element.querySelector(".bar")).toBeNull();
});

test("a limit of 0 is never full", () => {
    expect(isFull(3, 0)).toBe(false);
    expect(isFull(4, 4)).toBe(true);
});
