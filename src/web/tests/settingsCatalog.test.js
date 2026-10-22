// @vitest-environment node
import {describe, expect, test} from "vitest";
import {
    TABS,
    catalog,
    groupRows,
    inTab,
    navGroups,
    navSections,
    same,
    settingChanges,
    timingEvery,
    timingMarks,
    timingUnit,
    timingWords,
    untitled,
} from "../src/domain/settingsCatalog.js";

describe("timing words", () => {
    test.each([
        [undefined, ""],
        [{}, ""],
        [{on: "idle"}, "when the agent stops"],
        [{on: "unknown"}, "unknown"],
        [{unit: "percent", at: [50, 80]}, "at 50, 80% of context"],
        [{unit: "percent", every: 10}, "every 10% of context"],
        [{unit: "minutes", every: 60}, "every hour"],
        [{unit: "minutes", every: 1440}, "every day"],
        [{unit: "minutes", every: 120}, "every 2 hours"],
        [{unit: "minutes", every: 5}, "every 5 minutes"],
        [{unit: "uses", every: 1}, "every tool call"],
        [{unit: "uses", every: 20}, "every 20 tool calls"],
    ])("%j reads %j", (when, words) => expect(timingWords(when)).toBe(words));
});

describe("timing edits", () => {
    test("a count must be a positive number", () => {
        expect(timingEvery({unit: "uses"}, "0")).toBeNull();
        expect(timingEvery({unit: "uses"}, "abc")).toBeNull();
        expect(timingEvery({unit: "uses"}, "7")).toEqual({every: 7, unit: "uses"});
        expect(timingEvery({at: [50]}, "5")).toEqual({every: 5, unit: "percent"});
        expect(timingEvery({}, "5")).toEqual({every: 5, unit: "percent"});
    });

    test("a unit keeps the count and an event drops it", () => {
        expect(timingUnit({every: 3}, "uses")).toEqual({every: 3, unit: "uses"});
        expect(timingUnit({}, "minutes")).toEqual({every: 5, unit: "minutes"});
        expect(timingUnit({}, "percent")).toEqual({every: 10, unit: "percent"});
        expect(timingUnit({every: 3}, "idle")).toEqual({on: "idle"});
    });

    test("marks are percentages between 1 and 100", () => {
        expect(timingMarks("50, 80%")).toEqual({unit: "percent", at: [50, 80]});
        expect(timingMarks("0 150 abc")).toBeNull();
        expect(timingMarks("")).toBeNull();
    });
});

describe("setting changes", () => {
    test("same ignores key order", () => {
        expect(same({a: 1, b: {c: 2, d: 3}}, {b: {d: 3, c: 2}, a: 1})).toBe(true);
        expect(same({a: 1}, {a: 2})).toBe(false);
    });

    test("a value is written under its key beside the saved ones", () => {
        const target = {path: ["features", "nudges"]};
        expect(settingChanges(target, true, {features: {other: 1}})).toEqual({features: {other: 1, nudges: true}});
        expect(settingChanges(target, false, {})).toEqual({features: {nudges: false}});
    });

    test("an inverted switch stores the opposite", () => {
        expect(settingChanges({path: ["a", "b"], invert: true}, true, {})).toEqual({a: {b: false}});
    });

    test("a sparse value equal to its shipped one is sent as null, which clears it; the other keys are untouched", () => {
        const target = {path: ["a", "b"], sparse: true, shipped: 5};
        expect(settingChanges(target, 5, {a: {b: 9, c: 1}})).toEqual({a: {c: 1, b: null}});
        expect(settingChanges(target, 6, {a: {c: 1}})).toEqual({a: {c: 1, b: 6}});
    });

    test("defaults keep the saved values that differ and clear the ones equal to their default", () => {
        const target = {path: ["a", "b"], defaults: {b: 1, c: 2}};
        expect(settingChanges(target, 3, {a: {b: 1, c: 9, other: 7}})).toEqual({a: {c: 9, b: 3}});
        expect(settingChanges(target, 4, {a: {b: 7, c: 2}})).toEqual({a: {c: null, b: 4}});
    });
});

describe("untitled groups", () => {
    test("a group holding only a danger row is drawn without a heading and left out of the side list", () => {
        expect(untitled({items: [], danger: [{key: "stop"}]})).toBe(true);
        expect(untitled({items: [{key: "color"}], danger: []})).toBe(false);
        expect(untitled({items: [{key: "color"}], danger: [{key: "stop"}]})).toBe(false);
    });
});

