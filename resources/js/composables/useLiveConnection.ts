import { notifyChatAccessEnded } from '@/kit/chatAccess';
import { useAppContext } from '@/framework/appContext';
import { onBeforeUnmount, onMounted, readonly, ref, watch } from 'vue';
import type { LiveHandlers, UserConnection } from '@/echo';
import { connectUser } from '@/echo';
import { attachLiveConnection } from '@/framework/liveTransport';
import { liveTrace } from './liveTrace';
import { clearProtectedViews, purge } from './protectedView';
import { followNotificationsSignal, reconcileNotifications } from './useNotifications';
import { forgetPageChanges, markDirty, useLiveVisits } from './usePageChanges';

/**
 * Where the tab's live connection stands: connecting until the transport and the private channel are both signed in
 * to, subscribed after that, and refused when the channel sign-in failed. Each sign-in to the channel counts one
 * subscription generation.
 */
export type LiveStage = 'connecting' | 'subscribed' | 'refused';

export class LiveConnectionState {
    readonly stage = ref<LiveStage>('connecting');

    readonly generation = ref(0);

    /**
     * The channel is signed in to. The first time, one catch-up read covers what changed before it; after a reconnect
     * the live client reads its props again by itself.
     */
    subscribed(): void {
        this.generation.value++;
        this.stage.value = 'subscribed';

        if (this.generation.value === 1) {
            markDirty('catch-up');
        }
    }

    /**
     * The transport went away: what protected views show is cleared at once, and read again once signed in again.
     */
    lost(): void {
        this.stage.value = 'connecting';
        clearProtectedViews();
    }

    refused(): void {
        this.stage.value = 'refused';
    }

    restart(): void {
        this.stage.value = 'connecting';
    }
}

const state = new LiveConnectionState();

export const liveStage = readonly(state.stage);

/**
 * How many times the channel was signed in to; it grows by one at every reconnect.
 */
export const liveGeneration = readonly(state.generation);

let reconnect: (() => void) | undefined;

/**
 * Opens the connection again after its channel sign-in was refused.
 */
export function retryLiveConnection(): void {
    reconnect?.();
}

/**
 * The shell's one connection: opened in the browser for the signed-in user, opened again only for a new user or on
 * Retry, and closed when the user signs out or the shell leaves. What a replaced connection reports later is ignored.
 */
export function useLiveConnection(): void {
    const { viewer } = useAppContext();
    let connection: UserConnection | undefined;
    useLiveVisits();

    function handlersFor(isCurrent: () => boolean): LiveHandlers {
        const whileCurrent = <Arguments extends unknown[]>(run: (...values: Arguments) => void) =>
            (...values: Arguments) => {
                if (isCurrent()) {
                    run(...values);
                }
            };

        return {
            onProtectedViewInvalidated: whileCurrent(() => {
                clearProtectedViews();
                markDirty('signal');
            }),
            onNotificationsChanged: whileCurrent(followNotificationsSignal),
            onChatAccessEnded: whileCurrent(notifyChatAccessEnded),
            onSubscribed: whileCurrent(() => {
                state.subscribed();
                reconcileNotifications();
            }),
            onLost: whileCurrent(() => state.lost()),
            onRefused: whileCurrent(() => state.refused()),
        };
    }

    function open(userId: string): void {
        state.restart();
        const opened: UserConnection = connectUser(userId, handlersFor(() => connection === opened));
        connection = opened;
        attachLiveConnection(opened);
    }

    function follow(userId: string | undefined): void {
        if (connection?.userId === userId) {
            return;
        }

        // Another user, or none: what the previous user's views show and keep is purged.
        if (connection !== undefined) {
            purge();
        }

        connection?.leave();
        connection = undefined;
        attachLiveConnection(null);
        forgetPageChanges();

        if (userId !== undefined) {
            open(userId);
        }
    }

    onMounted(() => {
        window.journalLiveTrace = liveTrace;
        reconnect = () => {
            const userId = connection?.userId;
            connection?.leave();
            connection = undefined;
            attachLiveConnection(null);

            if (userId !== undefined) {
                open(userId);
            }
        };
        follow(viewer.value.id);
        watch(() => viewer.value.id, follow);
    });
    onBeforeUnmount(() => {
        reconnect = undefined;
        follow(undefined);
    });
}
