import {describe, expect, test, vi} from "vitest";
import {effectScope, nextTick} from "vue";

const whole = {n: 4, title: "Standup", abstract: "", data: {version: "1", manifest: {name: "standup", settings: {mode: {type: "text"}}}}};
const list = vi.hoisted(() => vi.fn());

vi.mock("../src/api/client.js", () => ({api: {list}}));
vi.mock("../src/sync/rows.js", () => ({rows: () => [{n: 4, updated: 1, data: {manifest: {name: "standup"}}}]}));

describe("installed plugins", () => {
    test("the Plugins page asks for the whole plugin rows, because the dashboard's rows keep only a few manifest keys", async () => {
        list.mockResolvedValue({rows: [whole]});
        const {installedPlugins} = await import("../src/composables/plugins.js");
        const plugins = effectScope().run(installedPlugins);
        await vi.waitFor(() => expect(plugins.value.length).toBe(1));
        expect(list).toHaveBeenCalledWith("plugin");
        expect(plugins.value.map((p) => [p.name, p.settings.length])).toEqual([["standup", 1]]);
    });
});
