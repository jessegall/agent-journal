// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { PlanCardData, PlanReaderData } from '@generated/types/plans';

vi.mock('@inertiajs/vue3', () => ({
    router: { reload: vi.fn() },
    useForm: () => reactive({ errors: {}, processing: false, submit: vi.fn() }),
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));
vi.mock('@generated/routes/plans', () => ({
    start: ({ plan }: { plan: string }) => ({ url: `/plans/${plan}/start`, method: 'post' }),
}));

const { default: PlanReader } = await import('./PlanReader.vue');

function reader(card: Partial<PlanCardData>, brief: string): PlanReaderData {
    return {
        card: {
            id: '40',
            number: '12',
            title: 'Build the release page',
            type: 'build',
            state: 'started',
            focused: false,
            finishedTasks: 3,
            totalTasks: 8,
            ...card,
        },
        insideResults: true,
        brief,
    } as PlanReaderData;
}

function shown(card: Partial<PlanCardData>, brief = 'One line.') {
    return mount(PlanReader, { props: { reader: reader(card, brief), selectionMissing: false } });
}

describe('PlanReader', () => {
    it('names the number, type and title before the state', () => {
        const text = shown({ phase: '1' }).text();

        expect(text.indexOf('Plan 12 · Build')).toBeGreaterThanOrEqual(0);
        expect(text.indexOf('Plan 12 · Build')).toBeLessThan(text.indexOf('Build the release page'));
        expect(text.indexOf('Build the release page')).toBeLessThan(text.indexOf('Started'));
    });

    it('says No phases yet for a plan without phases and gives no progress', () => {
        const text = shown({ finishedTasks: 0, totalTasks: 0 }).text();

        expect(text).toContain('No phases yet');
        expect(text).not.toContain('tasks done');
        expect(text).not.toContain('%');
    });

    it('shows the brief as text, its paragraphs in order', () => {
        const view = shown({ phase: '1' }, 'First <b>part</b>.\n\nSecond part,\nwith a line.\n\nThird part.');
        const paragraphs = view.findAll('section[aria-label="Brief"] p').map((paragraph) => paragraph.text());

        expect(paragraphs).toEqual(['First <b>part</b>.', 'Second part,\nwith a line.', 'Third part.']);
        expect(view.find('section[aria-label="Brief"] b').exists()).toBe(false);
    });

    it('says No brief yet for an empty brief', () => {
        expect(shown({ phase: '1' }, '').text()).toContain('No brief yet');
    });

    it('keeps the missing message without a title', () => {
        const view = mount(PlanReader, { props: { selectionMissing: true } });

        expect(view.text()).toContain('This plan cannot be shown');
        expect(view.find('h2').exists()).toBe(false);
    });
});
