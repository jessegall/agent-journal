// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import ResultView from './ResultView.vue';
import { useIsStale } from './windowFreshness';
import type { WindowResult } from '@/generated/types/page-props';

const content = defineComponent({
    setup() {
        const isStale = useIsStale();

        return () => h('p', isStale.value ? 'rows, read-only' : 'rows');
    },
});

function mountResult(result: WindowResult<unknown> | undefined, keptData?: unknown, isWindow = true) {
    return mount(ResultView, {
        props: { result, keptData, isWindow },
        slots: { content: () => h(content) },
    });
}

describe('a window result', () => {
    it('shows a labelled skeleton while its first read runs', () => {
        const view = mountResult(undefined);

        expect(view.get('[role="status"]').attributes('aria-label')).toBe('Loading');
        expect(view.text()).toBe('');
    });

    it('offers Retry when its first read failed', async () => {
        const view = mountResult({ state: 'failed', message: 'This window could not be loaded.' });

        await view.get('button').trigger('click');

        expect(view.get('[role="alert"]').text()).toContain('This window could not be loaded.');
        expect(view.emitted('retry')).toHaveLength(1);
    });

    it('keeps the last read read-only when a refresh failed', async () => {
        const view = mountResult({ state: 'failed', message: 'This window could not be loaded.' }, { rows: [] });

        await view.get('button').trigger('click');

        expect(view.get('[role="alert"]').text()).toContain('It shows what it last loaded.');
        expect(view.get('p').text()).toBe('rows, read-only');
        expect(view.emitted('retry')).toHaveLength(1);
    });

    it('shows fresh content once a read succeeds', () => {
        const view = mountResult({ state: 'ready', data: { rows: [] } }, { rows: [] });

        expect(view.find('[role="alert"]').exists()).toBe(false);
        expect(view.text()).toBe('rows');
    });

    it('clears what it showed and says access is refused', () => {
        const view = mountResult({ state: 'denied' }, { rows: [] });

        expect(view.text()).toBe("You don't have access to this.");
    });

    it('shows nothing for a section that is loading or refused', () => {
        expect(mountResult(undefined, undefined, false).text()).toBe('');
        expect(mountResult({ state: 'denied' }, undefined, false).text()).toBe('');
    });
});
