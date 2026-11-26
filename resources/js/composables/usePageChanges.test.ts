// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';

type ReloadOptions = {
    only: string[];
    async: boolean;
    onSuccess: () => void;
    onHttpException: (response: { status: number }) => boolean;
    onNetworkError: () => boolean;
    onFinish: () => void;
    onCancel: () => void;
};
type Visit = { method: string; only: string[]; headers: Record<string, string> };
type BeforeListener = (event: { detail: { visit: Visit } }) => boolean | void;

const reloads: ReloadOptions[] = [];
const ownBeforeAnswers: Array<boolean | void> = [];
const listeners: { before: BeforeListener[]; navigate: Array<() => void> } = { before: [], navigate: [] };
const page = reactive({
    props: { page: { status: 'ready' }, navigation: [] } as Record<string, unknown>,
    liveProps: { page: {}, navigation: {}, navigationCounts: {} } as Record<string, unknown>,
});

function fireBefore(visit: Visit): boolean | void {
    return listeners.before.map((listener) => listener({ detail: { visit } })).find((answer) => answer === false);
}

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: {
        on: (type: 'before' | 'navigate', listener: BeforeListener & (() => void)) => {
            listeners[type].push(listener);

            return () => (listeners[type] = listeners[type].filter((known) => known !== listener) as never);
        },
        reload: (options: ReloadOptions) => {
            // The tab's own read goes through the before event too, and must be let through.
            ownBeforeAnswers.push(fireBefore({ method: 'get', only: options.only, headers: {} }));
            reloads.push(options);
        },
        visit: vi.fn(),
    },
}));
vi.mock('@/routes', () => ({ login: () => '/login' }));
vi.mock('./protectedView', () => ({ purge: vi.fn(), trackProtectedRead: () => () => undefined }));
vi.mock('./liveTrace', () => ({ traceLive: vi.fn() }));

async function changes() {
    vi.resetModules();
    const module = await import('./usePageChanges');
    const { router } = await import('@inertiajs/vue3');
    const { purge } = await import('./protectedView');
    const shell = mount(defineComponent({ setup: () => { module.useLiveVisits(); return () => h('div'); } }));

    return { ...module, router, purge, shell };
}

function liveVisit(only: string[] = ['page']): Visit {
    return { method: 'get', only, headers: {} };
}

function answer(read: ReloadOptions, how: 'applied' | 'network' | number): void {
    if (how === 'applied') {
        read.onSuccess();
    } else if (how === 'network') {
        read.onNetworkError();
    } else {
        read.onHttpException({ status: how });
    }

    read.onFinish();
}

describe('usePageChanges', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        reloads.length = 0;
        ownBeforeAnswers.length = 0;
        listeners.before = [];
        listeners.navigate = [];
        vi.clearAllMocks();
    });

    afterEach(() => vi.useRealTimers());

    it('cancels the live client reload and reads its props as its own async reload, let through', async () => {
        await changes();

        expect(fireBefore(liveVisit(['page', 'navigation']))).toBe(false);

        expect(reloads).toHaveLength(1);
        expect(reloads[0]).toMatchObject({ only: ['page', 'navigation'], async: true });
        expect(ownBeforeAnswers).toEqual([undefined]);
    });

    it('never cancels a form, a navigation or a loader call', async () => {
        await changes();

        expect(fireBefore({ method: 'post', only: [], headers: {} })).toBeUndefined();
        expect(fireBefore({ method: 'get', only: [], headers: {} })).toBeUndefined();
        expect(fireBefore({ method: 'get', only: ['load_chat_rows'], headers: { 'X-Journal-Loader': 'chat.rows' } }))
            .toBeUndefined();
        expect(reloads).toHaveLength(0);
    });

    it('takes over a reconnect or tab-shown reload the same way, as an async read', async () => {
        await changes();

        fireBefore(liveVisit(['page', 'navigation', 'navigationCounts']));

        expect(reloads[0].async).toBe(true);
        expect(reloads[0].only).toEqual(['page', 'navigation']);
    });

    it('reads after a form is sent when an event arrives during the send', async () => {
        const { formSendingHooks } = await changes();
        const hooks = formSendingHooks();

        hooks.onStart();
        fireBefore(liveVisit());
        expect(reloads).toHaveLength(0);
        hooks.onFinish();

        expect(reloads).toHaveLength(1);
    });

    it('retries a failed read after 1, 2 and 4 seconds, marks its props stale, then waits for Retry', async () => {
        const { isPropStale, pageReadStatus, retryPageRead } = await changes();
        fireBefore(liveVisit());

        answer(reloads[0], 'network');
        expect(isPropStale('page')).toBe(true);
        vi.advanceTimersByTime(1000);
        answer(reloads[1], 'network');
        vi.advanceTimersByTime(2000);
        answer(reloads[2], 'network');
        vi.advanceTimersByTime(4000);
        answer(reloads[3], 'network');
        vi.advanceTimersByTime(10000);

        expect(reloads).toHaveLength(4);
        expect(pageReadStatus.value).toBe('failed');
        retryPageRead();
        answer(reloads[4], 'applied');
        expect(isPropStale('page')).toBe(false);
    });

    it('purges on 403 and goes to the sign-in page on 401 or 419', async () => {
        const { router, purge } = await changes();

        fireBefore(liveVisit());
        answer(reloads[0], 403);
        expect(purge).toHaveBeenCalledOnce();

        vi.advanceTimersByTime(1000);
        answer(reloads[1], 401);
        vi.advanceTimersByTime(2000);
        answer(reloads[2], 419);

        expect(router.visit).toHaveBeenCalledTimes(2);
        expect(router.visit).toHaveBeenCalledWith('/login');
    });

    it('reads the requested live props again when the window regains focus', async () => {
        await changes();

        window.dispatchEvent(new Event('focus'));

        expect(reloads[0].only).toEqual(['page', 'navigation']);
    });

    it('reads once for a catch-up', async () => {
        const { markDirty } = await changes();

        markDirty('catch-up');

        expect(reloads).toHaveLength(1);
    });

    it('reaches the generation a write marked once a read covering it applied', async () => {
        const { appliedReadGeneration, markDirty } = await changes();

        const marked = markDirty('write');
        expect(appliedReadGeneration.value).toBeLessThan(marked);
        answer(reloads[0], 'applied');

        expect(appliedReadGeneration.value).toBe(marked);
    });
});
