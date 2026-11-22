// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ConversationData } from '@generated/types/chat';

vi.mock('@inertiajs/vue3', () => ({
    router: { post: vi.fn() },
    useHttp: () => ({ get: vi.fn() }),
}));
vi.mock('@generated/routes/chat', () => ({
    addMember: () => ({ url: '/chat/chats/members' }),
    candidates: () => ({ url: '/chat/chats/candidates' }),
    close: () => ({ url: '/chat/chats/close' }),
    leave: () => ({ url: '/chat/chats/leave' }),
    removeMember: () => ({ url: '/chat/chats/members/remove' }),
    transfer: () => ({ url: '/chat/chats/transfer' }),
}));

const { default: ChatRoster } = await import('./ChatRoster.vue');

function conversationWith(owner: boolean): ConversationData {
    return {
        inboxId: 'inbox-1',
        viewer: 'user:ada',
        participants: [
            { actor: 'user:ada', label: 'Ada', driver: null, role: owner ? 'owner' : 'member' },
            { actor: 'user:bea', label: 'Bea', driver: null, role: owner ? 'member' : 'owner' },
        ],
        capabilities: { add: owner, remove: owner, transfer: owner, leave: !owner, close: owner },
    } as unknown as ConversationData;
}

describe('ChatRoster', () => {
    it('offers the owner its controls and a member only to leave', () => {
        const owner = mount(ChatRoster, { props: { conversation: conversationWith(true), conversationProp: 'page' } });
        const member = mount(ChatRoster, { props: { conversation: conversationWith(false), conversationProp: 'page' } });

        expect(owner.text()).toContain('Remove');
        expect(owner.text()).toContain('Make owner');
        expect(owner.text()).toContain('Close chat');
        expect(member.text()).not.toContain('Remove');
        expect(member.text()).toContain('Leave');
    });
});
