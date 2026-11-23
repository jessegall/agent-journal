// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { provideHostProp } from './hostProp';
import { provideWindowKey, useWindowReload } from './useWindowQuery';

vi.mock('@inertiajs/vue3', () => ({ router: { visit: vi.fn(), reload: vi.fn() }, usePage: () => ({ url: '/' }) }));

function reloadIn(key: string): ReturnType<typeof useWindowReload> {
    let reload: ReturnType<typeof useWindowReload> | undefined;
    const Child = defineComponent({ setup: () => { reload = useWindowReload(); return () => h('div'); } });
    mount(defineComponent({
        setup: () => {
            provideWindowKey(key);
            provideHostProp('window_files');

            return () => h(Child);
        },
    }));

    return reload!;
}

describe('reloading one Home window', () => {
    afterEach(() => vi.mocked(router.visit).mockClear());

    it('keeps every other window part of the address and replaces only the values it names', () => {
        window.history.replaceState(null, '', '/?window[project][open][0]=src&window[files][path]=a.go&window[files][q]=x');

        reloadIn('files')({ path: 'b.go' }, { onNetworkError: () => true, onHttpException: () => true });

        const address = decodeURIComponent(String(vi.mocked(router.visit).mock.calls[0][0]));
        expect(address).toContain('window[project][open][0]=src');
        expect(address).toContain('window[files][path]=b.go');
        expect(address).toContain('window[files][q]=x');
        expect(address).not.toContain('a.go');
        expect(vi.mocked(router.visit).mock.calls[0][1]).toMatchObject({ only: ['window_files'], preserveState: true });
    });
});
