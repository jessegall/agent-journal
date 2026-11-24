// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ActivityWindow from './ActivityWindow.vue';
import type { ActivityEventData } from '@/types/generated';

const events: ActivityEventData[] = [
    { id: '1', occurredAt: '2026-11-23T10:00:00+00:00', level: 3, icon: 'chat', who: 'Agent 1', text: 'answered', found: [] },
    { id: '2', occurredAt: '2026-11-23T10:01:00+00:00', level: 1, icon: 'file', who: 'Agent 1', text: 'read a file', found: [] },
];

describe('the activity window', () => {
    it('waits for activity when connected and empty', () => {
        const view = mount(ActivityWindow, { props: { events: [], connection: 'connected' } });

        expect(view.text()).toContain('Waiting for activity');
    });

    it('shows a level with every level above it, and offers Show everything when a level matches nothing', async () => {
        const view = mount(ActivityWindow, { props: { events, connection: 'connected' } });

        expect(view.findAll('li')).toHaveLength(2);

        await view.findAll('[role="tab"]').find((tab) => tab.text() === 'Normal and up')?.trigger('click');
        expect(view.findAll('li')).toHaveLength(1);

        await view.setProps({ events: [events[1]] });
        expect(view.findAll('li')).toHaveLength(0);

        await view.findAll('button').find((button) => button.text() === 'Show everything')?.trigger('click');
        expect(view.findAll('li')).toHaveLength(1);
    });

    it('keeps its events after the connection drops and offers Reconnect', async () => {
        const view = mount(ActivityWindow, { props: { events, connection: 'disconnected' } });

        expect(view.findAll('li')).toHaveLength(2);

        await view.findAll('button').find((button) => button.text() === 'Reconnect')?.trigger('click');
        expect(view.emitted('reconnect')).toHaveLength(1);
    });

    it('asks for older events once the reader reaches the top while there are more', async () => {
        const view = mount(ActivityWindow, { props: { events, connection: 'connected', hasOlder: true } });

        await view.find('.overflow-y-auto').trigger('scroll');
        expect(view.emitted('older')).toHaveLength(1);

        await view.setProps({ hasOlder: false });
        await view.find('.overflow-y-auto').trigger('scroll');
        expect(view.emitted('older')).toHaveLength(1);
    });
});
