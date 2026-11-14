import {expect, test, vi} from "vitest";

const sent = [];
vi.mock("../src/api/transport.js", () => ({
    READ: "read",
    transport: {
        whenFree: (read) => read(),
        joined: (key, read) => read(),
        sent: async (url) => {
            sent.push(url);
            return {ok: true, json: async () => ({keys: {}})};
        },
    },
}));

const {windowData} = await import("../src/windows/windowData.js");

test("a state value left empty is not sent, so the server never sees an empty tab", async () => {
    await windowData("coding.agent-settings", "development", [], {tab: "", rows: "10", unset: null}, undefined);
    expect(sent.at(-1)).toBe("/api/window?environment=development&rows=10");
});

test("a set tab is sent", async () => {
    await windowData("coding.agent-settings", "development", [], {tab: "agents"}, undefined);
    expect(sent.at(-1)).toBe("/api/window?environment=development&tab=agents");
});
