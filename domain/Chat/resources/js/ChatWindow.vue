<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import ChatPane from './ChatPane.vue';

/**
 * The chat window, on Home and on its own page: choosing an agent keeps the rest of the page's query, sets the agent
 * for this window and, while the agent runs one, its session for the sections that read it.
 */
defineProps<{ data: ChatData }>();

const page = usePage();

function agentUrl(agent: AgentOptionData): string {
    const url = new URL(page.url, 'http://journal.local');
    url.searchParams.set('window[chat.conversation][agent]', agent.id);

    if (agent.sessionId === null) {
        url.searchParams.delete('session');
    } else {
        url.searchParams.set('session', agent.sessionId);
    }

    return `${url.pathname}${url.search}`;
}
</script>

<template>
    <ChatPane :chat="data" :agent-url="agentUrl" />
</template>
