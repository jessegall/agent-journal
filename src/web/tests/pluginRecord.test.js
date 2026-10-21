import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";

const pluginRecord = vi.hoisted(() => vi.fn());
vi.mock("../src/api/client.js", () => ({api: {pluginRecord}}));

test("a plugin's record lists what it did, a row it wrote opening, and says what cannot be listed", async () => {
    pluginRecord.mockResolvedValue({
        record: [
            {time: 1760000100, kind: "row", text: "made task log 4", ref: "todo:3"},
            {time: 1760000050, kind: "command", text: 'ran journal task log 3 "echoed"', ref: ""},
            {time: 1760000000, kind: "said", text: "held at tool_starting: echo refuses a forbidden tool", ref: ""},
        ],
    });
    const {default: PluginRecord} = await import("../src/pages/PluginRecord.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(PluginRecord, {plugin: {name: "echo", title: "Echo"}})});
    app.directive("tip", {});
    app.mount(host);
    await vi.waitFor(() => expect(document.body.querySelectorAll(".record-line").length).toBe(3));
    await nextTick();
    const lines = [...document.body.querySelectorAll(".record-line .record-text")].map((e) => [e.tagName, e.textContent.trim()]);
    expect(lines[0]).toEqual(["BUTTON", "made task log 4"]);
    expect(lines[2]).toEqual(["SPAN", "held at tool_starting: echo refuses a forbidden tool"]);
    expect(document.body.textContent).toContain("cannot be listed here");
    app.unmount();
    host.remove();
});
