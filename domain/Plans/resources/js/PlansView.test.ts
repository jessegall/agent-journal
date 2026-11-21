// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { PlanCardData, PlanFiltersData, PlanListData } from '@generated/types/plans';

type ReadOptions = {
    onSuccess: () => void;
    onNetworkError: () => boolean;
    onHttpException: () => boolean;
};

const reads: { url: string; options: ReadOptions }[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: {
        get: (url: string, _data: unknown, options: ReadOptions) => reads.push({ url, options }),
        reload: vi.fn(),
    },
    useForm: () => reactive({ errors: {}, processing: false, submit: vi.fn() }),
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));
vi.mock('@generated/routes/plans', () => ({
    start: ({ plan }: { plan: string }) => ({ url: `/plans/${plan}/start`, method: 'post' }),
}));

const { default: PlansView } = await import('./PlansView.vue');

function card(number: string): PlanCardData {
    return {
        id: `id-${number}`,
        number,
        title: `Plan number ${number}`,
        type: 'build',
        state: 'planned',
        focused: false,
        finishedTasks: 0,
        totalTasks: 1,
    } as PlanCardData;
}

function slice(filters: Partial<PlanFiltersData>, rows: PlanCardData[], page = 1): PlanListData {
    return {
        rows,
        filters: { q: '', page, ...filters },
        pagination: { page, lastPage: 3, total: rows.length },
        selectionMissing: false,
        selected:
            filters.plan === undefined
                ? undefined
                : { card: rows[0], insideResults: true, brief: '', outline: { phases: [], phasesAfter: '0' } },
    } as PlanListData;
}

function urlForFilters(filters: PlanFiltersData): string {
    const query = new URLSearchParams(
        Object.entries({ q: filters.q, page: filters.page > 1 ? String(filters.page) : '', plan: filters.plan ?? '' })
            .filter(([, part]) => part !== ''),
    );

    return `/plans?${query.toString()}`;
}

function view(plans: PlanListData) {
    return mount(PlansView, { attachTo: document.body, props: { plans, urlForFilters } });
}

beforeEach(() => {
    reads.length = 0;
});

afterEach(() => {
    document.body.innerHTML = '';
});

describe('PlansView', () => {
    it('keeps an empty search in the field, names it and clears it with Clear', async () => {
        const empty = view(slice({ q: 'missing' }, []));

        expect((empty.get('input[type="search"]').element as HTMLInputElement).value).toBe('missing');
        expect(empty.text()).toContain('No plans match "missing"');

        await empty.findAll('button').find((button) => button.text() === 'Clear')?.trigger('click');

        expect(reads.map((read) => read.url)).toEqual(['/plans?']);
    });

    it('says there are no plans yet when nothing is filtered', () => {
        expect(view(slice({}, [])).text()).toContain('No plans yet');
    });

    it('keeps the earlier rows after a failed read, labels them and retries the same read', async () => {
        const list = view(slice({}, [card('12')]));
        await list.get('input[type="search"]').setValue('release');
        await list.get('form[role="search"]').trigger('submit');

        expect(reads[0].url).toBe('/plans?q=release');
        expect(reads[0].options.onNetworkError()).toBe(false);
        await flushPromises();

        expect(list.text()).toContain('Showing earlier results');
        expect(list.text()).toContain('Plan number 12');
        expect((list.get('input[type="search"]').element as HTMLInputElement).value).toBe('release');

        await list.findAll('button').find((button) => button.text() === 'Retry')?.trigger('click');

        expect(reads.map((read) => read.url)).toEqual(['/plans?q=release', '/plans?q=release']);
    });

    it('goes back from plan 30 opened on page 2 to page 2 with the focus on its row', async () => {
        const rows = [card('30'), card('31')];
        const open = view(slice({ plan: '30' }, rows, 2));

        expect(open.get('a[href="/plans?page=2"]').text()).toContain('Back to plans');
        open.unmount();

        const back = view(slice({}, rows, 2));
        await flushPromises();

        expect(back.text()).toContain('Page 2 of 3');
        expect(document.activeElement).toBe(back.get('[data-plan-number="30"] a').element);
    });
});
