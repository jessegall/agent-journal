// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import ResultView from "./ResultView.vue";
import { useIsStale } from "./windowFreshness";
import type { WindowResult } from "@/generated/types/page-props";

vi.mock("@inertiajs/vue3", () => ({
  Link: { props: ["href"], template: '<a :href="href"><slot /></a>' },
}));

const content = defineComponent({
  setup() {
    const isStale = useIsStale();

    return () => h("p", isStale.value ? "rows, read-only" : "rows");
  },
});

function mountResult(
  result: WindowResult<unknown> | undefined,
  keptData?: unknown,
  placement: "page" | "pane" | "section" = "pane",
) {
  return mount(ResultView, {
    props: {
      result,
      keptData,
      isWindow: placement !== "section",
      subject: "Plans",
      placement,
    },
    slots: { content: () => h(content) },
    attachTo: document.body,
  });
}

describe("a result", () => {
  it("draws three placeholder rows with one busy line naming its subject, pulsing only where motion is welcome", () => {
    const view = mountResult(undefined);
    const rows = view.findAll('[aria-hidden="true"]');

    expect(view.find('[aria-busy="true"]').exists()).toBe(true);
    expect(view.findAll('[role="status"]')).toHaveLength(1);
    expect(view.get('[role="status"]').text()).toBe("Loading Plans");
    expect(rows).toHaveLength(3);
    expect(rows[0].find("span").classes()).toContain(
      "motion-safe:animate-pulse",
    );
    expect(rows[0].find("span").classes()).not.toContain("animate-pulse");
    view.unmount();
  });

  it("names its subject when the first read failed and reloads only itself", async () => {
    const view = mountResult({
      state: "failed",
      message: "This window could not be loaded.",
    });

    await view.get("button").trigger("click");

    expect(view.get('[role="alert"]').text()).toContain("Could not load Plans");
    expect(view.get("button").text()).toBe("Try again");
    expect(view.emitted("retry")).toHaveLength(1);
    view.unmount();
  });

  it("shows a safe reason when the failure carries one", () => {
    const view = mountResult({
      state: "failed",
      message: "This window could not be loaded.",
      reason: "The source is not reachable.",
    });

    expect(view.text()).toContain("The source is not reachable.");
    view.unmount();
  });

  it("keeps the last read read-only when a refresh failed", async () => {
    const view = mountResult(
      { state: "failed", message: "This window could not be loaded." },
      { rows: [] },
    );

    await view.get("button").trigger("click");

    expect(view.get('[role="alert"]').text()).toContain(
      "Showing earlier results.",
    );
    expect(view.get("p").text()).toBe("rows, read-only");
    expect(view.emitted("retry")).toHaveLength(1);
    view.unmount();
  });

  it("keeps a result of a failed page batch readable and read-only without a notice of its own", () => {
    const view = mount(ResultView, {
      props: {
        result: { state: "ready", data: { rows: [] } },
        isWindow: true,
        subject: "Plans",
        isBatchStale: true,
      },
      slots: { content: () => h(content) },
    });

    expect(view.get("p").text()).toBe("rows, read-only");
    expect(view.find('[role="alert"]').exists()).toBe(false);
    view.unmount();
  });

  it("shows fresh content once a read succeeds", () => {
    const view = mountResult(
      { state: "ready", data: { rows: [] } },
      { rows: [] },
    );

    expect(view.find('[role="alert"]').exists()).toBe(false);
    expect(view.text()).toBe("rows");
    view.unmount();
  });

  it("refuses a page of its own with a way back and the focus on its heading", async () => {
    const view = mountResult({ state: "denied" }, { rows: [] }, "page");
    await nextTick();

    expect(view.get("h1").text()).toBe("This item is unavailable");
    expect(view.get("a").attributes("href")).toBe("/");
    expect(document.activeElement).toBe(view.get("h1").element);
    expect(view.text()).not.toContain("rows");
    view.unmount();
  });

  it("refuses a pane in place with Close, replacing what it showed", async () => {
    const view = mountResult({ state: "unavailable" }, { rows: [] }, "pane");

    await view.get("button").trigger("click");

    expect(view.text()).toContain("This item is unavailable");
    expect(view.text()).not.toContain("rows");
    expect(view.emitted("close")).toHaveLength(1);
    view.unmount();
  });

  it("shows nothing for a section that is loading or refused", () => {
    expect(mountResult(undefined, undefined, "section").text()).toBe("");
    expect(mountResult({ state: "denied" }, undefined, "section").text()).toBe(
      "",
    );
  });
});
