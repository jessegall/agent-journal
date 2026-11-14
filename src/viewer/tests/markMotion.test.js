import {expect, test} from "vitest";
import {effectScope, nextTick, ref} from "vue";
import {useMarkMotion} from "../src/composables/markMotion.js";

// message 101510: a size rounded to whole pixels locked the mark off its real size, so it jumped when the lock came off
test("a mark is locked at its size to the fraction of a pixel, never a rounded one", async () => {
    const el = document.createElement("button");
    Object.defineProperty(el, "offsetWidth", {value: 155});
    Object.defineProperty(el, "offsetHeight", {value: 23});
    el.getBoundingClientRect = () => ({width: 155.4, height: 22.7});
    const wanted = ref(false);
    const scope = effectScope();
    scope.run(() => useMarkMotion(ref(el), () => wanted.value, () => new Promise(() => {})));
    wanted.value = true;
    await nextTick();
    expect(el.style.width).toBe("155.4px");
    expect(el.style.height).toBe("22.7px");
    scope.stop();
});
