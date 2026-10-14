import {expect, test} from "vitest";
import {computed, nextTick, ref} from "vue";
import {useKept} from "../src/composables/kept.js";

test("a row the store drops for a moment is still shown, and another row is not taken for it", async () => {
    const list = ref([{n: 1, title: "helper"}]);
    const wanted = ref(1);
    const shown = useKept(computed(() => list.value.find((row) => row.n === wanted.value) || null), () => wanted.value);
    expect(shown.value.title).toBe("helper");
    list.value = [];
    await nextTick();
    expect(shown.value.title).toBe("helper");
    list.value = [{n: 1, title: "helper again"}];
    await nextTick();
    expect(shown.value.title).toBe("helper again");
    wanted.value = 2;
    await nextTick();
    expect(shown.value).toBe(null);
});
