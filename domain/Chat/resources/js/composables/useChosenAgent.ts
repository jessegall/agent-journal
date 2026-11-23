import { forgetStored, keepStored, readStored } from "@kit/browserStorage";

/**
 * The agent whose session controls one viewer chose in one chat, kept for this tab so switching chats and a reload
 * show the same agent's controls; an agent no longer in the chat is forgotten there.
 */
export function useChosenAgent(viewerId: string, inboxId: string) {
  const key = `journal.chosen-agent.${viewerId}.${inboxId}`;

  return {
    read: (): string | null => readStored("session", key),
    keep: (agentId: string): void => keepStored("session", key, agentId),
    forget: (): void => forgetStored("session", key),
  };
}

/**
 * Which session dialog one viewer had open for one agent, kept for this tab so the dialog, and the start or switch
 * it follows, come back after switching chats or a reload; closing the dialog forgets it.
 */
export function useOpenSessionDialog(viewerId: string, agentId: string) {
  const key = `journal.session-dialog-open.${viewerId}.${agentId}`;

  return {
    read: (): string | null => readStored("session", key),
    keep: (mode: string): void => keepStored("session", key, mode),
    forget: (): void => forgetStored("session", key),
  };
}
