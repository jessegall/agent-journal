// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { PhaseReaderData, PlanCardData, PlanReaderData } from '@generated/types/plans';
import { progressText } from './planLooks';

vi.mock('@inertiajs/vue3', () => ({
    router: { on: vi.fn(), reload: vi.fn() },
    usePage: () => ({ url: '/plans/12' }),
    useForm: () => reactive({ errors: {}, processing: false, submit: vi.fn() }),
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));
vi.mock('@generated/routes/plans', () => ({
    start: ({ plan }: { plan: string }) => ({ url: `/plans/${plan}/start`, method: 'post' }),
    plan: { url: ({ plan }: { plan: string }) => `/plans/${plan}` },
}));

const { default: PlanCard } = await import('./components/plans/PlanCard.vue');
const { default: PlanReader } = await import('./pages/plans/partials/PlanReader.vue');
const { default: PhaseWindow } = await import('./pages/plans/PhaseWindow.vue');

const counts = { finishedTasks: 1, cancelledTasks: 1, totalTasks: 2 };
const card = {
    id: '40',
    number: '12',
    title: 'Build the release page',
    type: 'build',
    status: 'started',
    isFocused: false,
    isReadyToFinish: true,
    phase: '1',
    ...counts,
} as PlanCardData;
const phase = {
    planNumber: '12',
    planTitle: 'Build the release page',
    number: '1',
    title: 'Work',
    isCurrent: true,
    canRunChecks: true,
    tasks: { phase: '1', revision: 1, isRevisionChanged: false, after: '0', rows: [] },
    ...counts,
} as PhaseReaderData;

describe('counted progress', () => {
    it('words the counts once for every place', () => {
        expect(progressText(counts)).toBe('1 of 2 finished · 1 cancelled · 0 unfinished');
        expect(progressText({ finishedTasks: 0, cancelledTasks: 1, totalTasks: 1 })).toBe(
            '0 of 1 finished · 1 cancelled · 0 unfinished',
        );
        expect(progressText({ finishedTasks: 2, cancelledTasks: 0, totalTasks: 2 })).toBe('2 of 2 finished');
        expect(progressText({ finishedTasks: 0, cancelledTasks: 0, totalTasks: 0 })).toBe('No tasks');
    });

    it('shows the same words and a half bar on the card, the plan and the phase', () => {
        const places = [
            mount(PlanCard, { props: { card, href: '/plans?plan=12' } }),
            mount(PlanReader, {
                props: { reader: { card, isInsideResults: true, brief: '', outline: { phases: [], phasesAfter: '0' } } as PlanReaderData, selectionMissing: false },
            }),
            mount(PhaseWindow, { props: { data: phase } }),
        ];

        for (const place of places) {
            const bar = place.get('[role="progressbar"]');

            expect(place.text()).toContain('1 of 2 finished · 1 cancelled · 0 unfinished');
            expect(bar.attributes('aria-valuetext')).toBe('1 of 2 finished · 1 cancelled · 0 unfinished');
            expect(bar.get('span').attributes('style')).toContain('width: 50%');
        }
    });

    it('says No tasks for an empty phase with no bar, and marks the current phase in words', () => {
        const empty = mount(PhaseWindow, {
            props: { data: { ...phase, finishedTasks: 0, cancelledTasks: 0, totalTasks: 0 } },
        });

        expect(empty.text()).toContain('No tasks');
        expect(empty.find('[role="progressbar"]').exists()).toBe(false);
        expect(empty.text()).not.toContain('%');
        expect(empty.text()).toContain('Current phase');
    });

    it('names a started plan with nothing unfinished as ready to finish', () => {
        const reader = mount(PlanReader, {
            props: { reader: { card, isInsideResults: true, brief: '', outline: { phases: [], phasesAfter: '0' } } as PlanReaderData, selectionMissing: false },
        });

        expect(reader.text()).toContain('Ready to finish');
    });
});
