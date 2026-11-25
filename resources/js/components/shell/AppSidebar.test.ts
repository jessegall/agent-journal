// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h, reactive } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationItemData } from '@/types/generated';

const page = reactive({
    url: '/plans?state=open',
    props: {
        installation: { name: 'Journal', version: '6', faults: [] as string[] },
        navigation: { items: [], groups: [], current: [] } as {
            items: NavigationItemData[];
            groups: { key: string; label: string }[];
            current: string[];
        },
        navigationCounts: undefined as { counts: Record<string, number> } | undefined,
    },
});

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    Link: defineComponent({
        props: { href: { type: String, required: true } },
        setup(props, { slots, attrs }) {
            return () => h('a', { ...attrs, href: props.href }, slots.default?.());
        },
    }),
}));

const { default: AppSidebar } = await import('./AppSidebar.vue');

function item(
    fields: Partial<NavigationItemData> & Pick<NavigationItemData, 'key' | 'label'>,
): NavigationItemData {
    return { children: [], isAtBottom: false, isCounted: false, isInSidebar: true, ...fields };
}

describe('the sidebar', () => {
    it('draws the merged navigation as one list without group heads, the foot apart, the current item and its counts', () => {
        page.props.navigation = {
            items: [
                item({ key: 'web.home', label: 'Home', url: '/', icon: 'home' }),
                item({
                    key: 'plans.list',
                    label: 'Plans',
                    url: '/plans',
                    group: 'web.work',
                    children: [
                        item({ key: 'plans.open', label: 'Open', url: '/plans?state=open', isCounted: true }),
                        item({ key: 'plans.waiting', label: 'Waiting', url: '/plans?state=waiting', isCounted: true }),
                    ],
                }),
                item({ key: 'rules.list', label: 'Rules', url: '/rules', group: 'web.agents' }),
                item({ key: 'other.list', label: 'Rules', url: '/other', group: 'other.agents' }),
                item({ key: 'help.page', label: 'Help', url: '/help', isAtBottom: true }),
            ],
            groups: [
                { key: 'web.work', label: 'Work' },
                { key: 'web.agents', label: 'Agents' },
                { key: 'other.agents', label: 'Agents' },
            ],
            current: ['plans.list', 'plans.open'],
        };
        page.props.navigationCounts = { counts: { 'plans.open': 0 } };

        const view = mount(AppSidebar);
        const headings = view.find('aside').findAll('h2').map((heading) => heading.text());

        expect(headings).toEqual([]);
        expect(view.find('[aria-current="page"]').attributes('href')).toBe('/plans?state=open');
        expect(view.find('a[href="/plans?state=open"]').text()).toContain('0');
        expect(view.find('a[href="/plans?state=waiting"]').text()).toBe('Waiting');
        expect(view.find('nav[aria-label="More pages"]').text()).toContain('Help');
        expect(view.find('nav[aria-label="Pages"]').text()).not.toContain('Help');
    });

    it('leaves out a page kept for the command palette alone', () => {
        page.props.navigation = {
            items: [
                item({ key: 'web.home', label: 'Home', url: '/', icon: 'home' }),
                item({ key: 'rules.list', label: 'Rules', url: '/rules', isInSidebar: false }),
            ],
            groups: [],
            current: ['web.home'],
        };

        const view = mount(AppSidebar);

        expect(view.find('a[href="/"]').exists()).toBe(true);
        expect(view.find('a[href="/rules"]').exists()).toBe(false);
    });

    it('is 216 px wide, marks the current page with a bar as well as its colour, and folds to a 56 px rail', async () => {
        page.props.navigation = {
            items: [
                item({ key: 'plans.list', label: 'Plans', url: '/plans' }),
                item({ key: 'rules.list', label: 'Rules', url: '/rules' }),
            ],
            groups: [],
            current: ['plans.list'],
        };

        const view = mount(AppSidebar);

        expect(view.get('aside').classes()).toContain('w-54');
        expect(view.get('a[aria-current="page"]').classes()).toContain('bg-sel');
        expect(view.findAll('[data-current-marker]')).toHaveLength(1);
        expect(view.get('a[href="/rules"]').find('[data-current-marker]').exists()).toBe(false);

        const { useSidebar } = await import('@/composables/useSidebar');
        const { isMini } = useSidebar();
        isMini.value = true;
        await view.vm.$nextTick();

        expect(view.get('aside').classes()).toContain('w-14');
        isMini.value = false;
    });

    it('draws the icon of a page at 16 px, as the design does', () => {
        page.props.navigation = {
            items: [item({ key: 'plans.list', label: 'Plans', url: '/plans', icon: 'plan' })],
            groups: [],
            current: [],
        };

        const icon = mount(AppSidebar).get('a[href="/plans"] svg');

        expect(icon.attributes('style')).toContain('width: 16px');
    });
});
