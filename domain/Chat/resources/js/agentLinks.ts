import type { AgentOptionData } from "@generated/types/chat";

const BESIDE = "window[chat.conversation][beside][]";

/**
 * The page's address with this agent chosen: for Home's bar and for the chat window, and, while the agent runs one,
 * its session for the sections that read it. The rest of the page's query stays.
 */
export function agentUrl(pageUrl: string, agent: AgentOptionData): string {
  return chosenUrl(pageUrl, agent.id, agent.sessionId);
}

/**
 * The page's address with an agent the page has not read yet chosen, such as a new chat's: it runs no session yet.
 */
export function newAgentUrl(pageUrl: string, agentId: string): string {
  return chosenUrl(pageUrl, agentId, null);
}

/**
 * The page's address with these chats shown beside the chosen one, in this order; none shows one chat at a time.
 */
export function besideUrl(pageUrl: string, agentIds: string[]): string {
  const url = new URL(pageUrl, "http://journal.local");
  url.searchParams.delete(BESIDE);

  for (const agentId of agentIds) {
    url.searchParams.append(BESIDE, agentId);
  }

  return `${url.pathname}${url.search}`;
}

function chosenUrl(pageUrl: string, agentId: string, sessionId: string | null): string {
  const url = new URL(pageUrl, "http://journal.local");
  url.searchParams.set("agent", agentId);
  url.searchParams.set("window[chat.conversation][agent]", agentId);

  if (sessionId === null) {
    url.searchParams.delete("session");
  } else {
    url.searchParams.set("session", sessionId);
  }

  return `${url.pathname}${url.search}`;
}
