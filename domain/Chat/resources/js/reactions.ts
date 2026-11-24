import { router } from "@inertiajs/vue3";
import { react } from "@generated/routes/chat";

/**
 * Reacts to a message with one emoji, a reply whose whole body is that emoji, and reads the conversation again in
 * place.
 */
export function sendReaction(inboxId: string, messageId: string, emoji: string, conversationProp: string): void {
  router.post(
    react().url,
    { inboxId, messageId, emoji },
    { preserveScroll: true, preserveState: true, only: [conversationProp] },
  );
}
