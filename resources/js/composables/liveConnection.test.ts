// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';
import type { LiveHandlers } from '@/echo';

const opened: Array<{ userId: string; handlers: LiveHandlers; leave: ReturnType<typeof vi.fn> }> = [];
const page = reactive({ props: { currentUser: { id: 'user-1' } as { id: string } | undefined } });

vi.mock('@/echo', () => ({
    connectUser: (userId: string, handlers: LiveHandlers) => {
        const connection = { userId, handlers, leave: vi.fn() };
        opened.push(connection);

        return connection;
    },
}));
vi.mock('@inertiajs/vue3', () => ({ usePage: () => page, router: { on: vi.fn(), reload: vi.fn() } }));
vi.mock('./usePageChanges', () => ({ markDirty: vi.fn(), pageChanged: vi.fn(), forgetPageChanges: vi.fn() }));
vi.mock('./protectedView', () => ({ clearProtectedViews: vi.fn(), purge: vi.fn() }));
vi.mock('./useNotifications', () => ({ followNotificationsSignal: vi.fn(), reconcileNotifications: vi.fn() }));

const { liveStage, retryLiveConnection, useLiveConnection } = await import('./useLiveConnection');
const { markDirty, pageChanged } = await import('./usePageChanges');
const { clearProtectedViews, purge } = await import('./protectedView');

function mountShell() {
    return mount(defineComponent({ setup: () => { useLiveConnection(); return () => h('div'); } }));
}

describe('useLiveConnection', () => {
    beforeEach(() => {
        opened.length = 0;
        page.props.currentUser = { id: 'user-1' };
        vi.clearAllMocks();
    });

    it('reads once to catch up when the channel is signed in to after the first render', () => {
        const shell = mountShell();

        opened[0].handlers.onSubscribed();

        expect(markDirty).toHaveBeenCalledExactlyOnceWith('catch-up');
        expect(liveStage.value).toBe('subscribed');
        shell.unmount();
    });

    it('clears protected views when the transport is lost and catches up once signed in again', () => {
        const shell = mountShell();
        opened[0].handlers.onSubscribed();
        vi.mocked(markDirty).mockClear();

        opened[0].handlers.onLost();
        expect(clearProtectedViews).toHaveBeenCalledOnce();
        expect(liveStage.value).toBe('connecting');
        opened[0].handlers.onChange();
        opened[0].handlers.onSubscribed();

        expect(pageChanged).toHaveBeenCalledOnce();
        expect(markDirty).toHaveBeenCalledExactlyOnceWith('catch-up');
        shell.unmount();
    });

    it('shows a refused channel sign-in and opens the connection again on Retry', () => {
        const shell = mountShell();

        opened[0].handlers.onRefused();
        expect(liveStage.value).toBe('refused');
        retryLiveConnection();

        expect(opened[0].leave).toHaveBeenCalledOnce();
        expect(opened).toHaveLength(2);
        expect(liveStage.value).toBe('connecting');
        shell.unmount();
    });

    it('drops the old connection on a user change and ignores what it reports later', async () => {
        const shell = mountShell();

        page.props.currentUser = { id: 'user-2' };
        await Promise.resolve();
        opened[0].handlers.onChange();
        opened[0].handlers.onSubscribed();

        expect(opened[0].leave).toHaveBeenCalledOnce();
        expect(purge).toHaveBeenCalledOnce();
        expect(opened[1].userId).toBe('user-2');
        expect(pageChanged).not.toHaveBeenCalled();
        expect(markDirty).not.toHaveBeenCalled();
        shell.unmount();
    });
});
