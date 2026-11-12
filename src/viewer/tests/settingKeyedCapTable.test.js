import {expect, test} from "vitest";
import {SettingKeyedCapTable} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const ROWS = [{key: "main", name: "Main agent"}, {key: "worker", name: "Workers"}, {key: "merger", name: "Merger"}];
const SIZES = [100000, 200000, 400000];
const table = (modelValue) => drawnSettingComponent(SettingKeyedCapTable, {modelValue, rows: ROWS, sizes: SIZES, defaultCap: 400000});
const row = (drawn, key) => drawn.element.querySelector(`[data-cap-row="${key}"]`);
const press = (drawn, key, mode) => row(drawn, key).querySelector(`[data-segment="${mode}"]`).click();

test("a row has a name, three choices and a line saying where its size is set", () => {
    const drawn = table(["worker:200000", "merger:none"]);
    expect(ROWS.map((entry) => row(drawn, entry.key).querySelector(".name").textContent)).toEqual(["Main agent", "Workers", "Merger"]);
    expect([...row(drawn, "main").querySelectorAll("[data-segment]")].map((button) => button.textContent)).toEqual(["Default cap", "A size", "No cap"]);
    expect(row(drawn, "main").querySelector(".where").textContent).toBe("Uses the size set for every agent: 400k");
    expect(row(drawn, "worker").querySelector(".where").textContent).toBe("Its own size");
    expect(row(drawn, "merger").querySelector(".where").textContent).toBe("Never compacted at a size");
});

test("the choice that holds is marked and a size shows only on a row with its own size", () => {
    const drawn = table(["worker:200000"]);
    expect(row(drawn, "main").querySelector('[data-segment="default"]').getAttribute("aria-checked")).toBe("true");
    expect(row(drawn, "worker").querySelector('[data-segment="size"]').getAttribute("aria-checked")).toBe("true");
    expect(row(drawn, "worker").querySelector("select").value).toBe("200000");
    expect(row(drawn, "main").querySelector("select")).toBeNull();
});

test("No cap on a row emits none for its kind", () => {
    const drawn = table([]);
    press(drawn, "worker", "none");
    expect(drawn.emitted["update:modelValue"]).toEqual([["worker:none"]]);
});

test("A size on a row emits the default size when it is one of the sizes", () => {
    const drawn = table([]);
    press(drawn, "main", "size");
    expect(drawn.emitted["update:modelValue"]).toEqual([["main:400000"]]);
});

test("choosing another size emits it for that kind and keeps the other kinds", () => {
    const drawn = table(["main:none", "worker:200000"]);
    const select = row(drawn, "worker").querySelector("select");
    select.value = "100000";
    select.dispatchEvent(new Event("change"));
    expect(drawn.emitted["update:modelValue"]).toEqual([["main:none", "worker:100000"]]);
});

test("a row put back on the default cap is left out of the list", () => {
    const drawn = table(["main:none", "worker:200000"]);
    press(drawn, "worker", "default");
    expect(drawn.emitted["update:modelValue"]).toEqual([["main:none"]]);
});

test("an entry for a kind that has no row is kept", () => {
    const drawn = table(["designer:150000"]);
    press(drawn, "main", "none");
    expect(drawn.emitted["update:modelValue"]).toEqual([["main:none", "designer:150000"]]);
});

test("a disabled table cannot be changed", () => {
    const drawn = drawnSettingComponent(SettingKeyedCapTable, {modelValue: [], rows: ROWS, sizes: SIZES, defaultCap: 400000, disabled: true});
    expect([...drawn.element.querySelectorAll("[data-segment]")].every((button) => button.disabled)).toBe(true);
});
