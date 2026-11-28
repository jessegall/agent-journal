import { useWindowReload } from "@kit/useWindowQuery";
import { useHostProp } from "@kit/hostProp";
import { ref } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { stopSession } from "@kit/sessionStarts";

/**
 * Ends the agent's session at the generation the page shows, once under a new request id, after the user confirmed
 * it; the bar then follows the stop from the page, and the next message starts the agent again.
 */
export function useSessionEnd() {
  const reload = useWindowReload();
  const hostProp = useHostProp();
  const isPending = ref(false);
  const refusal = ref<string | null>(null);

  function end(agent: AgentOptionData, onFinish: () => void): void {
    if (agent.sessionId === null) {
      return;
    }

    isPending.value = true;
    refusal.value = null;
    const requestId = newRequestId();
    keyedPost(
      stopSession.url(agent.id),
      {
        requestId,
        sessionId: agent.sessionId,
        generation: agent.sessionGeneration,
      },
      requestId,
      {
        onAccepted: () => undefined,
        onRefused: (reason) => (refusal.value = reason),
        onUncertain: () => reload({}),
        onFinish: () => {
          isPending.value = false;
          onFinish();
        },
      },
      [hostProp],
    );
  }

  return { isPending, refusal, end };
}
