// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref, useTemplateRef } from "vue";
import { useChatScroll } from "./useChatScroll";

const keys = ref<string[]>([]);
const sent = ref(0);

/** A log of one 100 px row per key under 600 px of other content, measured as a browser would. */
const Log = defineComponent({
  setup() {
    const log = useTemplateRef<HTMLElement>("log");
    useChatScroll(log, () => keys.value, () => sent.value);

    return () => h("div", { ref: "log" }, keys.value.map((key) => h("p", { key }, key)));
  },
});

function mounted(): HTMLElement {
  const element = mount(Log).element as HTMLElement;
  Object.defineProperty(element, "scrollHeight", { configurable: true, get: () => 600 + element.children.length * 100 });
  Object.defineProperty(element, "clientHeight", { configurable: true, get: () => 200 });

  return element;
}

async function settle(): Promise<void> {
  await nextTick();
  await nextTick();
}

describe("useChatScroll", () => {
  it("goes to the bottom when you send, and stays there when a row arrives while you were there", async () => {
    keys.value = ["a"];
    sent.value = 0;
    const element = mounted();
    element.scrollTop = 0;

    sent.value = 1;
    await settle();
    expect(element.scrollTop).toBe(700);

    keys.value = ["a", "b"];
    await settle();
    expect(element.scrollTop).toBe(800);
  });

  it("leaves the view alone when you scrolled up, and keeps your row when earlier rows load above", async () => {
    keys.value = ["b", "c"];
    sent.value = 0;
    const element = mounted();
    element.scrollTop = 300;

    keys.value = ["b", "c", "d"];
    await settle();
    expect(element.scrollTop).toBe(300);

    keys.value = ["a", "b", "c", "d"];
    await settle();
    expect(element.scrollTop).toBe(400);
  });
});
