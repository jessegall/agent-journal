// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { PlanCardData } from '@generated/types/plans';

vi.mock('@inertiajs/vue3', () => ({
    useForm: () => reactive({ errors: {}, processing: false, submit: vi.fn() }),
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));
vi.mock('@generated/routes/plans', () => ({
    start: ({ plan }: { plan: string }) => ({ url: `/plans/${plan}/start`, method: 'post' }),
}));

const { default: PlanCard } = await import('./PlanCard.vue');

const longTitle =
    'Build the release page with its changelog, its download links for every platform and a notice for each breaking change';

function card(changes: Partial<PlanCardData> = {}): PlanCardData {
    return {
        id: '40',
        number: '12',
        title: longTitle,
        type: 'build',
        state: 'planned',
        isFocused: false,
        finishedTasks: 3,
        totalTasks: 8,
        ...changes,
    } as PlanCardData;
}

function row(changes: Partial<PlanCardData> = {}, selected = false) {
    return mount(PlanCard, { props: { card: card(changes), href: '/plans?plan=12', selected } });
}

describe('PlanCard', () => {
    it('heads the row with the plan number and type and names the link by number, type and full title', () => {
        const view = row();
        const link = view.get('a[href="/plans?plan=12"]');

        expect(link.text()).toContain('Plan 12 · Build');
        expect(link.attributes('aria-label')).toContain('Build plan 12');
        expect(link.attributes('aria-label')).toContain(longTitle);
    });

    it('puts the actions button beside the link, never inside it', () => {
        const view = row();
        const link = view.get('a[href="/plans?plan=12"]');
        const button = view.get('button[aria-haspopup="menu"]');

        expect(button.attributes('aria-label')).toBe('Actions for build plan 12');
        expect(link.element.contains(button.element)).toBe(false);
        expect(link.element.parentElement).toBe(view.element);
        expect(view.element.contains(button.element)).toBe(true);
    });

    it('shows the state as an outlined badge in words', () => {
        const badge = row({ status: 'started' }).get('.rounded-badge');

        expect(badge.text()).toBe('Started');
        expect(badge.find('svg').exists()).toBe(true);
    });

    it('names the focused plan and gives the selected plan its own surface and current link', () => {
        const focused = row({ isFocused: true });
        const selected = row({}, true);

        expect(focused.text()).toContain('Focused plan');
        expect(focused.get('a').attributes('aria-current')).toBeUndefined();
        expect(focused.classes()).not.toContain('bg-sel');

        expect(selected.text()).not.toContain('Focused plan');
        expect(selected.get('a').attributes('aria-current')).toBe('true');
        expect(selected.get('a').attributes('aria-label')).toContain('Selected plan');
        expect(focused.get('a').attributes('aria-label')).toContain('Focused plan');
        expect(selected.classes()).toContain('bg-sel');
    });

    it('lets a long title wrap instead of cutting it off', () => {
        const title = row().findAll('span').find((part) => part.text() === longTitle);

        expect(title?.classes()).not.toContain('truncate');
        expect(title?.classes()).toContain('[overflow-wrap:anywhere]');
    });

    it('offers Start in the menu only when the server offers it, and always Open plan', () => {
        const startable = row({ start: { planId: '40', planNumber: '12' } });
        const waiting = row();

        expect(startable.findAll('[role="menuitem"]').map((item) => item.text())).toEqual(['Start plan', 'Open plan']);
        expect(waiting.findAll('[role="menuitem"]').map((item) => item.text())).toEqual(['Open plan']);
    });
});
