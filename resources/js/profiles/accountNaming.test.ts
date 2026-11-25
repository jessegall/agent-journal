import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import { declaredLooks } from '@/kit/testing/driverLooks';

type Projection = (props: { page: unknown }) => unknown;

const submitted: Array<{
    projection: Projection;
    route: unknown;
    body: unknown;
}> = [];

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({ props: { drivers: declaredLooks } }),
    useForm: (fields: Record<string, unknown>) => {
        let sent: () => unknown = () => fields;
        const form = reactive({
            ...fields,
            errors: {} as Record<string, string>,
            clearErrors: () => undefined,
            transform: (shape: () => unknown) => {
                sent = shape;

                return form;
            },
            optimistic: (projection: Projection) => ({
                submit: (route: unknown) =>
                    submitted.push({ projection, route, body: sent() }),
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
            nameRevision: 3,
        }));
        naming.label = '  Office  ';

        save(() => undefined);

        expect(submitted[0].body).toEqual({ label: 'Office', seenRevision: 3 });
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
            nameRevision: 3,
        }));
        naming.label = 'Office';

        save(() => undefined);

        expect(
            submitted.at(-1)?.projection({
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
