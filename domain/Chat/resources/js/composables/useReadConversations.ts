import { onPurge } from "@kit/protectedView";
import { onScopeDispose, reactive, watch } from "vue";
import type { AgentOptionData, ConversationData } from "@generated/types/chat";

/**
 * Retains the conversations read by this chat window while the viewer is allowed to see them.
 */
export function useReadConversations(viewerId: () => string | undefined) {
  const conversations = reactive(new Map<string, { conversation: ConversationData; agent?: AgentOptionData }>());
  const clear = () => conversations.clear();
  onScopeDispose(onPurge(clear));
  watch(viewerId, clear, { flush: "sync" });

  function remember(conversation: ConversationData, agents: AgentOptionData[]): void {
    if (conversation.agentId !== null) {
      const agent = agents.find((candidate) => candidate.id === conversation.agentId);
      conversations.set(conversation.agentId, { conversation, agent });
    }
  }

  return { remember, forAgent: (agentId: string) => conversations.get(agentId) };
}
