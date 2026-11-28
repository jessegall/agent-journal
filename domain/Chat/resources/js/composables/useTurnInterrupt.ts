import { useWindowReload } from "@kit/useWindowQuery";
import { useHostProp } from "@kit/hostProp";
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
  const reload = useWindowReload();
  const hostProp = useHostProp();
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
        onUncertain: () => reload({}),
        onFinish: () => (isPending.value = false),
      },
      [hostProp],
    );
  }

  return { isPending, refusal, interrupt };
}
