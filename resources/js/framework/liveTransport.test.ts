import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserConnection } from '@/echo';

vi.mock('@/composables/liveTrace', () => ({ traceLive: vi.fn() }));

type FakeConnection = UserConnection & {
    listened: Array<{ event: string; stop: ReturnType<typeof vi.fn> }>;
    report: (connected: boolean) => void;
};

function connectionFor(userId: string): FakeConnection {
    const statuses = new Set<(connected: boolean) => void>();
    const listened: FakeConnection['listened'] = [];

    return {
        userId,
        listened,
        channelName: () => `journal.user.${userId}`,
        listen: (event) => {
            const stop = vi.fn();
            listened.push({ event, stop });

            return stop;
        },
        socketId: () => `socket-${userId}`,
        onStatus: (callback) => {
            statuses.add(callback);

            return () => statuses.delete(callback);
        },
        leave: vi.fn(),
        report: (connected) => statuses.forEach((callback) => callback(connected)),
    };
}

const own = { name: 'journal.user.u1', type: 'private' };

async function transport() {
    vi.resetModules();

    return import('./liveTransport');
}

describe('liveTransport', () => {
    beforeEach(() => vi.clearAllMocks());

    it('refuses a channel that is not the viewers own private channel, by name and by type', async () => {
        const { attachLiveConnection, liveTransport } = await transport();
        const connection = connectionFor('u1');
        attachLiveConnection(connection);

        liveTransport.subscribe({ name: 'journal.user.u2', type: 'private' }, 'page.changed', vi.fn());
        liveTransport.subscribe({ name: 'journal.user.u1', type: 'public' }, 'page.changed', vi.fn());
        liveTransport.subscribe({ name: 'journal.user.u1', type: 'presence' }, 'page.changed', vi.fn());

        expect(connection.listened).toEqual([]);
    });

    it('listens with a leading dot and only removes its listener, never leaving the channel', async () => {
        const { attachLiveConnection, liveTransport } = await transport();
        const connection = connectionFor('u1');
        attachLiveConnection(connection);

        const stop = liveTransport.subscribe(own, 'page.changed', vi.fn());
        stop();

        expect(connection.listened.map((listened) => listened.event)).toEqual(['.page.changed']);
        expect(connection.listened[0].stop).toHaveBeenCalledOnce();
        expect(connection.leave).not.toHaveBeenCalled();
    });

    it('answers the socket id of the attached connection', async () => {
        const { attachLiveConnection, liveTransport } = await transport();

        expect(liveTransport.socketId?.()).toBeNull();
        attachLiveConnection(connectionFor('u1'));

        expect(liveTransport.socketId?.()).toBe('socket-u1');
    });

    it('reports connected only once the channel is signed in to, and lost when the transport drops', async () => {
        const { attachLiveConnection, liveTransport } = await transport();
        const statuses: boolean[] = [];
        liveTransport.onStatusChange?.((connected) => statuses.push(connected));
        const connection = connectionFor('u1');

        attachLiveConnection(connection);
        connection.report(true);
        connection.report(false);

        expect(statuses).toEqual([false, true, false]);
    });

    it('binds the wanted listeners when a connection attaches, and again after a user change', async () => {
        const { attachLiveConnection, liveTransport } = await transport();
        liveTransport.subscribe(own, 'page.changed', vi.fn());
        const first = connectionFor('u1');

        attachLiveConnection(first);
        expect(first.listened.map((listened) => listened.event)).toEqual(['.page.changed']);

        const second = connectionFor('u2');
        attachLiveConnection(second);
        liveTransport.subscribe({ name: 'journal.user.u2', type: 'private' }, 'page.changed', vi.fn());

        expect(first.listened[0].stop).toHaveBeenCalledOnce();
        expect(second.listened.map((listened) => listened.event)).toEqual(['.page.changed']);
    });
});
