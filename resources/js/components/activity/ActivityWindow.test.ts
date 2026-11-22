// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ActivityWindow from './ActivityWindow.vue';
import type { ActivityEvent } from './ActivityWindow.vue';

const events: ActivityEvent[] = [
    { id: '1', time: '10:00', level: 3, icon: 'chat', who: 'Agent 1', text: 'answered' },
    { id: '2', time: '10:01', level: 1, icon: 'file', who: 'Agent 1', text: 'read a file' },
];

describe('the activity window', () => {
    it('waits for activity when connected and empty', () => {
        const view = mount(ActivityWindow, { props: { events: [], connection: 'connected' } });

        expect(view.text()).toContain('Waiting for activity');
    });

    it('filters by level and offers Show all when a level matches nothing', async () => {
        const view = mount(ActivityWindow, { props: { events: [events[0]], connection: 'connected' } });

        await view.findAll('[role="tab"]').find((tab) => tab.text() === 'Detail')?.trigger('click');
        expect(view.findAll('li')).toHaveLength(0);

        await view.findAll('button').find((button) => button.text() === 'Show all')?.trigger('click');
        expect(view.findAll('li')).toHaveLength(1);
    });

    it('keeps its events after the connection drops and offers Reconnect', async () => {
        const view = mount(ActivityWindow, { props: { events, connection: 'disconnected' } });

        expect(view.findAll('li')).toHaveLength(2);

        await view.findAll('button').find((button) => button.text() === 'Reconnect')?.trigger('click');
        expect(view.emitted('reconnect')).toHaveLength(1);
    });
});
