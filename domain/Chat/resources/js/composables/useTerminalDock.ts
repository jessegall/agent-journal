import { reactive } from "vue";

/**
 * Which agent's terminal the chat shows beside it, shared by the agent bar, which opens it, and the chat window, which
 * places it. While no chat window is mounted, opening the terminal visits its own page instead.
 */
export const terminalDock = reactive({
  agentId: null as string | null,
  // The session and generation the opener saw, which the opened terminal must still show.
  expected: null as { sessionId: string; generation: number } | null,
  mountedWindows: 0,
});

/**
 * Opens the agent's terminal beside the chat for the session the opener saw, and says whether a chat window took it.
 */
export function openTerminalBesideChat(
  agentId: string,
  sessionId: string | null,
  generation: number,
): boolean {
  if (terminalDock.mountedWindows === 0) {
    return false;
  }

  terminalDock.agentId = agentId;
  terminalDock.expected = sessionId === null ? null : { sessionId, generation };

  return true;
}

export function closeTerminalBesideChat(): void {
  terminalDock.agentId = null;
  terminalDock.expected = null;
}
