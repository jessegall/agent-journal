// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

const purgers: Array<() => void> = [];

const begun: string[] = [];

vi.mock('./composables/useConversationIntents', async () => {
    const { useMessageDrafts: drafts } = await import('./composables/useMessageDrafts');

    return {
        useConversationIntents: () => ({
            beginSend: (draft: { draftKey: string; text: string }) => {
                begun.push(draft.text);
                drafts().clearSent(draft.draftKey, draft.text);

                return { key: 'intent-1' };
            },
            submit: () => undefined,
        }),
    };
});
vi.mock('@kit/protectedView', () => ({
    onPurge: (purger: () => void) => {
        purgers.push(purger);

        return () => undefined;
    },
}));
vi.mock('@kit/Button', () => ({ default: { template: '<button><slot /></button>' } }));
vi.mock('@kit/Icon', () => ({ default: { template: '<i />' } }));
vi.mock('./composables/useComposerHeight', () => ({ useComposerHeight: () => undefined }));

const { useMessageDrafts } = await import('./composables/useMessageDrafts');
const { default: Composer } = await import('./Composer.vue');

function mountComposer() {
    return mount(Composer, {
        props: {
            draftKey: 'user-1/agent-1',
            agent: 'agent-1',
            agentName: 'Main agent',
            sessionId: null,
            sessionGeneration: 0,
            sourceInboxId: 'inbox-user',
            destinationInboxId: 'inbox-agent',
            replyingTo: null,
            conversationProp: 'window_chat_conversation',
        },
    });
}

describe('Composer', () => {
    it('clears the text at once when Enter sends it, before any answer', async () => {
        const composer = mountComposer();
        await composer.find('textarea').setValue('Hello there');

        await composer.find('textarea').trigger('keydown.enter');

        expect(begun).toContain('Hello there');
        expect((composer.find('textarea').element as HTMLTextAreaElement).value).toBe('');
    });

    it('shows the stored draft once mounted, and a purge empties it and removes the stored draft', async () => {
        useMessageDrafts().write('user-1/agent-1', 'Half a thought');
        const composer = mountComposer();
        await flushPromises();
        expect((composer.find('textarea').element as HTMLTextAreaElement).value).toBe('Half a thought');

        purgers.forEach((purger) => purger());
        await flushPromises();

        expect((composer.find('textarea').element as HTMLTextAreaElement).value).toBe('');
        expect(useMessageDrafts().read('user-1/agent-1')).toBe('');
    });
});
