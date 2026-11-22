// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ConversationIntent } from './composables/useConversationIntents';

vi.mock('@inertiajs/vue3', () => ({ Link: { template: '<a><slot /></a>' }, router: { on: vi.fn() } }));
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
    return mount(MessageList, { props: { lines: [], messages: [], pending, refused, viewer: 'user:user-1', participants: [] } as never });
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
            actions: { answer, decline: answer, retryDelivery: false },
            readByMe: true,
            sentAt: '2026-11-22T13:42:00Z',
            requestKey: null,
            deliveries: [],
        });
        const participants = [
            { actor: 'user:ada', label: 'Ada', driver: null, role: 'owner' },
            { actor: 'user:bea', label: 'Bea', driver: null, role: 'member' },
        ];
        const asBea = mount(MessageList, {
            props: { lines: [], messages: [row('q1', true)], pending: [], refused: [], viewer: 'user:bea', participants, questionUrl: () => '#' } as never,
        });
        const asCy = mount(MessageList, {
            props: { lines: [], messages: [row('q1', false)], pending: [], refused: [], viewer: 'user:cy', participants, questionUrl: () => '#' } as never,
        });

        expect(asBea.text()).toContain('Ada');
        expect(asBea.text()).toContain('→ Bea');
        expect(asBea.text()).toContain('The original was removed');
        expect(asBea.find('article').attributes('aria-label')).toBe('Ada to Bea');
        expect(asBea.find('article').attributes('tabindex')).toBe('0');
        expect(asBea.find('a[href^="#message-"]').exists()).toBe(false);
        expect(asBea.text()).toContain('Answer');
        expect(asBea.text()).toContain('Decline');
        expect(asCy.text()).toContain('Reply');
        expect(asCy.text()).not.toContain('Decline');
    });

    it('shows which recipient was given up from which character, and the retry only when the server offers it', () => {
        const row = (retryDelivery: boolean) => ({
            id: 'm1',
            sequence: 1,
            rootId: null,
            speaker: { actor: 'user:ada', label: 'Ada', driver: null },
            addressedTo: null,
            replyTo: null,
            body: 'Plan?',
            state: 'sent',
            stateVersion: 0,
            respondent: null,
            actions: { answer: false, decline: false, retryDelivery },
            readByMe: true,
            sentAt: '2026-11-22T13:42:00Z',
            requestKey: null,
            deliveries: [
                { recipient: 'agent:claude', label: 'Claude', state: 'accepted', reason: null, pendingFrom: null, rangeId: null },
                {
                    recipient: 'agent:codex',
                    label: 'Codex',
                    state: 'exhausted',
                    reason: 'The driver did not answer.',
                    pendingFrom: 8000,
                    rangeId: retryDelivery ? 'range-1' : null,
                },
            ],
        });
        const props = { lines: [], pending: [], refused: [], viewer: 'user:ada', participants: [], questionUrl: () => '#', conversationProp: 'chat' };
        const operator = mount(MessageList, { props: { ...props, messages: [row(true)] } as never });
        const sender = mount(MessageList, { props: { ...props, messages: [row(false)] } as never });

        expect(operator.text()).toContain('Codex: Not delivered');
        expect(operator.text()).toContain('from character 8000');
        expect(operator.text()).not.toContain('Claude:');
        expect(operator.findAll('button').map((button) => button.text())).toContain('Retry');
        expect(sender.text()).toContain('Codex: Not delivered');
        expect(sender.text()).not.toContain('Retry');
    });

    it('shows a plain line between the messages at its timeline position', () => {
        const message = (id: string, sequence: number) => ({
            id,
            sequence,
            rootId: null,
            speaker: { actor: 'user:ada', label: 'Ada', driver: null },
            addressedTo: null,
            replyTo: null,
            body: `Body ${id}`,
            state: 'sent',
            stateVersion: 0,
            respondent: null,
            actions: { answer: false, decline: false, retryDelivery: false },
            readByMe: true,
            sentAt: '2026-11-22T13:42:00Z',
            requestKey: null,
            deliveries: [],
        });
        const step = { sequence: 2, subject: 'Ship', line: 'Step 1 of 4', postedAt: '2026-11-22T13:43:00Z' };
        const list = mount(MessageList, {
            props: {
                lines: [step],
                messages: [message('first', 1), message('second', 3)],
                pending: [],
                refused: [],
                viewer: 'user:bea',
                participants: [],
                questionUrl: () => '#',
            } as never,
        });
        const text = list.text();

        expect(text.indexOf(step.line)).toBeGreaterThan(text.indexOf('Body first'));
        expect(text.indexOf(step.line)).toBeLessThan(text.indexOf('Body second'));
    });
});
