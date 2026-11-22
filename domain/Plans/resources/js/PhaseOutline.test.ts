// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { PhaseTaskPageData, PlanOutlineData } from '@generated/types/plans';

const reloads: { data: Record<string, string> }[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: { reload: (options: { data: Record<string, string> }) => reloads.push(options) },
    usePage: () => ({ url: '/plans/12' }),
    Link: { template: '<a><slot /></a>' },
}));

const { default: PhaseOutline } = await import('./PhaseOutline.vue');

function heading(number: string, revision = 1) {
    return {
        number,
        title: `Phase title ${number}`,
        revision,
        finishedTasks: 0,
        cancelledTasks: 0,
        totalTasks: 60,
        isCurrent: number === '1',
    };
}

function tasks(phase: string, from: number, count: number): PhaseTaskPageData['rows'] {
    return Array.from({ length: count }, (_, index) => ({
        number: `${phase}${from + index}`,
        title: `Task ${from + index} of phase ${phase}`,
        state: 'open',
        stateLabel: 'Open',
    })) as PhaseTaskPageData['rows'];
}

function outline(phaseTasks?: PhaseTaskPageData): PlanOutlineData {
    return { phases: [heading('1'), heading('2')], phasesAfter: '0', phaseTasks } as PlanOutlineData;
}

describe('PhaseOutline', () => {
    it('pages two opened phases on their own cursors and appends each page once', async () => {
        const view = mount(PhaseOutline, { props: { outline: outline() }, attachTo: document.body });
        const toggles = view.findAll('button[aria-expanded]');

        await toggles[0].trigger('click');
        await toggles[1].trigger('click');

        expect(reloads.slice(-2).map((reload) => reload.data)).toEqual([
            { tasks_after: '0', revision: '1', phase: '1' },
            { tasks_after: '0', revision: '1', phase: '2' },
        ]);

        const page = (phase: string, after: string, rows: PhaseTaskPageData['rows'], nextAfter?: string) =>
            ({ phase, revision: 1, isRevisionChanged: false, after, rows, nextAfter }) as PhaseTaskPageData;

        await view.setProps({ outline: outline(page('1', '0', tasks('1', 1, 50), '50')) });
        await view.setProps({ outline: outline(page('2', '0', tasks('2', 1, 10))) });
        await view.setProps({ outline: outline(page('1', '0', tasks('1', 1, 50), '50')) });

        expect(view.findAll('ol[aria-label="Tasks of phase 1"] li')).toHaveLength(50);
        expect(view.findAll('ol[aria-label="Tasks of phase 2"] li')).toHaveLength(10);

        await view.findAll('button').find((button) => button.text() === 'Load more')?.trigger('click');
        expect(reloads.at(-1)?.data).toEqual({ tasks_after: '50', revision: '1', phase: '1' });

        await view.setProps({ outline: outline(page('1', '50', tasks('1', 51, 10))) });
        await flushPromises();

        const rows = view.findAll('ol[aria-label="Tasks of phase 1"] li');
        expect(rows).toHaveLength(60);
        expect(document.activeElement).toBe(rows[50].get('a').element);
        expect(rows[50].get('a').attributes('href')).toBe('/plans/12?inspect=tasks.task&task=151');
        expect(rows[50].text()).toContain('Task 151 · Task 51 of phase 1');
        expect(view.findAll('ol[aria-label="Tasks of phase 2"] li')).toHaveLength(10);
    });

    it('starts a phase over when its revision moved between pages', async () => {
        const view = mount(PhaseOutline, { props: { outline: outline() } });
        await view.findAll('button[aria-expanded]')[0].trigger('click');

        await view.setProps({
            outline: outline({
                phase: '1',
                revision: 1,
                isRevisionChanged: false,
                after: '0',
                rows: tasks('1', 1, 50),
                nextAfter: '50',
            } as PhaseTaskPageData),
        });
        await view.findAll('button').find((button) => button.text() === 'Load more')?.trigger('click');
        await view.setProps({
            outline: outline({
                phase: '1',
                revision: 2,
                isRevisionChanged: true,
                after: '0',
                rows: tasks('1', 1, 3),
            } as PhaseTaskPageData),
        });

        expect(view.findAll('ol[aria-label="Tasks of phase 1"] li')).toHaveLength(3);
    });

    it('marks the current phase in words', () => {
        expect(mount(PhaseOutline, { props: { outline: outline() } }).text()).toContain('Current phase');
    });
});
