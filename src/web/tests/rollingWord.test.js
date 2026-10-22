import {createApp, h, nextTick, ref} from "vue";
import {expect, test} from "vitest";
import RollingWord from "../src/kit/RollingWord.vue";

test("a word that changes rolls: the old one leaves and the new one comes in, both in the same place", async () => {
    const into = document.createElement("div");
    document.body.append(into);
    const word = ref("Idle");
    createApp({render: () => h(RollingWord, {text: word.value})}).mount(into);
    await nextTick();
    expect(into.textContent).toBe("Idle");
    word.value = "Working";
    await nextTick();
    const shown = [...into.querySelectorAll(".rolling-text")].map((each) => [each.textContent, each.className]);
    expect(shown.map(([text]) => text).sort()).toEqual(["Idle", "Working"]);
    expect(shown.find(([text]) => text === "Working")[1]).toContain("rolling-enter");
    expect(shown.find(([text]) => text === "Idle")[1]).toContain("rolling-leave");
});
