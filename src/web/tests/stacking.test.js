// @vitest-environment node
import {expect, test} from "vitest";
import {effectScope, nextTick, ref} from "vue";
import {stacking} from "../src/composables/stacking.js";

const layer = (visible) => effectScope().run(() => stacking(visible));

test("each panel or dialog opened takes a layer above the ones already open, and the base returns when none are", async () => {
    const dialog = ref(true);
    const panel = ref(false);
    const first = layer(dialog);
    const second = layer(panel);
    expect(first.value).toBe(80);
    panel.value = true;
    await nextTick();
    expect(second.value).toBeGreaterThan(first.value);
    dialog.value = false;
    panel.value = false;
    await nextTick();
    dialog.value = true;
    await nextTick();
    expect(first.value).toBe(80);
});
