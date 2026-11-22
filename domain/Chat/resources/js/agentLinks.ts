import type { AgentOptionData } from '@generated/types/chat';

/**
 * The page's address with this agent chosen: for Home's bar and for the chat window, and, while the agent runs one,
 * its session for the sections that read it. The rest of the page's query stays.
 */
export function agentUrl(pageUrl: string, agent: AgentOptionData): string {
    const url = new URL(pageUrl, 'http://journal.local');
    url.searchParams.set('agent', agent.id);
    url.searchParams.set('window[chat.conversation][agent]', agent.id);

    if (agent.sessionId === null) {
        url.searchParams.delete('session');
    } else {
        url.searchParams.set('session', agent.sessionId);
    }

    return `${url.pathname}${url.search}`;
}

/**
 * The page's address with this chat chosen by its inbox, whether or not an agent is in it; the agent choice is
 * dropped, since the chat names the room.
 */
export function chatUrl(pageUrl: string, inboxId: string): string {
    const url = new URL(pageUrl, 'http://journal.local');
    url.searchParams.delete('agent');
    url.searchParams.delete('window[chat.conversation][agent]');
    url.searchParams.delete('session');
    url.searchParams.set('window[chat.conversation][inbox]', inboxId);

    return `${url.pathname}${url.search}`;
}

/**
 * The page's address with this one question opened, as a notification opens it: passively, reading nothing else.
 * The rest of the page's query stays.
 */
export function questionUrl(pageUrl: string, messageId: string): string {
    const url = new URL(pageUrl, 'http://journal.local');
    url.searchParams.set('question', messageId);

    return `${url.pathname}${url.search}`;
}
