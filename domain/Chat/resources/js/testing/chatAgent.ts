import type { AgentOptionData, AgentStatusData } from "@generated/types/chat";

export function chatAgentStatus(
  sessionState: AgentStatusData["sessionState"],
  label: string,
  reason: string | null = null,
): AgentStatusData {
  return {
    sessionState,
    label,
    reason,
    isStartRefused: false,
    remedy: null,
    commandOutcome: null,
    observationAgeSeconds: null,
    actions: [],
    isProcessConfirmed: false,
  };
}

export function chatAgent(
  id: string,
  name: string,
  fields: Partial<AgentOptionData> = {},
): AgentOptionData {
  const retired = fields.isRetired === true;

  return {
    id,
    name,
    profileKey: "journal-main",
    isRetired: retired,
    presence: retired ? "retired" : "idle",
    presenceLabel: retired ? "Retired" : "Idle",
    sessionId: null,
    sessionGeneration: 0,
    hasTerminal: false,
    switchId: null,
    switchStage: null,
    switchStageLabel: null,
    isSwitchOver: true,
    actions: [],
    conversations: [],
    startRefusal: null,
    sessionDriver: null,
    sessionDriverLabel: null,
    sessionModel: null,
    sessionEffort: null,
    needsAttention: false,
    isMain: false,
    unreadCount: 0,
    lastActiveAt: null,
    waitsOnYou: false,
    status: retired ? chatAgentStatus("retired", "Retired") : chatAgentStatus("idle", "Idle"),
    ...fields,
  };
}
