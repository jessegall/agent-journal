import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type Projection = (props: { page: unknown }) => unknown;

const submitted: Array<{ projection: Projection; route: unknown }> = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: (fields: Record<string, unknown>) => {
        const form = reactive({
            ...fields,
            clearErrors: () => undefined,
            optimistic: (projection: Projection) => ({
                submit: (route: unknown) =>
                    submitted.push({ projection, route }),
            }),
        });

        return form;
    },
}));
vi.mock('@generated/routes/accounts', () => ({
    rename: (account: unknown) => ({ account }),
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));

const { useAccountNaming } = await import('./accountNaming');

const page = {
    state: 'ready',
    data: {
        rows: [
            { id: 'account-1', label: 'Work' },
            { id: 'account-2', label: 'Home' },
        ],
    },
};

describe('useAccountNaming', () => {
    it('shows the new name in the account list at once through form optimism', () => {
        const { naming, save } = useAccountNaming(() => ({
            id: 'account-1',
            label: 'Work',
        }));
        naming.label = '  Office  ';

        save(() => undefined);

        expect(submitted[0].projection({ page })).toEqual({
            page: {
                state: 'ready',
                data: {
                    rows: [
                        { id: 'account-1', label: 'Office' },
                        { id: 'account-2', label: 'Home' },
                    ],
                },
            },
        });
    });

    it('changes nothing on a page that lists no accounts', () => {
        const { naming, save } = useAccountNaming(() => ({
            id: 'account-1',
            label: 'Work',
        }));
        naming.label = 'Office';

        save(() => undefined);

        expect(
            submitted
                .at(-1)
                ?.projection({
                    page: { state: 'ready', data: { step: 'name' } },
                }),
        ).toEqual({});
        expect(
            submitted
                .at(-1)
                ?.projection({ page: { state: 'failed', message: 'No.' } }),
        ).toEqual({});
    });
});
