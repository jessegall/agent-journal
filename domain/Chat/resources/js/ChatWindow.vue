<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import { agentUrl } from './agentLinks';
import ChatPane from './ChatPane.vue';

/**
 * The chat window, on Home and on its own page. On Home the agent bar chooses the agent; on its own page the window
 * offers the choice itself.
 */
defineProps<{ data: ChatData }>();

const page = usePage();
const ownPage = page.component === 'chat/ChatWindow';
</script>

<template>
    <ChatPane
        :chat="data"
        :offers-choice="ownPage"
        :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
    />
</template>
