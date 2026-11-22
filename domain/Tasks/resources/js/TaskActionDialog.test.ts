// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Outcome = {
    onAccepted: () => void;
    onRefused: (reason: string | null) => void;
    onUncertain: () => void;
};

const posts: { url: string; data: Record<string, string>; key: string; outcome: Outcome }[] = [];
const reloads: unknown[] = [];

vi.mock('@kit/keyedPost', () => ({
    keyedPost: (url: string, data: Record<string, string>, key: string, outcome: Outcome) =>
        posts.push({ url, data, key, outcome }),
}));
vi.mock('@inertiajs/vue3', () => ({ router: { reload: (options: unknown) => reloads.push(options) } }));
vi.mock('@generated/routes/tasks', () => ({
    block: { url: ({ task }: { task: string }) => `/tasks/${task}/block` },
    cancel: { url: ({ task }: { task: string }) => `/tasks/${task}/cancel` },
}));
vi.mock('@kit/Dialog', () => ({
    default: { template: '<div role="dialog"><slot /><slot name="footer" /></div>', props: ['open', 'title'] },
}));

const { default: TaskActionDialog } = await import('./TaskActionDialog.vue');

function dialog(change: 'block' | 'cancel') {
    return mount(TaskActionDialog, {
        attachTo: document.body,
        props: { change, number: '31', revision: 3, runNumber: 5 },
    });
}

function button(view: ReturnType<typeof dialog>, label: string) {
    return view.findAll('button').find((found) => found.text() === label);
}

beforeEach(() => {
    posts.length = 0;
    reloads.length = 0;
});

describe('TaskActionDialog', () => {
    it('keeps the dialog open with the focus on the reason when the reason is blank', async () => {
        const view = dialog('block');
        await view.get('textarea').setValue('   ');
        await button(view, 'Block task')?.trigger('click');
        await flushPromises();

        expect(posts).toHaveLength(0);
        expect(view.text()).toContain('Give the reason.');
        expect(document.activeElement).toBe(view.get('textarea').element);
        view.unmount();
    });

    it('sends the revision and run read on screen and closes with the domain words on a stale cancel', async () => {
        const view = dialog('cancel');
        await view.get('textarea').setValue('Dropped.');
        await button(view, 'Cancel task')?.trigger('click');

        expect(posts[0].data).toEqual({ reason: 'Dropped.', revision: '3', run: '5' });
        posts[0].outcome.onRefused('Task 31 changed since you read it: it is now blocked, run 5.');

        expect(view.emitted('refused')?.[0]).toEqual(['Task 31 changed since you read it: it is now blocked, run 5.']);
        expect(reloads).toHaveLength(1);
        expect(view.text()).not.toContain('Cancelled');
        view.unmount();
    });

    it('shows Outcome unknown on a lost answer and sends nothing more until asked', async () => {
        const view = dialog('cancel');
        await view.get('textarea').setValue('Dropped.');
        await button(view, 'Cancel task')?.trigger('click');
        posts[0].outcome.onUncertain();
        await flushPromises();

        expect(view.text()).toContain('Outcome unknown');
        expect(posts).toHaveLength(1);

        await button(view, 'Send again')?.trigger('click');
        expect(posts).toHaveLength(2);
        expect(posts[1].key).toBe(posts[0].key);
        view.unmount();
    });
});
