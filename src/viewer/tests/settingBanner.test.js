import {expect, test} from "vitest";
import {SettingBanner} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a stale banner says the settings changed and offers nothing to press", () => {
    const banner = drawnSettingComponent(SettingBanner, {kind: "stale"});
    expect(banner.element.textContent).toContain("These settings changed since you opened them.");
    expect(banner.element.querySelector("button")).toBeNull();
    expect(banner.element.querySelector("[data-banner]").getAttribute("role")).toBe("status");
});

test("a refused banner shows the words it is given", () => {
    const banner = drawnSettingComponent(SettingBanner, {kind: "refused", text: "A number is missing."});
    expect(banner.element.textContent).toContain("A number is missing.");
    expect(banner.element.querySelector("[data-banner]").getAttribute("role")).toBe("alert");
});

test("an unreadable banner offers Try again and asks to retry when it is pressed", () => {
    const banner = drawnSettingComponent(SettingBanner, {kind: "unreadable"});
    const retry = banner.element.querySelector("[data-banner-retry]");
    expect(retry.textContent).toBe("Try again");
    retry.click();
    expect(banner.emitted.retry).toHaveLength(1);
});
