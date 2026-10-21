import {describe, expect, test} from "vitest";
import {pluginFrom} from "../src/composables/plugins.js";
import {settingGroups, visibleSettings} from "../src/domain/pluginSettings.js";
import {resets, resettable} from "../src/domain/settingsCatalog.js";

const plugin = (schema, settings = {}) => pluginFrom({table: "plugins", id: 4, name: "standup", manifest: {title: "Standup"}, settings, schema, status: "on", enabled: true, source: "", commit_sha: "", last_fault: "", failed_at: null});

describe("plugin settings", () => {
    test("every setting of the schema shows, with its saved value", () => {
        const shown = plugin([{key: "mode", kind: "choice", choices: ["a", "b"], default: "a"}, {key: "extra", kind: "text"}], {mode: "b"});
        expect(visibleSettings(shown).map((s) => [s.key, s.value])).toEqual([
            ["mode", "b"],
            ["extra", ""],
        ]);
    });

    test("the settings are one group that counts its switches", () => {
        const groups = settingGroups(plugin([{key: "one", kind: "flag", default: true}, {key: "two", kind: "text"}]));
        expect(groups.map((g) => g.name)).toEqual([""]);
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
