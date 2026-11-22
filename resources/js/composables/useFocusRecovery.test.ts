// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref, useTemplateRef } from 'vue';
import { useFocusRecovery } from './useFocusRecovery';

function pane(rows: string[]) {
    return mount(
        defineComponent({
            setup(_, { expose }) {
                const list = useTemplateRef<HTMLElement>('list');
                const shown = ref(rows);
                const recovery = useFocusRecovery(list, 'button');
                expose({ ...recovery, shown });

                return () =>
                    h('div', [
                        h('p', { role: 'status' }, recovery.announcement.value),
                        h('div', { ref: 'list', tabindex: -1 }, shown.value.map((row) => h('button', row))),
                    ]);
            },
        }),
        { attachTo: document.body },
    );
}

describe('useFocusRecovery', () => {
    it("focuses the row now at the removed one's place and announces it once", async () => {
        const view = pane(['Task 31', 'Task 32', 'Task 33']);
        const vm = view.vm as unknown as { shown: string[]; afterRemoval: (position: number, message: string) => Promise<void> };

        vm.shown = ['Task 31', 'Task 33'];
        await vm.afterRemoval(1, 'Task 32 no longer matches this filter');

        expect(document.activeElement?.textContent).toBe('Task 33');
        expect(view.findAll('[role="status"]').map((status) => status.text())).toEqual([
            'Task 32 no longer matches this filter',
        ]);
        view.unmount();
    });

    it('focuses the pane when no row is left', async () => {
        const view = pane(['Task 31']);
        const vm = view.vm as unknown as { shown: string[]; afterRemoval: (position: number, message: string) => Promise<void> };

        vm.shown = [];
        await vm.afterRemoval(0, 'Task 31 no longer matches this filter');

        expect(document.activeElement?.getAttribute('tabindex')).toBe('-1');
        view.unmount();
    });
});
