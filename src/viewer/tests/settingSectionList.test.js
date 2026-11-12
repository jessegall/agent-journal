import {afterEach, expect, test, vi} from "vitest";
import {SettingSectionList} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const SECTIONS = [{key: "approvals", title: "Approvals"}, {key: "tests", title: "Tests"}];

afterEach(() => vi.unstubAllGlobals());

test("the sections are listed under their heading and the first is marked", () => {
    const list = drawnSettingComponent(SettingSectionList, {sections: SECTIONS});
    expect(list.element.querySelector(".head").textContent).toBe("On this tab");
    expect([...list.element.querySelectorAll("[data-section-link]")].map((link) => link.textContent)).toEqual(["Approvals", "Tests"]);
    expect(list.element.querySelector("[data-section-link=approvals]").classList.contains("on")).toBe(true);
});

test("a click asks for the section by its key and marks it", async () => {
    const list = drawnSettingComponent(SettingSectionList, {sections: SECTIONS});
    list.element.querySelector("[data-section-link=tests]").click();
    await list.settled();
    expect(list.emitted.choose).toEqual(["tests"]);
    expect(list.element.querySelector("[data-section-link=tests]").classList.contains("on")).toBe(true);
});

test("the section in view is marked", async () => {
    let report = null;
    vi.stubGlobal("IntersectionObserver", class {
        constructor(callback) { report = callback; }
        observe() {}
        disconnect() {}
    });
    const scope = document.createElement("div");
    scope.innerHTML = '<section data-section="approvals"></section><section data-section="tests"></section>';
    const list = drawnSettingComponent(SettingSectionList, {sections: SECTIONS, scope});
    await list.settled();
    report([{isIntersecting: true, target: scope.querySelector('[data-section="tests"]')}]);
    await list.settled();
    expect(list.element.querySelector("[data-section-link=tests]").classList.contains("on")).toBe(true);
    expect(list.element.querySelector("[data-section-link=approvals]").classList.contains("on")).toBe(false);
});
