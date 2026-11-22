// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PendingMessage from './PendingMessage.vue';
import RefusedSend from './RefusedSend.vue';
import type { ConversationIntent } from './composables/useConversationIntents';

vi.mock('@generated/routes/chat', () => ({ history: () => ({ url: '/chat/history' }) }));

describe('the states of a send', () => {
    it('shows a spinner while a message is sending', () => {
        const intent = { key: 'a', text: 'Hello', status: 'sending' } as ConversationIntent;
        const view = mount(PendingMessage, { props: { intent } });

        expect(view.find('[aria-hidden="true"]').exists()).toBe(true);
        expect(view.text()).toContain('Sending');
    });

    it('keeps a refused message with Retry, which restores its text, and Discard', async () => {
        const view = mount(RefusedSend, {
            props: { entry: { intentKey: 'a', text: 'Hello' } as never, reason: 'Not delivered' },
        });

        expect(view.text()).toContain('Hello');

        await view.findAll('button').find((button) => button.text() === 'Retry')?.trigger('click');
        await view.findAll('button').find((button) => button.text() === 'Discard')?.trigger('click');

        expect(view.emitted('restore')).toEqual([['a']]);
        expect(view.emitted('discard')).toEqual([['a']]);
    });
});
