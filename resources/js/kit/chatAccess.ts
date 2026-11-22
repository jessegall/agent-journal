/**
 * The signal that this browser lost one chat: the user left it, was removed or saw it closed. The live connection
 * raises it; the chat window clears everything it kept for that chat.
 */
type ChatAccessListener = (inboxId: string) => void;

const listeners = new Set<ChatAccessListener>();

export function onChatAccessEnded(listener: ChatAccessListener): () => void {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

export function notifyChatAccessEnded(inboxId: string): void {
    listeners.forEach((listener) => listener(inboxId));
}
