// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useScrollAnchor } from './useScrollAnchor';

const rowHeight = 40;

/**
 * A scrolled list whose rows report where they are as a browser would lay them out: each row below the ones before
 * it, moved up by how far the list is scrolled.
 */
function mountList(names: string[], scrolledBy: number) {
    const rows = ref(names);
    const list = ref<HTMLElement | null>(null);
    const view = mount(
        defineComponent({
            setup() {
                useScrollAnchor(list, () => rows.value);

                return () =>
                    h('div', { style: 'overflow-y: auto', 'data-scroller': '' }, [
                        h(
                            'ul',
                            { ref: list },
                            rows.value.map((name) => h('li', { key: name, 'data-name': name }, name)),
                        ),
                    ]);
            },
        }),
        { attachTo: document.body },
    );
    const scroller = view.get('[data-scroller]').element as HTMLElement;
    scroller.scrollTop = scrolledBy;
    scroller.getBoundingClientRect = () => new DOMRect(0, 0, 300, 200);

    function layOut(): void {
        view.findAll('li').forEach((row, place) => {
            const top = place * rowHeight - scroller.scrollTop;
            (row.element as HTMLElement).getBoundingClientRect = () => new DOMRect(0, top, 300, rowHeight);
        });
    }

    layOut();

    return { rows, scroller, layOut };
}

describe('useScrollAnchor', () => {
    it('keeps the first row in view where it was when a row is added above it', async () => {
        const { rows, scroller, layOut } = mountList(['a', 'b', 'c', 'd'], 50);

        rows.value = ['new', 'a', 'b', 'c', 'd'];
        await nextTick();
        layOut();
        await nextTick();

        expect(scroller.scrollTop).toBe(50 + rowHeight);
    });

    it('leaves a list at its top at its top', async () => {
        const { rows, scroller, layOut } = mountList(['a', 'b'], 0);

        rows.value = ['new', 'a', 'b'];
        await nextTick();
        layOut();
        await nextTick();

        expect(scroller.scrollTop).toBe(0);
    });
});
