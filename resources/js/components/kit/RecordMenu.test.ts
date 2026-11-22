// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import type { LayoutMenuData } from '@/generated/types/core';

const visit = vi.fn();

vi.mock('@inertiajs/vue3', () => ({
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
    router: { on: vi.fn(), visit: (...values: unknown[]) => visit(...values) },
}));

const { default: RecordMenu } = await import('./RecordMenu.vue');

function menuOn(record: string): LayoutMenuData {
    return {
        key: 'documents.document-actions',
        label: `Actions for doc ${record}`,
        groups: [
            {
                key: 'open',
                items: [
                    {
                        key: 'documents.document-history',
                        label: 'History',
                        href: `/documents/docs/${record}?tab=history`,
                        method: 'GET',
                    },
                ],
            },
            {
                key: 'edit',
                items: [
                    {
                        key: 'documents.document-edit',
                        label: 'Edit',
                        href: `/documents/docs/${record}/open`,
                        method: 'POST',
                    },
                ],
            },
        ],
    };
}

afterEach(() => {
    document.body.innerHTML = '';
    visit.mockReset();
});

describe('RecordMenu', () => {
    it('draws its groups apart and binds each item to its own record', async () => {
        const first = mount(RecordMenu, { attachTo: document.body, props: { menu: menuOn('1') } });
        const second = mount(RecordMenu, { attachTo: document.body, props: { menu: menuOn('2') } });

        expect(first.findAll('[role="group"]')).toHaveLength(2);
        expect(first.findAll('[role="separator"]')).toHaveLength(1);
        expect(first.get('a[role="menuitem"]').attributes('href')).toBe('/documents/docs/1?tab=history');
        expect(second.get('a[role="menuitem"]').attributes('href')).toBe('/documents/docs/2?tab=history');

        await second.get('button[role="menuitem"]').trigger('click');

        expect(visit.mock.calls[0][0]).toBe('/documents/docs/2/open');
        expect(visit.mock.calls[0][1]).toMatchObject({ method: 'post' });
    });

    it('opens from its host on the first item, and draws nothing with no item', async () => {
        const view = mount(RecordMenu, { attachTo: document.body, props: { menu: menuOn('1') } });

        view.vm.openFromContext();
        await nextTick();
        await nextTick();

        expect(document.activeElement?.textContent).toContain('History');

        const empty = mount(RecordMenu, {
            props: { menu: { key: 'documents.document-actions', label: 'Actions', groups: [] } },
        });

        expect(empty.find('button').exists()).toBe(false);
    });
});
