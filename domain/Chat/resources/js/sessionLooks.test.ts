// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Status from "@kit/Status";
import type { SessionActivityStatus } from "@kit/CoreTypes";
import { sessionLooks } from "./sessionLooks";

function shown(state: SessionActivityStatus) {
  return mount(Status, { props: { state: sessionLooks[state] } });
}

describe("sessionLooks", () => {
  it("spins only while the agent starts, works or is verified", () => {
    const spinning = (Object.keys(sessionLooks) as SessionActivityStatus[]).filter(
      (state) => shown(state).find('.spinner').exists(),
    );

    expect(spinning.sort()).toEqual(["starting", "verifying", "working"]);
  });

  it("shows an idle agent with the hollow mark and an unknown one with its own word, never a spinner", () => {
    const idle = shown("idle");
    const unknown = shown("unknown");

    expect(idle.text()).toBe("Open");
    expect(unknown.text()).toBe("Unknown");
    expect(unknown.find('.spinner').exists()).toBe(false);
  });
});
