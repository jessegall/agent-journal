// @vitest-environment node
import {describe, expect, test, vi} from "vitest";

const reloads = [];
vi.mock("../src/platform/busyField.js", () => ({reloadWhenFree: (w) => reloads.push(w)}));
vi.mock("../src/platform/storage.js", () => ({remember: () => {}, remembered: () => ""}));

globalThis.window = {};
const {followServer, otherServer} = await import("../src/state/updating.js");

describe("the page follows the server it came from", () => {
    test("the same server answering again reloads nothing, a restart of the same version reloads once the page is free, and so does a new version", () => {
        const first = {version: "4.5.0", started: 100, ready: true, updating: "", countdown: null};
        followServer(first);
        followServer({...first});
        expect(reloads.length).toBe(0);
        followServer({...first, started: 200});
        expect(reloads.length).toBe(1);
        expect(otherServer({version: "4.6.0", started: 100})).toBe(true);
    });
});
