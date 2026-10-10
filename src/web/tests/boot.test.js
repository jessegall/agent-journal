// @vitest-environment node
import {expect, test, vi} from "vitest";

const order = [];
const later = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 20));

vi.mock("../src/api/client.js", () => ({
    api: {
        manifest: () => {
            order.push("manifest asked");
            return later({environment: "main"});
        },
        identity: () => later({}),
        pages: () => later([]),
    },
}));
vi.mock("../src/route.js", () => ({route: {value: {env: "main", page: ""}}, go: vi.fn()}));
vi.mock("../src/domain/spec.js", () => ({types: {value: []}}));
vi.mock("../src/sync/rows.js", () => ({
    load: () => {
        order.push("messages asked");
        return later([]);
    },
    recallEvents: () => {},
    reload: () => Promise.resolve(),
}));
vi.mock("../src/sync/stream.js", () => ({listen: () => order.push("listening")}));

test("the first messages are asked for together with the manifest, not after it, and the viewer is booted once they arrive", async () => {
    const {store} = await import("../src/state/store.js");
    const {boot} = await import("../src/sync/boot.js");
    await boot();
    expect(order.slice(0, 2)).toEqual(["messages asked", "manifest asked"]);
    expect(store.booted).toBe(true);
});
