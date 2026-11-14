import {expect, test} from "vitest";
import {SettingThreeWayCap} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const SIZES = [100000, 200000, 400000];
const cap = (props) => drawnSettingComponent(SettingThreeWayCap, {sizes: SIZES, kindValue: 400000, ownValue: null, ...props});
const line = (drawn) => drawn.element.querySelector("[data-cap-line]").textContent;

test("the mode of its kind shows the size of its kind and says it is set in Advanced", () => {
    expect(line(cap({mode: "kind"}))).toBe("400k for its type, set in Advanced");
    expect(line(cap({mode: "kind", kindValue: null}))).toBe("No cap for its type, set in Advanced");
});

test("the mode of its own cap shows a size to choose, the own size when there is one", () => {
    const drawn = cap({mode: "own", ownValue: 200000});
    expect(drawn.element.querySelector("select").value).toBe("200000");
    expect(drawn.element.querySelector("[data-cap-line]")).toBeNull();
});

test("the mode of no cap says the type is never compacted at a size", () => {
    expect(line(cap({mode: "none"}))).toBe("This type is never compacted at a size");
});

test("the mode that holds is the one marked", () => {
    const drawn = cap({mode: "none"});
    expect(drawn.element.querySelector('[data-segment="none"]').getAttribute("aria-checked")).toBe("true");
    expect(drawn.element.querySelector('[data-segment="kind"]').getAttribute("aria-checked")).toBe("false");
});

test("choosing a mode emits it, with the own size only for its own cap", () => {
    const drawn = cap({mode: "kind", ownValue: 200000});
    drawn.element.querySelector('[data-segment="own"]').click();
    drawn.element.querySelector('[data-segment="none"]').click();
    drawn.element.querySelector('[data-segment="kind"]').click();
    expect(drawn.emitted.change).toEqual([{mode: "own", size: 200000}, {mode: "none", size: null}, {mode: "kind", size: null}]);
});

test("its own cap with no size yet starts at the first size", () => {
    const drawn = cap({mode: "kind"});
    drawn.element.querySelector('[data-segment="own"]').click();
    expect(drawn.emitted.change).toEqual([{mode: "own", size: 100000}]);
});

test("choosing another size emits it for its own cap", () => {
    const drawn = cap({mode: "own", ownValue: 200000});
    const select = drawn.element.querySelector("select");
    select.value = "400000";
    select.dispatchEvent(new Event("change"));
    expect(drawn.emitted.change).toEqual([{mode: "own", size: 400000}]);
});
