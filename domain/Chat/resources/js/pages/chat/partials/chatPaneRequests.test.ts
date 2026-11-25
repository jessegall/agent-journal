// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { ref } from 'vue';
import type { ChatData } from '@generated/types/chat';
import { holdsContract, RECORDED } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';

const sent: SentRequest[] = vi.hoisted(() => []);
const revealedProps = ref(new Set<string>());

vi.mock('@inertiajs/vue3', async () => (await import('@kit/testing/pageRequests')).recordingInertia(sent));
vi.mock('@kit/notifications', () => ({
    LEASE_MILLISECONDS: 30_000,
    useNotifications: () => ({}),
}));
vi.mock('@kit/protectedView', () => ({
    isRevealed: (prop: string) => revealedProps.value.has(prop),
    onPurge: () => () => undefined,
}));
vi.mock('../../../composables/useConversationIntents', () => ({
    useConversationIntents: () => ({
        rows: (messages: unknown[]) => messages.map((message) => ({ kind: 'message', message })),
        settle: () => undefined,
        recoveryEntries: () => [],
        refusalOf: () => '',
        announcement: { value: '' },
    }),
}));
vi.mock('../../../composables/useChatTimeline', async () => {
    const { computed, ref } = await import('vue');

    return {
        useChatTimeline: (conversation: { value?: { messages?: { id: string; isReadByMe: boolean }[] } }) => ({
            messages: computed(() => conversation.value?.messages ?? []),
            unreadShown: computed(() =>
                (conversation.value?.messages ?? []).filter((row) => !row.isReadByMe).map((row) => row.id),
            ),
            lines: ref([]),
            hasOlder: ref(false),
            loadOlder: vi.fn(),
            catchUp: vi.fn(),
            accessEnded: ref(false),
        }),
    };
});
vi.mock('@kit/SlotSections', () => ({ default: { template: '<div />' } }));
vi.mock('./MessageList.vue', () => ({ default: { name: 'MessageList', template: '<ol aria-label="Messages" />' } }));
vi.mock('./DockStack.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./Composer.vue', () => ({ default: { template: '<form aria-label="Composer" />' } }));
vi.mock('./AgentPicker.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./ChatRoster.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./InboxSelector.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./AgentSessionActions.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./VerifyingSessionCard.vue', () => ({ default: { template: '<div />' } }));

const { default: ChatPane } = await import('./ChatPane.vue');

const PROP = 'window_chat_conversation';

// The owner's group chat with one message the owner has not read yet.
const chat = {
    agents: [],
    selectedAgentId: null,
    isSetupRequired: false,
    dockSections: [],
    chats: [],
    canCreateChats: false,
    conversation: {
        inboxId: RECORDED.inbox,
        agentId: null,
        viewer: 'user:owner',
        participants: [],
        capabilities: { canAdd: false, canRemove: false, canTransfer: false, canLeave: false, canClose: false },
        sessionId: null,
        sessionGeneration: 0,
        dock: { cards: [], hasMore: null },
        messages: [{ id: RECORDED.message, speaker: { actor: `user:${RECORDED.member}`, label: 'Bea', driver: null }, isReadByMe: false }],
    },
} as unknown as ChatData;

function pane() {
    return mount(ChatPane, {
        props: {
            chat,
            offersChoice: false,
            agentUrl: () => '/chat',
            chatUrl: () => '/chat',
            questionUrl: () => '/chat?question=1',
            loadMore: () => undefined,
            protectedProp: PROP,
        },
    });
}

describe('the Inertia posts of the chat pane, as the page sends them', () => {
    it('marks the rows it shows as read, and declines a question asked of the viewer', async () => {
        const shown = pane();
        revealedProps.value = new Set([PROP]);
        await flushPromises();
        holdsContract('chat-read', sent.at(-1));

        shown.findComponent({ name: 'MessageList' }).vm.$emit('decline', { id: RECORDED.question });
        await flushPromises();
        holdsContract('chat-decline', sent.at(-1));
    });
});
