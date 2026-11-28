// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { LayoutPartData } from '@/generated/types/core';
import LayoutEmptyPage from './LayoutEmptyPage.vue';

function part(fields: Partial<LayoutPartData> & Pick<LayoutPartData, 'tag' | 'key' | 'style'>): LayoutPartData {
    return { size: null, text: null, detail: null, rows: [], children: [], tabs: [], ...fields };
}

function emptyPage(children: LayoutPartData[] = []): LayoutPartData {
    return part({
        tag: 'box',
        key: 'empty-page',
        style: 'page-empty',
        children: [
            part({ tag: 'text', key: 'icon', style: 'icon', text: 'account' }),
            part({
                tag: 'notice',
                key: 'empty',
                style: 'first',
                text: 'No accounts yet',
                detail: 'Agents run on an account. Add a Claude Code or Codex account so they can start work.',
            }),
            ...children,
        ],
    });
}

describe('LayoutEmptyPage', () => {
    it('shows the title and the sentence in one region named by the title', () => {
        const view = mount(LayoutEmptyPage, { props: { part: emptyPage() } });
        const region = view.get('[data-layout-box="page-empty"]');

        expect(region.attributes('role')).toBe('region');
        expect(region.attributes('aria-label')).toBe('No accounts yet');
        expect(region.text()).toContain('No accounts yet');
        expect(region.text()).toContain('Agents run on an account.');
    });

    it('centres its text in at most 360 pixels under a 40 pixel tile with the subject icon', () => {
        const view = mount(LayoutEmptyPage, { props: { part: emptyPage() } });

        expect(view.get('[data-layout-box="page-empty"]').classes()).toEqual(
            expect.arrayContaining(['flex', 'flex-1', 'items-center', 'justify-center']),
        );
        expect(view.get('.max-w-\\[360px\\]').classes()).toContain('text-center');
        expect(view.get('.size-10').find('svg').exists()).toBe(true);
    });

    it('draws no action when the page offers none', () => {
        const view = mount(LayoutEmptyPage, { props: { part: emptyPage() } });

        expect(view.find('button').exists()).toBe(false);
        expect(view.find('a').exists()).toBe(false);
    });
});
