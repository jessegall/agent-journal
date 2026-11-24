// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

const visit = vi.fn();

vi.mock('@inertiajs/vue3', () => ({ router: { visit } }));
vi.mock('@generated/routes/accounts', () => ({ accounts: () => ({ url: '/accounts' }) }));
vi.mock('./partials/AddAccountWizard.vue', () => ({
    default: defineComponent({
        props: { request: { type: Object, default: null } },
        emits: ['close'],
        setup(props, { emit }) {
            return () =>
                h('div', { 'data-wizard': props.request === null ? 'closed' : props.request.kind }, [
                    h('button', { onClick: () => emit('close', 'closed') }, 'Close'),
                ]);
        },
    }),
}));

const { default: AddAccountPart } = await import('./AddAccountPart.vue');

function part() {
    return mount(AddAccountPart, {
        props: { rows: [], methods: [], attempts: [], selections: [], pendingCleanups: [] } as never,
    });
}

describe('AddAccountPart', () => {
    it('opens the add-account wizard at once, for a new account', () => {
        expect(part().find('[data-wizard]').attributes('data-wizard')).toBe('new');
    });

    it('goes back to the plain account list when the wizard closes', async () => {
        const view = part();

        await view.find('button').trigger('click');

        expect(view.find('[data-wizard]').attributes('data-wizard')).toBe('closed');
        expect(visit).toHaveBeenCalledWith('/accounts');
    });
});
