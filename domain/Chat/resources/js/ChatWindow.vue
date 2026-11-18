<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { ChatData } from '@generated/types/chat';
import ChatPane from './ChatPane.vue';

/**
 * The chat window, on Home and on its own page: choosing a session keeps the rest of the page's query and sets the
 * session both for this window and for the sections that read it.
 */
defineProps<{ data: ChatData }>();

const page = usePage();

function sessionUrl(session: string): string {
    const url = new URL(page.url, 'http://journal.local');
    url.searchParams.set('window[chat.conversation][session]', session);
    url.searchParams.set('session', session);

    return `${url.pathname}${url.search}`;
}
</script>

<template>
    <ChatPane :chat="data" :session-url="sessionUrl" />
</template>
