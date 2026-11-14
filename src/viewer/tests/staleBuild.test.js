import {expect, test} from "vitest";
import {forgetBuildReload, isStaleBuild, reloadForNewBuild} from "../src/windows/staleBuild.js";

function memory() {
    const kept = new Map();
    return {getItem: (key) => kept.get(key) ?? null, setItem: (key, value) => kept.set(key, value), removeItem: (key) => kept.delete(key)};
}

const STALE = new Error("The requested module '@journal/window-kit' does not provide an export named 'RunningCommand'");

test("a window file newer than the kit in memory is a stale build, and another load failure is not", () => {
    expect(isStaleBuild(STALE)).toBe(true);
    expect(isStaleBuild(new Error("Failed to fetch dynamically imported module"))).toBe(false);
});

test("a stale build reloads the page once, and again only after a window loaded", () => {
    const storage = memory();
    let reloads = 0;
    const reload = () => reloads++;
    expect(reloadForNewBuild(STALE, storage, reload)).toBe(true);
    expect(reloadForNewBuild(STALE, storage, reload)).toBe(false);
    expect(reloads).toBe(1);
    forgetBuildReload(storage);
    expect(reloadForNewBuild(STALE, storage, reload)).toBe(true);
    expect(reloads).toBe(2);
});
