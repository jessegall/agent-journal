import {describe, expect, test, vi} from "vitest";
import {effectScope} from "vue";

const whole = {table: "plugins", id: 4, name: "standup", manifest: {title: "Standup"}, settings: {}, schema: [{key: "mode", kind: "text"}], status: "on", enabled: true, source: "", commit_sha: "", last_fault: "", failing_since: null};
const list = vi.hoisted(() => vi.fn());

vi.mock("../src/api/client.js", () => ({api: {list}}));
vi.mock("../src/sync/rows.js", () => ({rows: () => [{table: "plugins", id: 4, updated_at: "1"}]}));

describe("installed plugins", () => {
    test("the Plugins page reads the plugins whole, with each one's settings schema", async () => {
        list.mockResolvedValue({rows: [whole]});
        const {installedPlugins} = await import("../src/composables/plugins.js");
        const plugins = effectScope().run(installedPlugins);
        await vi.waitFor(() => expect(plugins.value.length).toBe(1));
        expect(list).toHaveBeenCalledWith("plugins");
        expect(plugins.value.map((p) => [p.name, p.title, p.settings.length])).toEqual([["standup", "Standup", 1]]);
    });
});
