import {nextTick} from "vue";
import {expect, test} from "vitest";
import {rememberedRef, rememberedValue} from "../src/windows/rememberedState.js";

function memory() {
    const kept = new Map();
    return {getItem: (key) => kept.get(key) ?? null, setItem: (key, value) => kept.set(key, value)};
}

test("a state changed on the page is there again after a reload", async () => {
    const storage = memory();
    const first = rememberedRef("activity", false, storage);
    expect(first.value).toBe(false);
    first.value = true;
    await nextTick();
    expect(rememberedRef("activity", false, storage).value).toBe(true);
});

test("storage that fails gives the fallback and breaks nothing", async () => {
    const storage = {getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }};
    const state = rememberedRef("activity", false, storage);
    state.value = true;
    await nextTick();
    expect(state.value).toBe(true);
});

test("the project name a page kept is read before any component runs, and is empty when none was kept", async () => {
    const storage = memory();
    expect(rememberedValue("last-project", "", storage)).toBe("");
    const project = rememberedRef("last-project", "", storage);
    project.value = "Worldwatch Market";
    await nextTick();
    expect(rememberedValue("last-project", "", storage)).toBe("Worldwatch Market");
});
