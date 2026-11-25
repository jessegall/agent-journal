// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';

const page = reactive({
    component: 'Home',
    url: '/',
    props: { window_plans: { state: 'ready', data: {} } } as Record<string, unknown>,
});
const replaced: Array<[string, unknown]> = [];

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: {
        reload: vi.fn(),
        replaceProp: (name: string, value: unknown) => replaced.push([name, value]),
    },
}));
vi.mock('@/framework/appContext', () => ({ useAppContext: () => ({ viewer: { value: { id: 'user-1' } } }) }));

const { useWindowProps } = await import('./useWindowProps');

function mountWindow() {
    return mount(defineComponent({ setup: () => { useWindowProps('window_plans'); return () => h('div'); } }));
}

describe('useWindowProps', () => {
    beforeEach(() => {
        replaced.length = 0;
        page.component = 'Home';
        page.url = '/';
    });

    it('drops the prop when its last mount closes, so the live client no longer reads it', () => {
        const first = mountWindow();
        const second = mountWindow();

        first.unmount();
        expect(replaced).toEqual([]);
        second.unmount();

        expect(replaced).toEqual([['window_plans', undefined]]);
    });

    it('keeps the prop of the next page when a navigation unmounts the window', () => {
        const shown = mountWindow();

        page.component = 'Plans';
        page.url = '/plans';
        shown.unmount();

        expect(replaced).toEqual([]);
    });
});
