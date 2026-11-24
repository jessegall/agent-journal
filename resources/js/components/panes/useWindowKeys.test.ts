// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { panesIn } from './paneLayout';
import type { PaneWindow } from './paneLayout';
import { providePaneLayout } from './usePaneLayout';
import type { PaneLayoutStore } from './usePaneLayout';
import { useWindowKeys } from './useWindowKeys';

const windows = [
    { key: 'chat', title: 'Chat', icon: 'speech' },
    { key: 'project', title: 'Project', icon: 'folder', place: 'tree' },
    { key: 'activity', title: 'Activity', icon: 'activity', place: 'feed' },
] as PaneWindow[];

function mountDesk(): { store: PaneLayoutStore; unmount: () => void } {
    let store: PaneLayoutStore | undefined;
    const Harness = defineComponent({
        setup() {
            store = providePaneLayout('window-keys', () => windows);
            useWindowKeys(store);

            return () => h('div');
        },
    });
    const view = mount(Harness, { attachTo: document.body });

    if (store === undefined) {
        throw new Error('The desk did not mount');
    }

    return { store, unmount: () => view.unmount() };
}

function press(code: string, init: KeyboardEventInit = { altKey: true }): void {
    window.dispatchEvent(new KeyboardEvent('keydown', { code, cancelable: true, ...init }));
}

function activeWindows(store: PaneLayoutStore): (string | null)[] {
    return panesIn(store.layout.value).map((pane) => pane.active);
}

describe('the window keys', () => {
    beforeEach(() => localStorage.clear());

    it('open the tree window with Alt+1 and the feed window with Alt+2, docked', () => {
        const { store, unmount } = mountDesk();

        press('Digit1');
        press('Digit2');

        expect(store.shownKeys.value).toEqual(expect.arrayContaining(['chat', 'project', 'activity']));
        expect(store.detached.value).toEqual([]);
        unmount();
    });

    it('bring an open window forward and go to the next open window with Alt+`', () => {
        const { store, unmount } = mountDesk();
        press('Digit1');
        const shownBefore = activeWindows(store);

        press('Backquote');

        expect(activeWindows(store)).toEqual(shownBefore);
        expect(store.shownKeys.value).toHaveLength(2);
        unmount();
    });

    it('leave the digits alone without Alt', () => {
        const { store, unmount } = mountDesk();

        press('Digit1', {});

        expect(store.shownKeys.value).toEqual(['chat']);
        unmount();
    });
});
