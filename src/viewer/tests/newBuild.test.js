import {expect, test} from "vitest";
import {reloadIfNewBuild} from "../src/windows/staleBuild.js";

const pageOf = (name) => new DOMParser().parseFromString(`<script type="module" src="/viewer/assets/index-${name}.js"></script>`, "text/html");
const serving = (name) => async () => ({ok: true, text: async () => pageOf(name).documentElement.outerHTML});

test.each([
    ["a new build", "new", true],
    ["the same build", "old", false],
])("a tab told the server serves %s reloads only for a new one", async (_, served, reloads) => {
    let reloaded = false;
    expect(await reloadIfNewBuild(pageOf("old"), serving(served), () => (reloaded = true))).toBe(reloads);
    expect(reloaded).toBe(reloads);
});

test("a server that does not answer reloads nothing", async () => {
    let reloaded = false;
    expect(await reloadIfNewBuild(pageOf("old"), async () => { throw new Error("gone"); }, () => (reloaded = true))).toBe(false);
    expect(await reloadIfNewBuild(pageOf("old"), async () => ({ok: false}), () => (reloaded = true))).toBe(false);
    expect(reloaded).toBe(false);
});
