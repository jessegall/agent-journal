<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { useConversationIntents } from './composables/useConversationIntents';
import { draftKey } from './composables/useMessageDrafts';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import type { MessageView } from '@kit/CoreTypes';
import { isRevealed } from '@kit/protectedView';
import SlotSections from '@kit/SlotSections';
import { read as readRoute } from '@generated/routes/chat';
import AgentPicker from './AgentPicker.vue';
import AgentSessionActions from './AgentSessionActions.vue';
import Composer from './Composer.vue';
import DockStack from './dock/DockStack.vue';
import FocusedQuestion from './FocusedQuestion.vue';
import MessageList from './MessageList.vue';

/**
 * The chat (doc 4, 6.1): the chosen agent's conversation, what other domains suggest in the dock slot, the sources
 * docked in the conversation and the composer. On Chat's own page it also offers the agents and their session actions, which
 * Home's agent bar offers instead.
 */
const props = defineProps<{
    chat: ChatData;
    offersChoice: boolean;
    agentUrl: (agent: AgentOptionData) => string;
    loadMore: (token: string) => void;
    protectedProp: string;
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

/**
 * The owner of the user's sends in this conversation, the same one Home and Chat's page share.
 */
const owner = computed(() => (key.value === undefined ? undefined : useConversationIntents(key.value)));
const shownRows = computed(() => owner.value?.rows(conversation.value?.messages ?? []) ?? []);
const pending = computed(() => shownRows.value.flatMap((row) => (row.kind === 'intent' ? [row.intent] : [])));
const refused = computed(() =>
    (owner.value?.recoveryEntries() ?? []).map((entry) => ({
        entry,
        reason: owner.value?.refusalOf(entry.intentKey) ?? '',
    })),
);

// A read that returned the user's own sends settles them.
watch(
    () => conversation.value?.messages,
    (messages) => owner.value?.settle(messages ?? []),
);
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

/**
 * Whether an authorized read that included this chat's prop answered; until then the conversation stays hidden.
 */
const isShown = computed(() => isRevealed(props.protectedProp));

let openedConversationId: string | undefined;

/**
 * Reads what the conversation shows once each time the user opens a conversation, when it is first shown; showing
 * the same conversation again after a catch-up reads nothing, and neither does opening one question passively.
 */
function readOnOpen(): void {
    const id = conversation.value?.id;

    const opensOneQuestion = props.chat.focusedQuestionId !== undefined;

    if (!isShown.value || id === undefined || id === openedConversationId || opensOneQuestion) {
        return;
    }

    openedConversationId = id;
    readShown();
}

onMounted(readOnOpen);
watch(
    () => conversation.value?.id,
    () => {
        replyingTo.value = null;
        readOnOpen();
    },
);
watch(isShown, readOnOpen);

/**
 * Reads the chat window again for a question that failed to show; it marks nothing.
 */
function retryFocused(): void {
    router.reload({ only: [props.protectedProp] });
}
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
            <template v-if="isShown">
                <template v-if="chat.focusedQuestionId !== undefined">
                    <FocusedQuestion
                        :key="chat.focusedQuestionId"
                        :focused="chat.focusedQuestion"
                        @reply="(message) => (replyingTo = message)"
                        @retry="retryFocused"
                    />
                </template>
                <MessageList
                    :messages="conversation.messages"
                    :pending="pending"
                    :refused="refused"
                    :own-inbox-id="conversation.sourceInboxId"
                    @reply="(message) => (replyingTo = message)"
                    @check-again="(intent) => owner?.checkAgain(intent)"
                    @restore="(intentKey) => owner?.restore(intentKey)"
                    @discard="(intentKey) => owner?.discardRecovery(intentKey)"
                />
                <p role="status" aria-live="polite" class="sr-only">{{ owner?.announcement.value }}</p>
                <template v-if="unreadShown.length > 0">
                    <p class="flex items-center gap-2 text-small text-text-3">
                        <button type="button" class="underline" @click="readShown">
                            Read shown messages
                        </button>
                        <span>Reading is shared with everyone at this inbox.</span>
                    </p>
                </template>
                <SlotSections :sections="chat.dockSections" />
                <DockStack
                    :key="conversation.id"
                    :dock="conversation.dock"
                    :agent-id="conversation.agentId"
                    :load-more="loadMore"
                />
                <Composer
                    :draft-key="key"
                    :agent="conversation.agentId"
                    :agent-name="selected.name"
                    :session-id="conversation.sessionId"
                    :session-generation="conversation.sessionGeneration"
                    :source-inbox-id="conversation.sourceInboxId"
                    :destination-inbox-id="conversation.destinationInboxId"
                    :replying-to="replyingTo"
                    :conversation-prop="protectedProp"
                    @replied="replyingTo = null"
                />
            </template>
            <template v-else>
                <p class="m-auto text-empty text-text-3" role="status">Loading the conversation…</p>
            </template>
        </template>
        <template v-else>
            <p class="m-auto text-empty text-text-3">
                Choose an agent to talk to.
            </p>
        </template>
    </section>
</template>