test("the sidebar folds a plugin's slash-named groups under one heading each", () => {
    const groups = [
        {key: "a", title: "Folders"},
        {key: "b", title: "backend/absence"},
        {key: "c", title: "backend/class-layout"},
        {key: "d", title: "python/flow"},
    ];
    expect(navGroups(groups).map((g) => [g.key, g.title])).toEqual([
        ["a", "Folders"],
        ["b", "Backend"],
        ["d", "Python"],
    ]);
});

test("the sidebar leaves out a heading with nothing under it", () => {
    const shown = {key: "u", title: "Updates", items: [{}], danger: []};
    const unnamed = {key: "s", title: "Stop", items: [], danger: [{}]};
    const sections = [
        {title: "Project", groups: [shown]},
        {title: "System", groups: [unnamed]},
        {title: "Empty", groups: []},
    ];
    expect(navSections(sections).map((s) => [s.title, s.groups.map((g) => g.key)])).toEqual([["Project", ["u"]]]);
});

describe("the Agent tab", () => {
    test("it is the first tab and holds the groups the server places in it", () => {
        expect(TABS[0].key).toBe("agent");
        const sections = [
            {
                title: "Agent",
                groups: [
                    {key: "agent", tab: "agent"},
                    {key: "viewer", tab: "features"},
                ],
            },
            {title: "Chat", groups: [{key: "chat", tab: "features"}]},
        ];
        expect(inTab(sections, "agent").map((s) => s.groups.map((g) => g.key))).toEqual([["agent"]]);
        expect(inTab(sections, "features").map((s) => s.groups.map((g) => g.key))).toEqual([["viewer"], ["chat"]]);
    });
});

describe("the manifest's features", () => {
    const option = (name, kind, more = {}) => ({key: `workers.${name}`, name, title: name, abstract: `About ${name}`, kind, default: null, unit: "", choices: [], provider: "", read_by: [], ...more});
    const spec = {
        features: [
            {
                name: "workers",
                title: "Workers",
                help: "Agents sent to write a job each.",
                default: true,
                options: [
                    option("timeout_minutes", "number", {default: 60, unit: "min"}),
                    option("mode", "choice", {default: "builder", choices: ["builder", "orchestrator", "solo"]}),
                    option("model", "model", {default: "sonnet", choices: ["opus", "sonnet"], provider: "claude"}),
                ],
            },
        ],
        groups: [{key: "workers", title: "Workers", line: "Agents sent to write a job each.", section: "Agent", tab: "agent", lead: "workers"}],
    };
    const rows = (settings) => groupRows(catalog(spec, settings)[0].groups[0]);

    test("a feature leads its group with its switch, then a row per option with its saved value", () => {
        const got = rows({workers: {mode: "solo"}, features: {workers: true}});
        expect(got.map((r) => [r.key, r.kind, r.value])).toEqual([
            ["workers", "switch", true],
            ["workers:timeout_minutes", "number", 60],
            ["workers:mode", "choice", "solo"],
            ["workers:model", "model", "sonnet"],
        ]);
    });

    test("a choice offers its choices, and a saved value it no longer offers reads as the default", () => {
        const mode = rows({workers: {mode: "boss"}}).find((r) => r.key === "workers:mode");
        expect(mode.options.map((o) => o.label)).toEqual(["Builder", "Orchestrator", "Solo"]);
        expect(mode.value).toBe("builder");
    });

    test("an option's help says only what it does", () => {
        const [, timeout, , model] = rows({});
        expect(timeout.hint).toBe("About timeout_minutes.");
        expect(model.hint).toBe("About model.");
        expect(model.provider).toBe("claude");
    });

    test("changing an option writes it under its feature and leaves the rest of the feature alone", () => {
        const mode = rows({}).find((r) => r.key === "workers:mode");
        expect(settingChanges(mode.target, "solo", {workers: {timeout_minutes: 30}})).toEqual({workers: {timeout_minutes: 30, mode: "solo"}});
    });

    test("a feature switched off reads as off", () => {
        expect(rows({features: {workers: false}})[0].value).toBe(false);
    });
});

describe("the Developer tab", () => {
    test("it follows Environments and holds the groups the server places in it", () => {
        const keys = TABS.map((t) => t.key);
        expect(keys.indexOf("developer")).toBe(keys.indexOf("environments") + 1);
        const sections = [{title: "Developer", groups: [{key: "faults", tab: "developer"}, {key: "updates", tab: "system"}]}];
        expect(inTab(sections, "developer")[0].groups.map((g) => g.key)).toEqual(["faults"]);
    });
});
