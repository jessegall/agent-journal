// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { AgentOptionData } from '@generated/types/chat';

const visited: string[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: { visit: (url: string) => visited.push(url) },
}));

const { default: AgentMenu } = await import('./AgentMenu.vue');
const { HANDED_RECORD_TYPE, useHandOver } = await import('./composables/useHandOver');

function agent(id: string, name: string, retired = false): AgentOptionData {
    return {
        id,
        name,
        profileKey: 'journal-main',
        retired,
        presence: retired ? 'retired' : 'idle',
        presenceLabel: retired ? 'Retired' : 'Idle',
        sessionId: null,
        sessionGeneration: 0,
        hasTerminal: false,
        switchId: null,
        switchStage: null,
        switchStageLabel: null,
        isSwitchOver: true,
        actions: retired ? [] : ['start'],
        conversations: [],
        startRefusal: null,
        sessionDriver: null,
        sessionDriverLabel: null,
        needsAttention: false,
        status: {
            sessionState: retired ? 'retired' : 'idle',
            label: retired ? 'Retired' : 'Idle',
            reason: null,
            remedy: null,
            operation: null,
            commandOutcome: null,
            observationAgeSeconds: null,
            actions: [{ type: 'start', label: 'Start session' }],
            isProcessConfirmed: false,
        },
    };
}

function menu() {
    return mount(AgentMenu, {
        props: {
            agents: [agent('main', 'Main agent'), agent('reviewer', 'Reviewer'), agent('old', 'Old writer', true)],
            mainAgentId: 'main',
            selectedAgentId: 'main',
            agentUrl: (chosen: AgentOptionData) => `/?agent=${chosen.id}`,
        },
    });
}

describe('AgentMenu', () => {
    it('groups the agents as main, helpers and retired', () => {
        const groups = menu()
            .findAll('[role="group"]')
            .map((group) => group.find(`[id="${group.attributes('aria-labelledby')}"]`).text());

        expect(groups).toEqual(['Main', 'Helpers', 'Retired']);
    });

    it('gives the search the focus when it opens', () => {
        const opened = mount(AgentMenu, { props: menu().props(), attachTo: document.body });

        expect(document.activeElement).toBe(opened.find('input').element);
        opened.unmount();
    });

    it('narrows the agents by the search and chooses the first with Enter', async () => {
        const found = menu();
        const search = found.find('input');

        await search.setValue('rev');
        expect(found.findAll('[role="option"]').map((option) => option.find('.truncate').text())).toEqual(['Reviewer']);
        await search.trigger('keydown', { key: 'Enter' });

        expect(visited).toEqual(['/?agent=reviewer']);
        expect(found.emitted('close')).toHaveLength(1);
    });

    it('hands a record let go on an agent to that agent, whose chat opens', async () => {
        visited.length = 0;
        const record = { title: 'Doc 101', reference: '/documents/101' };
        const dataTransfer = {
            types: [HANDED_RECORD_TYPE],
            getData: () => JSON.stringify(record),
        };
        const reviewer = menu().findAll('[role="option"]')[1];

        await reviewer.trigger('drop', { dataTransfer });

        expect(visited).toEqual(['/?agent=reviewer']);
        expect(useHandOver().takeFor('reviewer')).toEqual({ ...record, agentId: 'reviewer' });
        expect(useHandOver().takeFor('reviewer')).toBeNull();
    });
});
