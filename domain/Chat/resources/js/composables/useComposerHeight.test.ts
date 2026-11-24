// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { useComposerHeight } from "./useComposerHeight";

function composerWith(text: string, scrollHeight: number) {
  const body = ref(text);
  const area = ref<HTMLTextAreaElement | null>(null);
  const wrapper = mount(
    defineComponent({
      setup() {
        useComposerHeight(area, body);

        return () => h("textarea", { ref: area, style: "line-height: 20px; padding: 2px 0" });
      },
    }),
    { attachTo: document.body },
  );
  Object.defineProperty(wrapper.element, "scrollHeight", { configurable: true, get: () => scrollHeight });

  return { wrapper, body };
}

describe("the composer's height", () => {
  it("rests at one row while empty, whatever its placeholder measures", async () => {
    const { wrapper, body } = composerWith("", 44);
    body.value = " ";
    body.value = "";
    await nextTick();
    await nextTick();

    expect((wrapper.element as HTMLTextAreaElement).style.height).toBe("24px");
    wrapper.unmount();
  });

  it("grows to the rows its text holds, a scroll height a pixel over a row included", async () => {
    const { wrapper, body } = composerWith("", 65);
    body.value = "three\nrows\nhere";
    await nextTick();
    await nextTick();

    expect((wrapper.element as HTMLTextAreaElement).style.height).toBe("64px");
    wrapper.unmount();
  });
});
