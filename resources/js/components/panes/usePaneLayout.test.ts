// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { defaultArrangement, shownWindows } from './arrangement';
import type { PaneWindow } from './paneLayout';
import { providePaneLayout } from './usePaneLayout';
import type { PaneLayoutStore } from './usePaneLayout';

const windows = [
    { key: 'chat', title: 'Chat', icon: 'chat' },
    { key: 'plans', title: 'Plans', icon: 'plan' },
    { key: 'tasks', title: 'Tasks', icon: 'todos' },
] as PaneWindow[];

async function openHome(): Promise<PaneLayoutStore> {
    let store: PaneLayoutStore | undefined;

    mount(
        defineComponent({
            setup() {
                store = providePaneLayout('home-layout', () => windows);

                return () => h('div');
            },
        }),
    );
    await nextTick();

    if (store === undefined) {
        throw new Error('The pane layout was not provided.');
    }

    return store;
}

describe('the Home arrangement', () => {
    beforeEach(() => window.localStorage.clear());

    it('opens on the chat alone the first time', async () => {
        const store = await openHome();

        expect(shownWindows(store.arrangement.value)).toEqual(['chat']);
        expect(store.isDefault.value).toBe(true);
    });

    it('restores the arrangement the user made on the next visit', async () => {
        const first = await openHome();
        const arranged = defaultArrangement('chat', ['plans', 'tasks']);
        first.apply(arranged);

        const next = await openHome();

        expect(shownWindows(next.arrangement.value)).toEqual(shownWindows(arranged));
        expect(next.isDefault.value).toBe(false);
    });
});
