// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";
import type { SessionState } from "@kit/CoreTypes";
import { CHECK_READ_MILLISECONDS } from "../../../composables/useStatusCheck";

const reload = vi.fn();
const sendPageAction = vi.fn();

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ props: {} }),
  router: { reload: (options: { onFinish?: () => void }) => reload(options), on: vi.fn() },
}));
vi.mock("@kit/pageActions", () => ({
  sendPageAction: (...args: unknown[]) => sendPageAction(...args),
}));
vi.mock("./SessionForm.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./StopConfirmation.vue", () => ({ default: { template: "<div />" } }));

const { default: VerifyingSessionCard } = await import("./VerifyingSessionCard.vue");

function agentIn(sessionState: SessionState): AgentOptionData {
  return {
    id: "agent-1",
    name: "Main agent",
    sessionId: "session-1",
    hasTerminal: false,
    needsAttention: false,
    status: {
      sessionState,
      label: "Verifying session",
      reason: "The journal is checking.",
      remedy: null,
      operation: null,
      commandOutcome: null,
      observationAgeSeconds: null,
      actions: [
        { type: "check-status", label: "Check status" },
        { type: "cancel-start", label: "Cancel start" },
      ],
      isProcessConfirmed: true,
    },
  } as unknown as AgentOptionData;
}

describe("VerifyingSessionCard", () => {
  afterEach(() => {
    reload.mockReset();
    sendPageAction.mockReset();
  });

  it.each(["verifying", "unverified"] as const)("shows a %s start with Check status and Cancel", (state) => {
    const card = mount(VerifyingSessionCard, { props: { agent: agentIn(state) } });

    expect(card.find("[data-verifying-session]").attributes("role")).toBe("status");
    expect(card.findAll("button").map((button) => button.text())).toEqual(["Check status", "Cancel start"]);
  });

  it.each(["idle", "working"] as const)("shows nothing for a %s agent", (state) => {
    const card = mount(VerifyingSessionCard, { props: { agent: agentIn(state) } });

    expect(card.find("[data-verifying-session]").exists()).toBe(false);
  });

  it("asks the host to check the start, then reads the page again while it waits for the answer", async () => {
    vi.useFakeTimers();
    const card = mount(VerifyingSessionCard, { props: { agent: agentIn("verifying") } });

    await card.findAll("button")[0].trigger("click");
    const [route, , options] = sendPageAction.mock.calls[0];
    options.onFinish();
    vi.advanceTimersByTime(CHECK_READ_MILLISECONDS);
    vi.useRealTimers();

    expect(route.url).toContain("/agents/agent-1/sessions/session-1/check-start");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("cancels the start", async () => {
    const card = mount(VerifyingSessionCard, { props: { agent: agentIn("verifying") } });

    await card.findAll("button")[1].trigger("click");

    expect(sendPageAction.mock.calls[0][0].url).toContain("/agents/agent-1/sessions/session-1/cancel-launch");
  });
});
