import {expect, test} from "vitest";
import {pluginPages} from "../src/domain/pluginPages.js";

const plugin = (name, fields = {}) => ({name, enabled: true, status: "on", manifest: {title: name, dashboard: {name: "sins", title: "Sins"}}, ...fields});

test("each enabled plugin with a dashboard brings a page to the sidebar, opened by its dashboard's name", () => {
    expect(pluginPages([plugin("code-commandments"), plugin("off", {enabled: false}), plugin("plain", {manifest: {title: "plain"}})])).toEqual([
        {key: "code-commandments.sins", plugin: "code-commandments", open: "sins", title: "Sins", icon: "plug", state: "on"},
    ]);
});
