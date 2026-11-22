// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ConversationIntent } from './composables/useConversationIntents';

vi.mock('@inertiajs/vue3', () => ({ Link: { template: '<a><slot /></a>' } }));
vi.mock('@generated/routes/chat', () => ({ history: () => ({ url: '/chat/history' }) }));

const { default: MessageList } = await import('./MessageList.vue');

function intent(status: ConversationIntent['status']): ConversationIntent {
    return {
        key: `key-${status}`,
        kind: 'send',
        body: {},
        text: `Text while ${status}`,
        replyToId: null,
        status,
        refusal: null,
        isTransportOpen: status === 'sending',
        confirmedGeneration: 0,
        checkedGeneration: 0,
    };
}

function listOf(pending: ConversationIntent[], refused: { entry: object; reason: string }[] = []) {
    return mount(MessageList, { props: { messages: [], pending, refused, viewer: 'user:user-1', participants: [] } as never });
}

describe('MessageList', () => {
    it('shows a send still settling as Sending with no reply or other action', () => {
        const list = listOf([intent('sending')]);

        expect(list.text()).toContain('Text while sending');
        expect(list.text()).toContain('Sending…');
        expect(list.findAll('button')).toHaveLength(0);
    });

    it('offers Check again for an outcome no lookup could tell', async () => {
        const list = listOf([intent('unknown')]);

        expect(list.text()).toContain("We couldn't confirm whether this was sent.");
        await list.get('button').trigger('click');
        expect(list.emitted('checkAgain')).toHaveLength(1);
    });

    it('shows a refused send with the server reason and its text, to restore or discard', async () => {
        const entry = { intentKey: 'key-1', draftKey: 'user-1/agent-1', text: 'My reply', replyToId: null };
        const list = listOf([], [{ entry: { ...entry, generation: 1, keptAt: 0 }, reason: 'The message changed.' }]);

        expect(list.text()).toContain('My reply');
        expect(list.text()).toContain('The message changed.');
        const [restore, discard] = list.findAll('button');
        await restore.trigger('click');
        await discard.trigger('click');
        expect(list.emitted('restore')).toEqual([['key-1']]);
        expect(list.emitted('discard')).toEqual([['key-1']]);
    });

    it('shows the addressee arrow, an unavailable original, and answer and decline only from the server actions', () => {
        const row = (id: string, answer: boolean) => ({
            id,
            sequence: 1,
            rootId: null,
            speaker: { actor: 'user:ada', label: 'Ada', driver: null },
            addressedTo: 'user:bea',
            replyTo: { id: null, visible: false },
            body: 'Ready?',
            state: 'waiting_for_answer',
            stateVersion: 0,
            respondent: 'user:bea',
            actions: { answer, decline: answer },
            readByMe: true,
            sentAt: '',
            requestKey: null,
        });
        const participants = [
            { actor: 'user:ada', label: 'Ada', driver: null, role: 'owner' },
            { actor: 'user:bea', label: 'Bea', driver: null, role: 'member' },
        ];
        const asBea = mount(MessageList, {
            props: { messages: [row('q1', true)], pending: [], refused: [], viewer: 'user:bea', participants, questionUrl: () => '#' } as never,
        });
        const asCy = mount(MessageList, {
            props: { messages: [row('q1', false)], pending: [], refused: [], viewer: 'user:cy', participants, questionUrl: () => '#' } as never,
        });

        expect(asBea.text()).toContain('Ada → Bea');
        expect(asBea.text()).toContain('Original unavailable');
        expect(asBea.text()).toContain('Answer');
        expect(asBea.text()).toContain('Decline');
        expect(asCy.text()).toContain('Reply');
        expect(asCy.text()).not.toContain('Decline');
    });
});
