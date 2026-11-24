// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

const visit = vi.fn();
vi.mock("@inertiajs/vue3", () => ({ router: { visit: (url: string) => visit(url) } }));
vi.mock("@kit/sessionStarts", () => ({ terminalPage: { url: (id: string) => `/web/agents/${id}/terminal` } }));
vi.mock("./SessionTerminal.vue", () => ({
  default: { template: "<div data-session-terminal />", methods: { holdsCloseForDraft: () => false } },
}));

const { default: TerminalModal } = await import("./TerminalModal.vue");
const { closeAgentTerminal, openAgentTerminal, terminalModal } = await import("./composables/useTerminalModal");

const agent = {
  id: "agent-1",
  name: "Main agent",
  sessionId: "session-1",
  sessionGeneration: 1,
  hasTerminal: true,
  needsAttention: false,
} as unknown as AgentOptionData;

describe("TerminalModal", () => {
  afterEach(() => {
    closeAgentTerminal();
    visit.mockReset();
    document.body.innerHTML = "";
  });

  it("opens the agent's terminal as a modal over the chat window and closes it again", async () => {
    const modal = mount(TerminalModal, { props: { agents: [agent] }, attachTo: document.body });

    openAgentTerminal(agent);
    await modal.vm.$nextTick();

    expect(document.querySelector("[data-terminal-modal] [data-session-terminal]")).not.toBeNull();
    expect(terminalModal.expected).toEqual({ sessionId: "session-1", generation: 1 });

    closeAgentTerminal();
    await modal.vm.$nextTick();

    expect(document.querySelector("[data-terminal-modal]")).toBeNull();
    modal.unmount();
  });

  it("visits the terminal's own page when no chat window is there to show it", () => {
    openAgentTerminal(agent);

    expect(visit).toHaveBeenCalledWith("/web/agents/agent-1/terminal");
    expect(terminalModal.agentId).toBeNull();
  });
});
