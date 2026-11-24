// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, onMounted, ref } from "vue";
import { describe, expect, it } from "vitest";
import ResultView from "../components/framework/ResultView.vue";
import { hostedPage } from "./hostedPage";

describe("a declared page", () => {
  it("is wrapped once, so every visit renders the same component and keeps its state", () => {
    const page = defineComponent({ render: () => h("div") });

    expect(hostedPage(page)).toBe(hostedPage(page));
  });

  it("keeps its content mounted while its result is asked for again", async () => {
    let mounts = 0;
    const content = defineComponent({
      setup: () => onMounted(() => mounts++),
      render: () => h("p", "content"),
    });
    const result = ref<{ state: "ready"; data: unknown } | undefined>({
      state: "ready",
      data: { id: 1 },
    });
    const view = mount(
      defineComponent({
        render: () =>
          h(
            ResultView,
            { result: result.value, keptData: { id: 1 } },
            { content: () => h(content) },
          ),
      }),
    );

    result.value = undefined;
    await nextTick();
    result.value = { state: "ready", data: { id: 2 } };
    await nextTick();

    expect([mounts, view.text()]).toEqual([1, "content"]);
  });
});
