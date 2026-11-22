// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type SentOptions = {
    only: string[];
    preserveState: boolean;
    preserveScroll: boolean;
    onNetworkError: (error: Error) => boolean;
    onHttpException: () => boolean;
};

const sent: { url: string; options: SentOptions }[] = [];
const reloads: { only: string[] }[] = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: () => {
        const form = reactive({
            errors: {},
            processing: false,
            submit: (route: { url: string }, options: SentOptions) => {
                form.processing = true;
                sent.push({ url: route.url, options });
            },
        });

        return form;
    },
    router: { reload: (options: { only: string[] }) => reloads.push(options) },
}));
vi.mock('@/framework/hostProp', () => ({ useHostProp: () => 'plans' }));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));
vi.mock('@generated/routes/plans', () => ({
    start: ({ plan }: { plan: string }) => ({ url: `/plans/${plan}/start`, method: 'post' }),
}));

const { default: StartPlanForm } = await import('./StartPlanForm.vue');

function startForm() {
    return mount(StartPlanForm, {
        props: { start: { planId: '40', planNumber: '12' } },
    });
}

beforeEach(() => {
    sent.length = 0;
    reloads.length = 0;
});

describe('StartPlanForm', () => {
    it('sends one start for two clicks', async () => {
        const view = startForm();

        await view.get('form').trigger('submit');
        await view.get('form').trigger('submit');

        expect(sent).toHaveLength(1);
        expect(sent[0].url).toBe('/plans/12/start');
        expect(view.get('button[type="submit"]').attributes('disabled')).toBeDefined();
    });

    it('reloads only the prop of its host and keeps the page state', async () => {
        await startForm().get('form').trigger('submit');

        expect(sent[0].options.only).toEqual(['plans']);
        expect(sent[0].options.preserveState).toBe(true);
        expect(sent[0].options.preserveScroll).toBe(true);
    });

    it('shows Outcome unknown and Check plan when no answer comes, and sends no second start', async () => {
        const view = startForm();
        await view.get('form').trigger('submit');

        expect(sent[0].options.onNetworkError(new Error('offline'))).toBe(false);
        await view.vm.$nextTick();

        expect(view.text()).toContain('Outcome unknown');
        expect(view.find('button[type="submit"]').exists()).toBe(false);

        const check = view.findAll('button').find((button) => button.text() === 'Check plan');
        await check?.trigger('click');

        expect(reloads).toEqual([expect.objectContaining({ only: ['plans'] })]);
        expect(sent).toHaveLength(1);
    });
});
