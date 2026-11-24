import { router } from "@inertiajs/vue3";
import type { AgentOptionData } from "@generated/types/chat";
import { terminalPage } from "@kit/sessionStarts";
import { reactive } from "vue";

/**
 * Which agent's terminal is open as the modal over the page, shared by what opens it (the agent menu and the agent
 * bar's words) and the chat window, which draws it. While no chat window is mounted, opening it visits the terminal's
 * own page instead.
 */
export const terminalModal = reactive({
  agentId: null as string | null,
  // The session and generation the opener saw, which the opened terminal must still show.
  expected: null as { sessionId: string; generation: number } | null,
  mountedWindows: 0,
});

export function openAgentTerminal(agent: AgentOptionData): void {
  if (terminalModal.mountedWindows === 0) {
    router.visit(terminalPage.url(agent.id));

    return;
  }

  terminalModal.agentId = agent.id;
  terminalModal.expected =
    agent.sessionId === null
      ? null
      : { sessionId: agent.sessionId, generation: agent.sessionGeneration };
}

export function closeAgentTerminal(): void {
  terminalModal.agentId = null;
  terminalModal.expected = null;
}
