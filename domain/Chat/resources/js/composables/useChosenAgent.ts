import { forgetStored, keepStored, readStored } from "@kit/browserStorage";

/**
 * The agent whose session controls one viewer chose in one chat, kept for this tab so switching chats and a reload
 * show the same agent's controls; an agent no longer in the chat is forgotten there.
 */
export function useChosenAgent(viewerId: string, inboxId: string) {
  return storedForThisTab(`journal.chosen-agent.${viewerId}.${inboxId}`);
}

/**
 * Which session dialog one viewer had open for one agent, kept for this tab so the dialog, and the start or switch
 * it follows, come back after switching chats or a reload; closing the dialog forgets it.
 */
export function useOpenSessionDialog(viewerId: string, agentId: string) {
  return storedForThisTab(`journal.session-dialog-open.${viewerId}.${agentId}`);
}

/**
 * One text kept under a key for this tab: read it, keep a new one, or forget it.
 */
function storedForThisTab(key: string) {
  return {
    read: (): string | null => readStored("session", key),
    keep: (text: string): void => keepStored("session", key, text),
    forget: (): void => forgetStored("session", key),
  };
}
