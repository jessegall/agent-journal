// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { TaskWaitsData } from '@generated/types/tasks';

vi.mock('@inertiajs/vue3', () => ({
    router: { reload: vi.fn() },
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@generated/routes/tasks', () => ({ task: { url: ({ task }: { task: string }) => `/tasks/${task}` } }));

const { default: TaskWaitsTab } = await import('./TaskWaitsTab.vue');
const { rememberFollowedWait } = await import('../../openedWaits');

const waits = {
    waitsFor: [
        { type: 'task', isSatisfied: false, number: '24', title: 'Prepare records', status: 'started' },
        { type: 'hidden', isSatisfied: false },
        {
            type: 'task',
            isSatisfied: true,
            number: '25',
            title: 'Check records',
            status: 'open',
            waivedAt: '2026-11-22T10:00:00+00:00',
            waivedByType: 'user',
            waivedById: 'owner',
            waiveReason: 'Done by hand.',
        },
    ],
    holdsUp: [{ type: 'task', isSatisfied: false, number: '40', title: 'Publish records', status: 'open' }],
} as TaskWaitsData;

describe('TaskWaitsTab', () => {
    it('lists the prerequisite under Waits for with its state and the waiting task under Holds up', () => {
        const view = mount(TaskWaitsTab, { props: { waits, actions: undefined, number: '31' } });
        const waitsFor = view.get('section[aria-label="Waits for"]');
        const holdsUp = view.get('section[aria-label="Holds up"]');

        expect(waitsFor.text()).toContain('Task 24 · Prepare records');
        expect(waitsFor.text()).toContain('Started');
        expect(waitsFor.text()).toContain('Outstanding');
        expect(waitsFor.get('li').attributes('aria-label')).toBe('Task 31 waits for task 24');
        expect(holdsUp.text()).toContain('Task 40 · Publish records');
    });

    it('shows a hidden prerequisite only as one it cannot see, and a waived wait with its reason', () => {
        const items = mount(TaskWaitsTab, { props: { waits, actions: undefined, number: '31' } }).findAll('section[aria-label="Waits for"] li');

        expect(items[1].text()).toContain('A prerequisite you cannot see');
        expect(items[1].find('a').exists()).toBe(false);
        expect(items[2].text()).toContain('Waived by user owner');
        expect(items[2].text()).toContain('Done by hand.');
    });

    it('gives the followed link the focus again when the reader comes back', async () => {
        rememberFollowedWait('31', '24');
        const view = mount(TaskWaitsTab, { attachTo: document.body, props: { waits, actions: undefined, number: '31' } });
        await flushPromises();

        expect(document.activeElement).toBe(view.get('a[data-task-number="24"]').element);
        view.unmount();
    });
});

describe('TaskWaitsTab changes', () => {
    it('offers no change to a caller the domain gives none, and Add, Remove and Waive to an editor', () => {
        const reader = mount(TaskWaitsTab, { props: { waits, actions: undefined, number: '31' } });
        expect(reader.findAll('button').map((button) => button.text())).not.toContain('Add prerequisite');

        const editor = mount(TaskWaitsTab, {
            props: { waits, actions: { mayEdit: true, mayWaive: true, choices: [] }, number: '31' },
        });
        const labels = editor.findAll('button').map((button) => button.text());
        expect(labels).toContain('Add prerequisite');
        expect(labels).toContain('Remove');
        expect(labels).toContain('Waive');
    });
});
