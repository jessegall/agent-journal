import { router } from "@inertiajs/vue3";
import { ref } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { interruptTurn } from "@kit/sessionStarts";

/**
 * Stops the agent's current turn, once per press under a new request id; the session stays, and the bar shows
 * Interrupting and then what the agent does. A refusal is kept to show beside the button.
 */
export function useTurnInterrupt() {
  const isPending = ref(false);
  const refusal = ref<string | null>(null);

  function interrupt(agent: AgentOptionData): void {
    if (agent.sessionId === null || isPending.value) {
      return;
    }

    isPending.value = true;
    refusal.value = null;
    const requestId = newRequestId();
    keyedPost(
      interruptTurn.url(agent.id),
      { requestId, sessionId: agent.sessionId },
      requestId,
      {
        onAccepted: () => undefined,
        onRefused: (reason) => (refusal.value = reason),
        onUncertain: () => router.reload(),
        onFinish: () => (isPending.value = false),
      },
    );
  }

  return { isPending, refusal, interrupt };
}
