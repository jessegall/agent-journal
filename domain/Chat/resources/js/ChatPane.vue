<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { useChatTimeline } from './composables/useChatTimeline';
import { useConversationIntents } from './composables/useConversationIntents';
import { draftKey } from './composables/useMessageDrafts';
import type { AgentOptionData, ChatData } from '@generated/types/chat';
import type { ReplyTarget } from './composables/useConversationIntents';
import { isRevealed } from '@kit/protectedView';
import SlotSections from '@kit/SlotSections';
import { decline as declineRoute, read as readRoute } from '@generated/routes/chat';
import AgentPicker from './AgentPicker.vue';
import AgentSessionActions from './AgentSessionActions.vue';
import Composer from './Composer.vue';
import DockStack from './dock/DockStack.vue';
import FocusedQuestion from './FocusedQuestion.vue';
import MessageList from './MessageList.vue';
import ChatRoster from './chats/ChatRoster.vue';
import InboxSelector from './chats/InboxSelector.vue';

/**
 * The chat (doc 4, 6.1): the chosen agent's conversation, what other domains suggest in the dock slot, the sources
 * docked in the conversation and the composer. On Chat's own page it also offers the agents and their session actions, which
 * Home's agent bar offers instead.
 */
const props = defineProps<{
    chat: ChatData;
    offersChoice: boolean;
    agentUrl: (agent: AgentOptionData) => string;
    chatUrl: (inboxId: string) => string;
    questionUrl: (messageId: string) => string;
    loadMore: (token: string) => void;
    protectedProp: string;
}>();

const page = usePage();
const conversation = computed(() => props.chat.conversation);
/**
 * The agent whose session controls show: the one chosen from the roster, else the chat's own agent, else the first
 * agent in it. Each agent keeps its own controls, keyed by its id and session generation; a chat with no agent has
 * none.
 */
const chosenAgentId = ref<string | null>(null);
const agentIdsInChat = computed(() => (conversation.value?.participants ?? [])
    .filter((member) => member.actor.startsWith('agent:'))
    .map((member) => member.actor.slice('agent:'.length)));
const selected = computed(() => {
    const ids = agentIdsInChat.value;
    const wanted = chosenAgentId.value !== null && ids.includes(chosenAgentId.value)
        ? chosenAgentId.value
        : conversation.value?.agentId ?? ids[0];

    return props.chat.agents.find((agent) => agent.id === wanted);
});
const key = computed(() => {
    const user = page.props.currentUser;

    return conversation.value === undefined || !user
        ? undefined
        : draftKey(user.id, conversation.value.inboxId);
});
const replyingTo = ref<ReplyTarget | null>(null);

/**
 * This view's own rows of the chat, merged in timeline order without gaps or duplicates, and paged back on request.
 */
const timeline = useChatTimeline(conversation);

/**
 * The owner of the user's sends in this conversation, the same one Home and Chat's page share.
 */
const owner = computed(() => (key.value === undefined ? undefined : useConversationIntents(key.value)));
const shownRows = computed(() => owner.value?.rows(timeline.messages.value) ?? []);
const pending = computed(() => shownRows.value.flatMap((row) => (row.kind === 'intent' ? [row.intent] : [])));
const refused = computed(() =>
    (owner.value?.recoveryEntries() ?? []).map((entry) => ({
        entry,
        reason: owner.value?.refusalOf(entry.intentKey) ?? '',
    })),
);

// A read that returned the user's own sends settles them.
watch(timeline.messages, (messages) => owner.value?.settle(messages));
const unreadShown = timeline.unreadShown;

/**
 * Marks the incoming rows this view shows as read by the viewer alone: only rows actually shown, never one held past
 * a gap; acknowledging one already read changes nothing. It runs when the user opens the
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
            inboxId: shown.inboxId,
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
    const id = conversation.value?.inboxId;

    const opensOneQuestion = props.chat.focusedQuestionId !== undefined;

    if (!isShown.value || id === undefined || id === openedConversationId || opensOneQuestion) {
        return;
    }

    openedConversationId = id;
    readShown();
}

onMounted(readOnOpen);
watch(
    () => conversation.value?.inboxId,
    () => {
        replyingTo.value = null;
        readOnOpen();
    },
);
watch(isShown, readOnOpen);

/**
 * Declines a question the viewer was asked; the server checks it is the respondent and records why.
 */
function decline(message: ReplyTarget): void {
    router.post(
        declineRoute().url,
        { messageId: message.id, reason: 'Declined in the chat.' },
        { preserveScroll: true, preserveState: true, only: [props.protectedProp] },
    );
}

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
            <InboxSelector
                :chats="chat.chats"
                :selected-inbox-id="conversation?.inboxId"
                :can-create-chats="chat.canCreateChats"
                :chat-url="chatUrl"
            />
        </template>
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
        <template v-if="chat.setupNotice">
            <p class="text-small text-text-2">{{ chat.setupNotice }}</p>
        </template>
        <template v-if="conversation && key">
            <template v-if="offersChoice && selected">
                <AgentSessionActions :key="`${selected.id}-${selected.sessionGeneration}`" :agent="selected" />
            </template>
            <ChatRoster
                :conversation="conversation"
                :conversation-prop="protectedProp"
                :chosen-agent-id="selected?.id ?? null"
                @choose-agent="(agentId) => (chosenAgentId = agentId)"
            />
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
                    :messages="timeline.messages.value"
                    :has-older="timeline.hasOlder.value"
                    :pending="pending"
                    :refused="refused"
                    :viewer="conversation.viewer"
                    :participants="conversation.participants"
                    :question-url="questionUrl"
                    :conversation-prop="protectedProp"
                    @reply="(message) => (replyingTo = message)"
                    @older="timeline.loadOlder"
                    @decline="decline"
                    @check-again="(intent) => owner?.retry(intent, protectedProp)"
                    @restore="(intentKey) => owner?.restore(intentKey)"
                    @discard="(intentKey) => owner?.discardRecovery(intentKey)"
                />
                <p role="status" aria-live="polite" class="sr-only">{{ owner?.announcement.value }}</p>
                <template v-if="unreadShown.length > 0">
                    <p class="flex items-center gap-2 text-small text-text-3">
                        <button type="button" class="underline" @click="readShown">
                            Read shown messages
                        </button>
                        <span>Only your own reading changes.</span>
                    </p>
                </template>
                <SlotSections :sections="chat.dockSections" />
                <DockStack
                    :key="conversation.inboxId"
                    :dock="conversation.dock"
                    :agent-id="conversation.agentId"
                    :inbox-id="conversation.inboxId"
                    :load-more="loadMore"
                />
                <Composer
                    :draft-key="key"
                    :agent="agentIdsInChat.length === 1 ? (selected?.id ?? null) : null"
                    :addressee-name="selected?.name ?? null"
                    :session-id="conversation.sessionId"
                    :session-generation="conversation.sessionGeneration"
                    :inbox-id="conversation.inboxId"
                    :replying-to="replyingTo"
                    :participants="conversation.participants"
                    :viewer="conversation.viewer"
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
