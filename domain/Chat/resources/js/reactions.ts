import { router } from "@inertiajs/vue3";
import { react } from "@generated/routes/chat";

/**
 * Adds the viewer's reaction to a message, or takes it back when it is already theirs, and reads the conversation
 * again in place.
 */
export function toggleReaction(inboxId: string, messageId: string, emoji: string, conversationProp: string): void {
  router.post(
    react().url,
    { inboxId, messageId, emoji },
    { preserveScroll: true, preserveState: true, only: [conversationProp] },
  );
}
