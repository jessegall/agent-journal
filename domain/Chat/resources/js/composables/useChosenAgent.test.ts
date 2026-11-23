// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { useChosenAgent, useOpenSessionDialog } from "./useChosenAgent";

describe("useChosenAgent", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("keeps the agent chosen in Design apart from Release and from another viewer", () => {
    useChosenAgent("ada", "design").keep("codex");
    useChosenAgent("ada", "release").keep("claude");

    expect(useChosenAgent("ada", "design").read()).toBe("codex");
    expect(useChosenAgent("ada", "release").read()).toBe("claude");
    expect(useChosenAgent("bea", "design").read()).toBeNull();
  });

  it("keeps one agent's open switch dialog without touching another agent's", () => {
    useOpenSessionDialog("ada", "codex").keep("switch");

    expect(useOpenSessionDialog("ada", "codex").read()).toBe("switch");
    expect(useOpenSessionDialog("ada", "claude").read()).toBeNull();

    useOpenSessionDialog("ada", "codex").forget();
    expect(useOpenSessionDialog("ada", "codex").read()).toBeNull();
  });
});
