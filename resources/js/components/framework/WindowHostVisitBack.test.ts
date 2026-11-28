// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';

type Visit = { method: string; only: string[]; headers: Record<string, string> };
type BeforeListener = (event: { detail: { visit: Visit } }) => boolean | void;
type ReloadOptions = {
    only: string[];
    onCancelToken?: (token: { cancel: () => void }) => void;
    onSuccess?: (page: unknown) => void;
    onFinish?: () => void;
};

// Home with its plans window, a live prop the page asks for only once the window opens.
const page = reactive({
    component: 'Home',
    url: '/',
    props: {} as Record<string, unknown>,
    liveProps: { window_plans: {} } as Record<string, unknown>,
    deferredProps: {} as Record<string, string[]>,
});
// Every router event a module listens to; the test fires before and navigate.
const listeners: Record<string, Array<BeforeListener & (() => void)>> = { before: [], navigate: [] };

vi.mock('@inertiajs/vue3', () => ({
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
    usePage: () => page,
    router: {
        on: (type: string, listener: BeforeListener & (() => void)) => {
            (listeners[type] ??= []).push(listener);

            return () => (listeners[type] = listeners[type].filter((known) => known !== listener));
        },
        // As Inertia does: a visit a before listener cancels is never sent and calls back nothing.
        reload: (options: ReloadOptions) => {
            const visit = { method: 'get', only: options.only, headers: {} };

            if (listeners.before.some((listener) => listener({ detail: { visit } }) === false)) {
                return;
            }

            options.onCancelToken?.({ cancel: () => undefined });
            options.only.forEach((prop) => (page.props[prop] = { status: 'ready', data: { name: 'Plans' } }));
            options.onSuccess?.(page);
            options.onFinish?.();
        },
        replaceProp: (name: string, value: unknown) => (page.props[name] = value),
        visit: vi.fn(),
    },
}));
vi.mock('@/routes', () => ({ login: () => '/login' }));
vi.mock('@/composables/liveTrace', () => ({ traceLive: vi.fn() }));
vi.mock('@/framework/appContext', () => ({ useAppContext: () => ({ viewer: { value: { id: 'user-1' } } }) }));

const { useLiveVisits } = await import('@/composables/usePageChanges');
const { default: WindowHost } = await import('./WindowHost.vue');

const PlansWindow = defineComponent({
    props: { data: { type: Object, required: true } },
    setup: () => () => h('p', 'The plans'),
});

function openPlansWindow() {
    return mount(WindowHost, {
        props: { component: PlansWindow, propName: 'window_plans', pageKey: 'plans', subject: 'Plans' },
    });
}

function arriveOn(component: string, url: string): void {
    page.component = component;
    page.url = url;
    page.props = {};
    listeners.navigate.forEach((arrived) => arrived());
}

describe('WindowHost on a visit back to Home', () => {
    it('shows the window content, not its skeleton, after leaving Home for another page and coming back', async () => {
        // The shell, and with it the live client's interception, is mounted for the whole visit.
        mount(defineComponent({ setup: () => { useLiveVisits(); return () => h('div'); } }));
        const first = openPlansWindow();
        await flushPromises();
        expect(first.text()).toContain('The plans');

        arriveOn('Plans', '/plans');
        first.unmount();
        arriveOn('Home', '/');
        const back = openPlansWindow();
        await flushPromises();

        expect(back.text()).toContain('The plans');
        expect(back.text()).not.toContain('Loading Plans');
    });
});
