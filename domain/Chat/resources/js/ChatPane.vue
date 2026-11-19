<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { draftKey } from './composables/useMessageDrafts';
import type { ChatData } from '@generated/types/chat';
import type { MessageView } from '@generated/types/core';
import { read as readRoute } from '@generated/routes/chat';
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
        : draftKey(page.props.currentUser?.id ?? '', conversation.value.id),
);
const replyingTo = ref<MessageView | null>(null);
const unreadShown = computed(() =>
    (conversation.value?.messages ?? [])
        .filter(
            (message) =>
                message.sourceInboxId !== conversation.value?.sourceInboxId &&
                message.firstReader === undefined,
        )
        .map((message) => message.id),
);

/**
 * Reads the incoming messages this conversation shows, for everyone at the inbox. It runs when the person opens the
 * conversation or asks for it, never on a background refresh.
 */
function readShown(): void {
    const shown = conversation.value;

    if (shown === undefined || unreadShown.value.length === 0) {
        return;
    }

    router.post(
        readRoute().url,
        {
            inboxId: shown.sourceInboxId,
            messageIds: unreadShown.value,
            session: shown.sessionId,
        },
        { preserveScroll: true, preserveState: true },
    );
}

onMounted(readShown);
watch(
    () => conversation.value?.id,
    () => {
        replyingTo.value = null;
        readShown();
    },
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
            <MessageList
                :messages="conversation.messages"
                :own-inbox-id="conversation.sourceInboxId"
                @reply="(message) => (replyingTo = message)"
            />
            <template v-if="unreadShown.length > 0">
                <p class="flex items-center gap-2 text-small text-text-3">
                    <button type="button" class="underline" @click="readShown">
                        Read shown messages
                    </button>
                    <span>Reading is shared with everyone at this inbox.</span>
                </p>
            </template>
            <ul class="flex flex-wrap gap-1.5" aria-label="Docked records">
                <template v-for="card in conversation.dockedCards" :key="`${card.type}:${card.id}`">
                    <li class="rounded-control border border-border-2 px-2 py-1 text-small text-text-2">
                        {{ card.title }}
                    </li>
                </template>
            </ul>
            <slot name="dock" />
            <Composer
                :draft-key="key"
                :session="conversation.sessionId"
                :source-inbox-id="conversation.sourceInboxId"
                :destination-inbox-id="conversation.destinationInboxId"
                :replying-to="replyingTo"
                @replied="replyingTo = null"
            />
        </template>
        <template v-else>
            <p class="m-auto text-empty text-text-3">
                Choose an agent session to talk to.
            </p>
        </template>
    </section>
</template>
