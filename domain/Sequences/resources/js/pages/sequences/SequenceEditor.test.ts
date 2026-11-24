// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { SequenceEditorPartData } from '@generated/types/sequences';
import SequenceEditor from './SequenceEditor.vue';

function definition(overrides: Partial<SequenceEditorPartData> = {}): SequenceEditorPartData {
    return {
        name: 'Release',
        steps: ['a', 'b', 'c'].map((id) => ({ id, title: `Step ${id}`, runsWhen: 'now', doneWhen: 'later' })),
        saveAddress: '/sequences/1',
        method: 'PATCH',
        cancelAddress: '/sequences/1',
        version: '4',
        ...overrides,
    };
}

function mountEditor(props: SequenceEditorPartData) {
    return mount(SequenceEditor, {
        props,
        attachTo: document.body,
        global: { stubs: { Link: { props: ['href'], template: '<a :href="href"><slot /></a>' } } },
    });
}

describe('the sequence editor', () => {
    it('adds a step and focuses its title', async () => {
        const view = mountEditor(definition({ steps: [] }));

        expect(view.text()).toContain('no steps yet');
        await view.findAll('button').find((button) => button.text() === 'Add a step')?.trigger('click');
        await view.vm.$nextTick();

        expect(view.findAll('[data-step]')).toHaveLength(1);
        expect(document.activeElement).toBe(view.get('[data-step] input').element);
        view.unmount();
    });

    it('moves a step with its arrows, keeps the focus on the arrow still available and disables the ends', async () => {
        const view = mountEditor(definition());
        const second = () => view.findAll('[data-step]')[1];

        await second().get('[data-move="up"]').trigger('click');
        await view.vm.$nextTick();

        expect(view.findAll('[data-step]')[0].get('input').element.value).toBe('Step b');
        expect(view.findAll('[data-step]')[0].get('[data-move="up"]').attributes('disabled')).toBeDefined();
        expect(document.activeElement).toBe(view.findAll('[data-step]')[0].get('[data-move="down"]').element);
        expect(view.findAll('[data-step]')[2].get('[data-move="down"]').attributes('disabled')).toBeDefined();
        view.unmount();
    });

    it('removes a step and focuses the row now in its place, then Add a step when none is left', async () => {
        const view = mountEditor(definition({ steps: [{ id: 'a', title: 'A', runsWhen: '', doneWhen: '' }] }));

        await view.get('[aria-label="Remove step 1"]').trigger('click');
        await view.vm.$nextTick();

        expect(view.findAll('[data-step]')).toHaveLength(0);
        expect(document.activeElement?.textContent).toBe('Add a step');
        view.unmount();
    });

    it('shows a server error beside its step and field, and a failed save keeps the order and every text', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation((_url, options) => {
            options?.onError?.({ 'steps.b.title': 'Give the step a title' });
            options?.onFinish?.({} as never);
        });
        const view = mountEditor(definition());

        await view.findAll('[data-step]')[1].get('[aria-label="Move step 2 up"]').trigger('click');
        await view.get('form').trigger('submit');

        expect(visit.mock.calls[0][1]?.data).toMatchObject({ version: '4' });
        expect(view.findAll('[data-step]')[0].text()).toContain('Give the step a title');
        expect(view.findAll('[data-step]')[0].get('input').element.value).toBe('Step b');
        visit.mockRestore();
        view.unmount();
    });

    it('names the agent that drafted it, and stacks its fields in one column by default', () => {
        const view = mountEditor(definition({ draftedBy: 'Agent 2' }));

        expect(view.get('[role="status"]').text()).toContain('Agent 2');
        expect(view.get('[data-step] .grid').classes()).toContain('grid-cols-1');
        view.unmount();
    });
});
