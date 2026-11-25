import type { LiveChannel, LiveEventHandler, LiveTransport } from '@inertiajs/core';
import type { UserConnection } from '@/echo';
import { traceLive } from '@/composables/liveTrace';

/**
 * A listener a live prop asked for: its event on its channel, bound while the tab's connection is that channel's.
 */
type WantedListener = { channel: LiveChannel; event: string; handler: LiveEventHandler; stop: (() => void) | null };

const wanted = new Set<WantedListener>();
const statusListeners = new Set<(connected: boolean) => void>();
let connection: UserConnection | null = null;
let stopStatus: (() => void) | null = null;

function isOwnChannel(channel: LiveChannel, own: UserConnection): boolean {
    return channel.type === 'private' && channel.name === own.channelName();
}

function bind(listener: WantedListener): void {
    if (connection === null || listener.stop !== null || !isOwnChannel(listener.channel, connection)) {
        return;
    }

    // A leading dot, as broadcastAs names need; only the listener is removed later, the channel is never left here.
    listener.stop = connection.listen(`.${listener.event}`, listener.handler);
}

function unbind(listener: WantedListener): void {
    listener.stop?.();
    listener.stop = null;
}

function report(connected: boolean): void {
    statusListeners.forEach((callback) => callback(connected));
}

/**
 * A channel that is not the viewer's own private channel is never listened on; the refusal is traced, never thrown,
 * because it runs during a page swap.
 */
function refuseForeignChannel(): () => void {
    traceLive('foreign channel refused');

    return () => undefined;
}

/**
 * Inertia's live transport over the tab's one connection: each live prop listens on the viewer's own channel, and
 * the listeners it wants are kept and bound again whenever the shell attaches a connection.
 */
export const liveTransport: LiveTransport = {
    subscribe(channel, event, handler) {
        if (channel.type !== 'private' || (connection !== null && !isOwnChannel(channel, connection))) {
            return refuseForeignChannel();
        }

        const listener: WantedListener = { channel, event, handler, stop: null };
        wanted.add(listener);
        bind(listener);

        return () => {
            unbind(listener);
            wanted.delete(listener);
        };
    },
    socketId: () => connection?.socketId() ?? null,
    onStatusChange(callback) {
        statusListeners.add(callback);

        return () => statusListeners.delete(callback);
    },
};

/**
 * Hands the transport the tab's connection, or none after sign-out: every wanted listener leaves the old one, binds
 * to the new one when it is that listener's channel, and the status reads lost until the new channel is signed in to.
 */
export function attachLiveConnection(next: UserConnection | null): void {
    wanted.forEach(unbind);
    stopStatus?.();
    stopStatus = null;
    connection = next;
    report(false);

    if (next === null) {
        return;
    }

    stopStatus = next.onStatus(report);
    wanted.forEach(bind);
}
