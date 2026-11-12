import {expect, test} from "vitest";
import {SettingPresetCompareTable} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const ROWS = [{key: "auto", title: "Auto mode"}, {key: "merger", title: "Merger"}, {key: "writes", title: "Main agent writes code"}];
const PRESETS = [
    {key: "builder", name: "Builder", values: {auto: true, merger: true, writes: true}},
    {key: "orchestrator", name: "Orchestrator", values: {auto: false, merger: true, writes: false}},
];
const table = (now) => drawnSettingComponent(SettingPresetCompareTable, {rows: ROWS, presets: PRESETS, now});
const row = (drawn, key) => drawn.element.querySelector(`[data-compare-row=${key}]`);

test("the columns are the switch, each preset and the form as it is now", () => {
    const drawn = table({auto: true, merger: true, writes: true});
    expect([...drawn.element.querySelectorAll("th")].map((cell) => cell.textContent)).toEqual(["Switch", "Builder", "Orchestrator", "Now"]);
});

test("each row says On or Off for each preset and for now", () => {
    const drawn = table({auto: true, merger: false, writes: true});
    expect([...row(drawn, "auto").querySelectorAll("td")].map((cell) => cell.textContent)).toEqual(["Auto mode", "On", "Off", "On"]);
    expect([...row(drawn, "merger").querySelectorAll("td")].map((cell) => cell.textContent)).toEqual(["Merger", "On", "On", "Off"]);
});

test("a row where the presets differ is marked and a row where they agree is not", () => {
    const drawn = table({auto: true, merger: true, writes: true});
    expect(row(drawn, "auto").dataset.differs).toBe("true");
    expect(row(drawn, "writes").dataset.differs).toBe("true");
    expect(row(drawn, "merger").dataset.differs).toBe("false");
    expect(row(drawn, "merger").classList.contains("differs")).toBe(false);
});
