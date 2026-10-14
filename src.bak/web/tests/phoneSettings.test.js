import {describe, expect, test} from "vitest";
import {pluginFrom} from "../src/composables/plugins.js";
import {settingGroups, visibleSettings} from "../src/domain/pluginSettings.js";
import {resets, resettable} from "../src/domain/settingsCatalog.js";

const row = (manifest, chosen = {}) =>
    pluginFrom({n: 4, title: "Standup", abstract: "", data: {manifest: {name: "standup", settings: manifest}, settings: {chosen}}});

describe("plugin settings", () => {
    test("a setting that waits on another shows only when it is chosen", () => {
        const plugin = row({mode: {type: "options", options: ["a", "b"], default: "a"}, extra: {when: {mode: "b"}}});
        expect(visibleSettings(plugin).map((s) => s.key)).toEqual(["mode"]);
        const chosen = row({mode: {type: "options", options: ["a", "b"], default: "a"}, extra: {when: {mode: "b"}}}, {mode: "b"});
        expect(visibleSettings(chosen).map((s) => s.key)).toEqual(["mode", "extra"]);
    });

    test("settings group by name and count their switches", () => {
        const plugin = row({one: {type: "flag", group: "Rules", default: true}, two: {type: "text", group: "Rules"}, three: {type: "text"}});
        const groups = settingGroups(plugin);
        expect(groups.map((g) => g.name)).toEqual(["Rules", ""]);
        expect(groups[0].flags.map((s) => s.key)).toEqual(["one"]);
    });
});

describe("going back to the default", () => {
    test("a changed row steps back to its shipped value and timing", () => {
        const changed = {changed: true, value: 3, shipped: 8, timing: {changed: true, shipped: {every: 5}}};
        expect(resettable(changed)).toBe(true);
        expect(resets(changed)).toEqual([["change", 8], ["timing", {every: 5}]]);
    });

    test("an unchanged row has nothing to reset", () => {
        expect(resettable({changed: false, value: 8, shipped: 8})).toBe(false);
        expect(resets({value: 8, shipped: 8})).toEqual([]);
    });
});
