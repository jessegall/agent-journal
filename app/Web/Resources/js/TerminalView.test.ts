// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import type { TerminalWindowData } from '@/types/generated';

const state = ref<'ready' | 'ended'>('ready');

vi.mock('@inertiajs/vue3', () => ({ router: { post: vi.fn() } }));
vi.mock('./useTerminalFrames', () => ({
    useTerminalFrames: () => ({
        state,
        refusal: ref(''),
        drawn: ref({ columns: 80, rows: [{ runs: [] }], noTerminal: false, tooLarge: false, unreadable: false, plain: false, cursor: undefined }),
        endedAt: ref('2026-11-22T10:00:00Z'),
        isSilent: () => false,
        ageSeconds: () => 2,
    }),
}));

const { default: TerminalView } = await import('./TerminalView.vue');

function data(actions?: TerminalWindowData['actions']): TerminalWindowData {
    return { agentId: 'a', ...(actions === undefined ? {} : { actions }) } as TerminalWindowData;
}

describe('the terminal view', () => {
    it('shows its status and size, and only the controls the server offered', () => {
        const none = mount(TerminalView, { props: { data: data() } });

        expect(none.text()).toContain('80 columns by 1 rows');
        expect(none.findAll('button').map((button) => button.text())).toEqual(['Leave terminal']);

        const some = mount(TerminalView, { props: { data: data({ restart: '/restart' }) } });

        expect(some.findAll('button').map((button) => button.text())).toEqual(['Restart', 'Leave terminal']);
    });

    it('puts the focus on Restart after the session ended, else on the link to Home', async () => {
        state.value = 'ready';
        const restart = mount(TerminalView, { props: { data: data({ restart: '/restart' }) }, attachTo: document.body });
        state.value = 'ended';
        await restart.vm.$nextTick();
        await restart.vm.$nextTick();

        expect(document.activeElement?.textContent).toBe('Restart');
        restart.unmount();

        state.value = 'ready';
        const home = mount(TerminalView, { props: { data: data() }, attachTo: document.body });
        state.value = 'ended';
        await home.vm.$nextTick();
        await home.vm.$nextTick();

        expect(document.activeElement?.getAttribute('href')).toBe('/');
        home.unmount();
    });

    it('hands the keyboard back to the window switcher on Option and the backtick', async () => {
        state.value = 'ready';
        document.body.insertAdjacentHTML('beforeend', '<div data-window-switcher><button id="switcher">Chat</button></div>');
        const view = mount(TerminalView, { props: { data: data() }, attachTo: document.body });

        await view.get('div.flex-col').trigger('keydown', { key: '`', altKey: true });

        expect(document.activeElement?.id).toBe('switcher');
        view.unmount();
    });
});
