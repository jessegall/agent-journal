// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LayoutPartData } from '@/generated/types/core';

const visit = vi.fn();

vi.mock('@inertiajs/vue3', () => ({
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
    router: { on: vi.fn(), visit: (...values: unknown[]) => visit(...values) },
    usePage: () => ({ url: '/plans' }),
}));

const { default: LayoutDialog } = await import('./LayoutDialog.vue');

function part(fields: Partial<LayoutPartData> & Pick<LayoutPartData, 'tag' | 'key' | 'style'>): LayoutPartData {
    return { size: null, text: null, detail: null, rows: [], children: [], tabs: [], ...fields };
}

function dialog(dialogFields: Record<string, unknown>, href?: string): LayoutPartData {
    return part({
        tag: 'dialog',
        key: 'creation',
        style: 'dialog',
        dialog: { title: 'New plan', confirmation: 'Plan created', ...dialogFields },
        children: [
            part({
                tag: 'action',
                key: 'open',
                style: 'bordered',
                text: 'New plan',
                action: { query: {}, submits: false, appends: false, ...(href === undefined ? {} : { href }) },
            }),
            part({ tag: 'form', key: 'form', style: 'stack' }),
        ],
    });
}

function view(layoutPart: LayoutPartData) {
    return mount(LayoutDialog, { attachTo: document.body, props: { part: layoutPart } });
}

afterEach(() => {
    document.body.innerHTML = '';
    visit.mockClear();
});

describe('a dialog of a declared layout', () => {
    it('draws its opener as a split button with a menu of its other ways when it names them', () => {
        const buttons = view(
            dialog({ guidedNoun: 'plan', ways: { plain: 'Write it yourself', guided: 'Plan it with an agent', isInHeader: true } }),
        ).findAll('button');

        expect(buttons[0].text()).toContain('New plan');
        expect(buttons[1].attributes('aria-label')).toBe('More ways to create a plan');
        expect(document.body.textContent).toContain('Write it yourself');
        expect(document.body.textContent).toContain('Plan it with an agent');
    });

    it('keeps a plain opener outside a header and names the guided way in its footer', async () => {
        const plan = view(
            dialog({ guidedNoun: 'plan', ways: { plain: 'Write it yourself', guided: 'Plan it with an agent', isInHeader: false } }),
        );

        expect(plan.findAll('button')).toHaveLength(1);

        await plan.get('button').trigger('click');

        expect(document.body.textContent).toContain('Plan it with an agent instead');
    });

    it('draws a plain button when it names no other ways', () => {
        const buttons = view(dialog({})).findAll('button');

        expect(buttons).toHaveLength(1);
        expect(buttons[0].text()).toContain('New plan');
    });

    it('leads to the page when its opener is a link and the main part is pressed', async () => {
        const split = view(
            dialog(
                { guidedNoun: 'sequence', ways: { plain: 'Write the steps yourself', guided: 'Build it with an agent', isInHeader: true } },
                '/sequences/new',
            ),
        );

        await split.findAll('button')[0].trigger('click');

        expect(visit).toHaveBeenCalledWith('/sequences/new');
    });
});
