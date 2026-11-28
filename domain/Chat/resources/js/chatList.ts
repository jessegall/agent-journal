import type { AgentOptionData } from "@generated/types/chat";

/**
 * Which agents the chat list shows: every one, the main agents, the helpers, or those whose question waits for the
 * viewer.
 */
export type ChatListFilter = "all" | "main" | "helper" | "waiting";

export const CHAT_LIST_FILTERS: readonly { value: ChatListFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "main", label: "Main agents" },
  { value: "helper", label: "Helpers" },
  { value: "waiting", label: "Waits on you" },
];

const filterTests: Record<ChatListFilter, (agent: AgentOptionData) => boolean> = {
  all: () => true,
  main: (agent) => agent.isMain,
  helper: (agent) => !agent.isMain,
  waiting: (agent) => agent.waitsOnYou,
};

/**
 * A text split around the first place the search matches it, so the match can be underlined; no match leaves it
 * whole in `before`.
 */
export type MatchParts = { before: string; match: string; after: string };

export function matchParts(text: string, search: string): MatchParts {
  const query = search.trim().toLowerCase();
  const at = query === "" ? -1 : text.toLowerCase().indexOf(query);

  if (at < 0) {
    return { before: text, match: "", after: "" };
  }

  return {
    before: text.slice(0, at),
    match: text.slice(at, at + query.length),
    after: text.slice(at + query.length),
  };
}

/**
 * Whether the agent's name or what it does now holds the search.
 */
export function matchesSearch(agent: AgentOptionData, search: string): boolean {
  const query = search.trim().toLowerCase();

  return `${agent.name} ${agent.status.label}`.toLowerCase().includes(query);
}

/**
 * The agents the filter and the search keep, the most recently active first; one never active comes last.
 */
export function chatListRows(
  agents: AgentOptionData[],
  filter: ChatListFilter,
  search: string,
): AgentOptionData[] {
  return agents
    .filter((agent) => filterTests[filter](agent) && matchesSearch(agent, search))
    .sort((first, second) => activityOf(second) - activityOf(first));
}

function activityOf(agent: AgentOptionData): number {
  return agent.lastActiveAt === null ? 0 : new Date(agent.lastActiveAt).getTime();
}
