// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import type { LayoutFormData, LayoutPartData } from '@generated/types/core';
import { holdsContract } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';
import { reset, save, switchMethod } from '@generated/routes/settings';

const sent: SentRequest[] = vi.hoisted(() => []);

vi.mock('@inertiajs/vue3', async () => (await import('@kit/testing/pageRequests')).recordingInertia(sent));

const { default: LayoutForm } = await import('./LayoutForm.vue');

// What the settings page fixes in each of a group's forms: the owner and group it saves, at the revision it read.
const connectedProjects = { owner: 'Core', group: 'connected_projects', revision: 0 };
const remindersDomain = { owner: 'Core', group: 'domain_reminders', revision: 0 };

function part(fields: Partial<LayoutPartData> & Pick<LayoutPartData, 'tag' | 'key' | 'style'>): LayoutPartData {
    return { size: null, text: null, detail: null, rows: [], children: [], tabs: [], ...fields };
}

// A form of the settings page as SettingsIndex declares it, with one field.
function settingsForm(href: string, fixed: Record<string, string | number>, field: string, value: string): LayoutPartData {
    const form: LayoutFormData = { method: 'post', href, fixed, isKeyed: false };

    return part({
        tag: 'form',
        key: 'settings',
        style: 'stack',
        form,
        children: [part({ tag: 'field', key: field, style: 'toggle', field: { name: field, value } as LayoutPartData['field'] })],
    });
}

async function send(layoutPart: LayoutPartData): Promise<SentRequest | undefined> {
    await mount(LayoutForm, { props: { part: layoutPart } }).find('form').trigger('submit');

    return sent.at(-1);
}

describe('the forms of the settings page, as the page sends them', () => {
    it('saves a group, switches a group on and resets a group', async () => {
        holdsContract('settings-save', await send(settingsForm(save().url, connectedProjects, 'remote_projects', '1')));
        holdsContract('settings-switch', await send(settingsForm(switchMethod().url, remindersDomain, 'enabled', '1')));
        holdsContract('settings-reset', await send(settingsForm(reset().url, connectedProjects, 'remote_projects', '0')));
    });
});
