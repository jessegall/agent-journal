// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import type { ConversationData } from '@generated/types/chat';
import { holdsContract, RECORDED } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';

const sent: SentRequest[] = vi.hoisted(() => []);

vi.mock('@inertiajs/vue3', async () => (await import('@kit/testing/pageRequests')).recordingInertia(sent));
vi.mock('@kit/requestId', () => ({ newRequestId: () => 'request-1' }));
// The roster's search for users to add answers with one candidate who is not in the chat yet.
vi.mock('@kit/loaders', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@kit/loaders')>()),
    load: async () => ({
        status: 'ok',
        value: { candidates: [{ actor: `user:${RECORDED.candidate}`, label: 'Cy', driver: null }] },
    }),
}));

const { default: ChatRoster } = await import('./pages/chat/partials/ChatRoster.vue');
const { default: CreateChatForm } = await import('./pages/chat/partials/CreateChatForm.vue');
const { sendReaction } = await import('./reactions');
const { useConversationIntents } = await import('./composables/useConversationIntents');

const member = `user:${RECORDED.member}`;

const conversation = {
    inboxId: RECORDED.inbox,
    viewer: 'user:owner',
    participants: [
        { actor: 'user:owner', label: 'Ada', driver: null, role: 'owner' },
        { actor: member, label: 'Bea', driver: null, role: 'member' },
    ],
    capabilities: { canAdd: true, canRemove: true, canTransfer: true, canLeave: false, canClose: true },
} as unknown as ConversationData;

function last(): SentRequest | undefined {
    return sent.at(-1);
}

describe('the Inertia posts of the chat, as the page sends them', () => {
    it('sends a message', () => {
        const owner = useConversationIntents('chat-requests');
        const intent = owner.beginSend({
            draftKey: 'chat-requests',
            text: 'Hello',
            agent: null,
            expectedSessionId: null,
            inboxId: RECORDED.inbox,
        });
        owner.submit(intent, 'conversation');

        holdsContract('chat-send', last());
    });

    it('reacts to a message', () => {
        sendReaction(RECORDED.inbox, RECORDED.message, '👍', 'conversation');

        holdsContract('chat-react', last());
    });

    it('opens a group chat', async () => {
        const form = mount(CreateChatForm);
        await form.find('input').setValue('Design');
        await form.find('form').trigger('submit');

        holdsContract('chat-create-group', last());
    });

    it('removes a member, makes a member owner and closes the chat', async () => {
        const roster = mount(ChatRoster, { props: { conversation, conversationProp: 'conversation' } });
        const press = (label: string) => roster.findAll('button').find((button) => button.text() === label)?.trigger('click');

        await press('Remove');
        holdsContract('chat-remove-member', last());
        await press('Make owner');
        holdsContract('chat-transfer', last());
        await press('Close chat');
        holdsContract('chat-close', last());
    });

    it('adds a user the search found', async () => {
        const roster = mount(ChatRoster, { props: { conversation, conversationProp: 'conversation' } });
        await roster.findAll('button').find((button) => button.text() === 'Add users')?.trigger('click');
        await flushPromises();
        await roster.findAll('a, button').find((link) => link.text() === 'Add')?.trigger('click');

        holdsContract('chat-add-member', last());
    });

    it('leaves the chat as a member', async () => {
        const asMember = {
            ...conversation,
            viewer: member,
            capabilities: { canAdd: false, canRemove: false, canTransfer: false, canLeave: true, canClose: false },
        } as unknown as ConversationData;
        const roster = mount(ChatRoster, { props: { conversation: asMember, conversationProp: 'conversation' } });
        await roster.findAll('button').find((button) => button.text() === 'Leave')?.trigger('click');

        holdsContract('chat-leave', { ...last()!, as: 'member' });
    });
});
