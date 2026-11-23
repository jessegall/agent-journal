import { onBeforeUnmount, onMounted } from 'vue';
import type { WindowPlace } from '@/types/generated';
import { dockWindow, showWindow } from './arrangement';
import type { PaneLayoutStore } from './usePaneLayout';

/**
 * The window a digit with Option or Alt brings forward, by its place in a work layout. The key's place on the keyboard
 * is read, since Option with a digit types another character on a Mac.
 */
const PLACE_BY_KEY: Record<string, WindowPlace> = { Digit1: 'tree', Digit2: 'feed' };

const NEXT_WINDOW_KEY = 'Backquote';

/**
 * The desk's window keys: Alt+1 brings the tree window forward, such as Project, and Alt+2 the feed window, such as
 * Activity, each docked first when it is closed; Alt+` goes to the next open window in turn.
 */
export function useWindowKeys(store: PaneLayoutStore): void {
    let lastShown = '';

    function nextOpenWindow(): string | undefined {
        const open = store.shownKeys.value;

        return open[(open.indexOf(lastShown) + 1) % open.length];
    }

    function windowFor(event: KeyboardEvent): string | undefined {
        if (event.code === NEXT_WINDOW_KEY) {
            return nextOpenWindow();
        }

        const place = PLACE_BY_KEY[event.code];

        return store.windows.value.find((each) => place !== undefined && each.place === place)?.key;
    }

    function press(event: KeyboardEvent): void {
        if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) {
            return;
        }

        const key = windowFor(event);

        if (key === undefined) {
            return;
        }

        event.preventDefault();
        const arrangement = store.arrangement.value;
        store.apply(store.shownKeys.value.includes(key) ? showWindow(arrangement, key) : dockWindow(arrangement, key));
        lastShown = key;
    }

    onMounted(() => window.addEventListener('keydown', press));
    onBeforeUnmount(() => window.removeEventListener('keydown', press));
}
