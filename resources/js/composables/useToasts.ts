import { usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { keepStored, readStored } from './browserStorage';
import { onPurge } from './protectedView';
import { toastStore } from './toastStore';
import type { ToastStore } from './toastStore';

/**
 * The tab's one toast store, cleared by every protected purge, sign-out included.
 */
const store = toastStore();
onPurge(store.clear);

const QUIET_KEY = 'toasts-quiet';

function quietKeyOf(userId: string): string {
    return `${QUIET_KEY}:${userId}`;
}

function holdWhileHidden(): void {
    if (document.visibilityState === 'visible') {
        store.releaseAll('hidden');

        return;
    }

    store.holdAll('hidden');
}

/**
 * The shell's toasts: a hidden tab holds every countdown, and quiet holds for the signed-in user in every tab of
 * the session, kept in the browser's storage and followed through its storage events.
 */
export function useToasts(): ToastStore & { quietForUser(): void; resumeForUser(): void } {
    const page = usePage();
    const userId = () => page.props.currentUser?.id;

    function followStoredQuiet(): void {
        const id = userId();

        if (id === undefined) {
            return;
        }

        if (readStored('local', quietKeyOf(id)) === '1') {
            store.quiet();

            return;
        }

        store.resume();
    }

    function followStorage(event: StorageEvent): void {
        const id = userId();

        if (id !== undefined && event.key === quietKeyOf(id)) {
            followStoredQuiet();
        }
    }

    onMounted(() => {
        followStoredQuiet();
        holdWhileHidden();
        document.addEventListener('visibilitychange', holdWhileHidden);
        window.addEventListener('storage', followStorage);
        watch(userId, followStoredQuiet);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', holdWhileHidden);
        window.removeEventListener('storage', followStorage);
    });

    return {
        ...store,
        quietForUser: () => {
            store.quiet();
            const id = userId();

            if (id !== undefined) {
                keepStored('local', quietKeyOf(id), '1');
            }
        },
        resumeForUser: () => {
            store.resume();
            const id = userId();

            if (id !== undefined) {
                keepStored('local', quietKeyOf(id), '0');
            }
        },
    };
}
