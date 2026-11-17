<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { draftKey } from './composables/useMessageDrafts';
import type { ChatData } from '@generated/types/chat';
import Composer from './Composer.vue';
import MessageList from './MessageList.vue';

/**
 * Home's left pane (doc 4, 6.1): the running sessions to talk to, the chosen conversation, the dock above the composer
 * (its cards arrive later through the dock slot) and the composer.
 */
const props = defineProps<{
    chat: ChatData;
    sessionUrl: (session: string) => string;
}>();

const page = usePage();
const conversation = computed(() => props.chat.conversation);
const key = computed(() =>
    conversation.value === undefined
        ? undefined
        : draftKey(page.props.viewer?.id ?? '', conversation.value.id),
);
</script>

<template>
    <section
        class="@container flex h-full min-h-0 flex-col gap-2 px-3 pb-2"
        aria-label="Chat"
    >
        <nav
            class="flex flex-wrap gap-1.5 border-b border-border py-2"
            aria-label="Agent sessions"
        >
            <template v-if="chat.sessions.length === 0">
                <p class="text-small text-text-3">
                    No agent session is running.
                </p>
            </template>
            <template v-for="session in chat.sessions" :key="session.id">
                <Link
                    :href="sessionUrl(session.id)"
                    preserve-scroll
                    class="rounded-control border border-border-2 px-2.5 py-0.5 text-small text-text-2 hover:bg-hover hover:text-text"
                    :class="{
                        'border-brand bg-sel text-text':
                            conversation?.sessionId === session.id,
                    }"
                    :aria-current="
                        conversation?.sessionId === session.id
                            ? 'true'
                            : undefined
                    "
                    >{{ session.agentName }}</Link
                >
            </template>
        </nav>
        <template v-if="conversation && key">
            <MessageList :messages="conversation.messages" />
            <slot name="dock" />
            <Composer :draft-key="key" :session="conversation.sessionId" />
        </template>
        <template v-else>
            <p class="m-auto text-empty text-text-3">
                Choose an agent session to talk to.
            </p>
        </template>
    </section>
</template>
