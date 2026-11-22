// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { describe, expect, it, vi } from 'vitest';

const page = reactive({
    url: '/tasks',
    props: { environments: [{ key: 'main', label: 'Main' }, { key: 'trial', label: 'Trial' }] as { key: string; label: string }[] },
});

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}));

const { default: EnvironmentMenu } = await import('./EnvironmentMenu.vue');

describe('the environment menu', () => {
    it('shows the environment in use, and keeps the choice when the page changes', async () => {
        const view = mount(EnvironmentMenu);

        expect(view.get('button').text()).toContain('Main');

        await view.findAll('[role="menuitemradio"]')[1].trigger('click');
        page.url = '/plans';
        await view.vm.$nextTick();

        expect(view.get('button').text()).toContain('Trial');
        expect(view.findAll('[role="menuitemradio"]')[1].attributes('aria-checked')).toBe('true');
    });

    it('is not drawn when the page supplies none', () => {
        page.props.environments = [];

        expect(mount(EnvironmentMenu).find('button').exists()).toBe(false);
    });
});
