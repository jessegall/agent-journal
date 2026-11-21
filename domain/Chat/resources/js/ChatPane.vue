<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { draftKey } from './composables/useMessageDrafts';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import type { MessageView } from '@kit/CoreTypes';
import { read as readRoute } from '@generated/routes/chat';
import AgentPicker from './AgentPicker.vue';
import AgentSessionActions from './AgentSessionActions.vue';
import Composer from './Composer.vue';
import MessageList from './MessageList.vue';

/**
 * The chat (doc 4, 6.1): the chosen agent's conversation, the dock above the composer (its cards arrive later through
 * the dock slot) and the composer. On Chat's own page it also offers the agents and their session actions, which
 * Home's agent bar offers instead.
 */
const props = defineProps<{
    chat: ChatData;
    offersChoice: boolean;
    agentUrl: (agent: AgentOptionData) => string;
}>();

const page = usePage();
const conversation = computed(() => props.chat.conversation);
const selected = computed(() => props.chat.agents.find((agent) => agent.id === props.chat.selectedAgentId));
const key = computed(() => {
    const user = page.props.currentUser;

    return conversation.value === undefined || !user
        ? undefined
        : draftKey(user.id, conversation.value.agentId);
});
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
 * Reads the incoming messages this conversation shows, for everyone at the inbox. It runs when the user opens the
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
            agent: shown.agentId,
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
        <template v-if="offersChoice">
            <AgentPicker
                :agents="chat.agents"
                :selected-agent-id="chat.selectedAgentId"
                :agent-url="agentUrl"
            />
        </template>
        <template v-if="chat.setupRequired">
            <p class="text-small text-text-3">
                This installation has no main agent yet. Run
                <code>php artisan agents:install</code> to create it.
            </p>
        </template>
        <template v-if="conversation && key && selected">
            <template v-if="offersChoice">
                <AgentSessionActions :agent="selected" />
            </template>
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
                :agent="conversation.agentId"
                :agent-name="selected.name"
                :session-id="conversation.sessionId"
                :session-generation="conversation.sessionGeneration"
                :source-inbox-id="conversation.sourceInboxId"
                :destination-inbox-id="conversation.destinationInboxId"
                :replying-to="replyingTo"
                @replied="replyingTo = null"
            />
        </template>
        <template v-else>
            <p class="m-auto text-empty text-text-3">
                Choose an agent to talk to.
            </p>
        </template>
    </section>
</template>
