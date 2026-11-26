// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { describe, expect, it, vi } from 'vitest';

const page = reactive({
    url: '/tasks',
    props: {
        projects: [
            { id: '01jd8x0g9m3qz6v4k2t7r5w1ca', key: 'journal', label: 'Journal' },
            { id: '01jd8x0g9m3qz6v4k2t7r5w1cb', key: 'site-a', label: 'Site' },
            { id: '01jd8x0g9m3qz6v4k2t7r5w1cc', key: 'site-b', label: 'Site' },
        ] as { id: string; key: string; label: string }[] | undefined,
    },
});
const visits: string[] = [];

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: { on: () => undefined, cancelAll: () => undefined, visit: (address: string) => visits.push(address) },
}));

const { default: ProjectMenu } = await import('./ProjectMenu.vue');

describe('the project menu', () => {
    it('offers All projects first, then each project, with the key beside a shared label', () => {
        const view = mount(ProjectMenu);

        expect(view.get('button').text()).toContain('All projects');
        expect(view.findAll('[role="menuitemradio"]').map((item) => item.text())).toEqual([
            'All projects',
            'Journal',
            'Site · site-a',
            'Site · site-b',
        ]);
    });

    it('opens the same page under the project chosen', async () => {
        const view = mount(ProjectMenu);

        await view.findAll('[role="menuitemradio"]')[2].trigger('click');

        expect(visits).toEqual(['/?project=01jd8x0g9m3qz6v4k2t7r5w1cb']);
        expect(view.get('button').text()).toContain('Site · site-a');
    });

    it('is not drawn for a guest, to whom no projects are offered', () => {
        page.props.projects = undefined;

        expect(mount(ProjectMenu).find('button').exists()).toBe(false);
    });
});
