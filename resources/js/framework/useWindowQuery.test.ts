// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { provideHostProp } from './hostProp';
import { provideWindowKey, useWindowReload } from './useWindowQuery';

vi.mock('@inertiajs/vue3', () => ({ router: { reload: vi.fn() }, usePage: () => ({ url: '/' }) }));

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
    afterEach(() => vi.mocked(router.reload).mockClear());

    it('replaces the selected copy query and leaves siblings intact when a filter is cleared', () => {
        window.history.replaceState(
            null,
            '',
            '/?window[project][open][0]=src&window[files][path]=a.go&window[files~abcdef123456][q]=x',
        );

        reloadIn('files~abcdef123456')({ path: 'b.go', q: undefined });

        expect(vi.mocked(router.reload).mock.calls[0][0]).toMatchObject({
            only: ['window_files'],
            data: {
                window: {
                    project: { open: { 0: 'src' } },
                    files: { path: 'a.go' },
                    'files~abcdef123456': { path: 'b.go', q: undefined },
                },
            },
        });
    });
});
