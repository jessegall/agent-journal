// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
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
        rows: (entries: unknown[]) => entries.map((entry) => ({ kind: 'entry', entry })),
        settle: () => undefined,
        recoveryEntries: () => [],
        refusalOf: () => '',
        announcement: { value: '' },
    }),
}));
vi.mock('../../../composables/useChatTimeline', async () => {
    const { computed, ref } = await import('vue');

    return {
        useChatTimeline: (conversation: {
            value?: { entries?: { message: { id: string; isReadByViewer: boolean } }[] };
        }) => ({
            entries: computed(() => conversation.value?.entries ?? []),
            unreadShown: computed(() =>
                (conversation.value?.entries ?? [])
                    .filter((entry) => !entry.message.isReadByViewer)
                    .map((entry) => entry.message.id),
            ),
            hasOlder: ref(false),
            loadOlder: vi.fn(),
            accessEnded: ref(false),
        }),
    };
});
vi.mock('@kit/SlotSections', () => ({ default: { template: '<div />' } }));
vi.mock('./MessageList.vue', () => ({ default: { name: 'MessageList', template: '<ol aria-label="Messages" />' } }));
vi.mock('./DockStack.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./Composer.vue', () => ({ default: { template: '<form aria-label="Composer" />' } }));
vi.mock('./ConversationMenu.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./ChatRoster.vue', () => ({ default: { template: '<div />' } }));
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
        entries: [
            {
                id: RECORDED.message,
                type: 'message',
                author: `user:${RECORDED.member}`,
                authorLabel: 'Bea',
                message: { id: RECORDED.message, isReadByViewer: false },
            },
        ],
    },
} as unknown as ChatData;

function pane() {
    return mount(ChatPane, {
        props: {
            chat,
            offersChoice: false,
            agentUrl: () => '/chat',
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
        shown.unmount();
    });

    it('marks what it shows as read again when the user comes back to the page, with no link to press', async () => {
        const shown = pane();
        revealedProps.value = new Set([PROP]);
        await flushPromises();
        const before = sent.length;
        vi.spyOn(document, 'hasFocus').mockReturnValue(true);

        window.dispatchEvent(new Event('focus'));
        await flushPromises();

        holdsContract('chat-read', sent.at(-1));
        expect([sent.length - before, shown.text().includes('Read shown messages')]).toEqual([1, false]);
    });
});
