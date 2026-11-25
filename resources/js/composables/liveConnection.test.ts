// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';
import type { LiveHandlers } from '@/echo';

const opened: Array<{ userId: string; handlers: LiveHandlers; leave: ReturnType<typeof vi.fn> }> = [];
const page = reactive({ props: { viewer: { type: 'owner', id: 'user-1', canShare: true } as { type: string; id?: string; canShare: boolean } } });

vi.mock('@/echo', () => ({
    connectUser: (userId: string, handlers: LiveHandlers) => {
        const connection = { userId, handlers, leave: vi.fn() };
        opened.push(connection);

        return connection;
    },
}));
vi.mock('@inertiajs/vue3', () => ({ usePage: () => page, router: { on: vi.fn(), reload: vi.fn() } }));
vi.mock('./usePageChanges', () => ({ markDirty: vi.fn(), forgetPageChanges: vi.fn(), useLiveVisits: vi.fn() }));
vi.mock('@/framework/liveTransport', () => ({ attachLiveConnection: vi.fn() }));
vi.mock('./protectedView', () => ({ clearProtectedViews: vi.fn(), purge: vi.fn() }));
vi.mock('./useNotifications', () => ({ followNotificationsSignal: vi.fn(), reconcileNotifications: vi.fn() }));

const { liveStage, retryLiveConnection, useLiveConnection } = await import('./useLiveConnection');
const { markDirty } = await import('./usePageChanges');
const { attachLiveConnection } = await import('@/framework/liveTransport');
const { clearProtectedViews, purge } = await import('./protectedView');

function mountShell() {
    return mount(defineComponent({ setup: () => { useLiveConnection(); return () => h('div'); } }));
}

describe('useLiveConnection', () => {
    beforeEach(() => {
        opened.length = 0;
        page.props.viewer = { type: 'owner', id: 'user-1', canShare: true };
        vi.clearAllMocks();
    });

    it('reads once to catch up when the channel is signed in to after the first render', () => {
        const shell = mountShell();

        opened[0].handlers.onSubscribed();

        expect(markDirty).toHaveBeenCalledExactlyOnceWith('catch-up');
        expect(liveStage.value).toBe('subscribed');
        shell.unmount();
    });

    it('clears protected views when the transport is lost and leaves the reconnect reads to the live client', () => {
        const shell = mountShell();
        opened[0].handlers.onSubscribed();
        vi.mocked(markDirty).mockClear();

        opened[0].handlers.onLost();
        expect(clearProtectedViews).toHaveBeenCalledOnce();
        expect(liveStage.value).toBe('connecting');
        opened[0].handlers.onSubscribed();

        expect(markDirty).not.toHaveBeenCalled();
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

        page.props.viewer = { type: 'owner', id: 'user-2', canShare: true };
        await Promise.resolve();
        opened[0].handlers.onProtectedViewInvalidated();
        opened[0].handlers.onSubscribed();

        expect(opened[0].leave).toHaveBeenCalledOnce();
        expect(purge).toHaveBeenCalledOnce();
        expect(opened[1].userId).toBe('user-2');
        expect(markDirty).not.toHaveBeenCalled();
        expect(vi.mocked(attachLiveConnection).mock.calls.map(([attached]) => attached)).toEqual([
            opened[0],
            null,
            opened[1],
        ]);
        shell.unmount();
    });

    it('clears protected views and reads the page again on an invalidation', () => {
        const shell = mountShell();

        opened[0].handlers.onProtectedViewInvalidated();

        expect(clearProtectedViews).toHaveBeenCalledOnce();
        expect(markDirty).toHaveBeenCalledExactlyOnceWith('signal');
        shell.unmount();
    });
});
