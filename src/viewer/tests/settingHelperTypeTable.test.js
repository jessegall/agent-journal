import {expect, test} from "vitest";
import {SettingHelperTypeTable} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const ROWS = [
    {key: "researcher", name: "Researcher", line: "Reads and reports.", running: 1, runLimit: 4, kept: 3, keptLimit: 8, cap: {text: "400k", where: "Set for its kind", own: false}},
    {key: "planner", name: "Planner", line: "Designs a change.", running: 4, runLimit: 4, kept: 2, keptLimit: null, cap: {text: "150k", where: "Own cap", own: true}},
];
const table = () => drawnSettingComponent(SettingHelperTypeTable, {rows: ROWS});

test("the columns are the type, what it does, running, kept, the context cap and the arrow", () => {
    expect([...table().element.querySelectorAll(".cols span")].map((cell) => cell.textContent)).toEqual(["Helper type", "What it does", "Running", "Kept", "Context cap", ""]);
});

test("a row shows the type, what it does, its counts against their limits and its cap with where it comes from", () => {
    const row = table().element.querySelector('[data-type-row="researcher"]');
    expect(row.querySelector(".name").textContent).toBe("Researcher");
    expect(row.querySelector(".line").textContent).toBe("Reads and reports.");
    expect([...row.querySelectorAll(".words")].map((words) => words.textContent.trim())).toEqual(["1 of 4", "3 of 8"]);
    expect(row.querySelector(".cap small").textContent).toBe("Set for its kind");
});

test("a type at its running limit says full and a type with no kept limit shows its count alone", () => {
    const row = table().element.querySelector('[data-type-row="planner"]');
    expect(row.querySelector("[data-usage-full]")).not.toBeNull();
    expect(row.querySelectorAll(".words")[1].textContent.trim()).toBe("2");
});

test("pressing a row asks to open its type by its key", () => {
    const drawn = table();
    drawn.element.querySelector('[data-type-row="planner"]').click();
    expect(drawn.emitted.open).toEqual(["planner"]);
});

test("there is no Edit button", () => {
    expect(table().element.textContent).not.toContain("Edit");
});
