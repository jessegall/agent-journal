import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { presenceHeartbeat } from './presenceHeartbeat';

/**
 * A sender whose requests stay pending until the test answers them with a status, or fails them.
 */
function heldSender() {
    const answers: Array<(status: number) => void> = [];
    const failures: Array<(error: Error) => void> = [];
    const send = vi.fn(
        () =>
            new Promise<number>((resolve, reject) => {
                answers.push(resolve);
                failures.push(reject);
            }),
    );

    return {
        send,
        async answer(status: number): Promise<void> {
            answers.shift()?.(status);
            failures.shift();
            await vi.advanceTimersByTimeAsync(0);
        },
        async fail(): Promise<void> {
            answers.shift();
            failures.shift()?.(new Error('offline'));
            await vi.advanceTimersByTimeAsync(0);
        },
    };
}

describe('the presence heartbeat', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('beats at once on start and once every interval', async () => {
        const sender = heldSender();
        const heartbeat = presenceHeartbeat(sender.send, 30_000);

        heartbeat.start();
        expect(sender.send).toHaveBeenCalledTimes(1);
        await sender.answer(204);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(sender.send).toHaveBeenCalledTimes(2);
        await sender.answer(204);

        await vi.advanceTimersByTimeAsync(30_000);
        expect(sender.send).toHaveBeenCalledTimes(3);
        heartbeat.stop();
    });

    it('never has two beats in flight and does not replay skipped ticks', async () => {
        const sender = heldSender();
        const heartbeat = presenceHeartbeat(sender.send, 30_000);

        heartbeat.start();
        await vi.advanceTimersByTimeAsync(90_000);
        heartbeat.beatNow();
        expect(sender.send).toHaveBeenCalledTimes(1);

        await sender.answer(204);
        expect(sender.send).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(30_000);
        expect(sender.send).toHaveBeenCalledTimes(2);
        heartbeat.stop();
    });

    it('stops when the sign-in is refused', async () => {
        for (const status of [401, 419]) {
            const sender = heldSender();
            const heartbeat = presenceHeartbeat(sender.send, 30_000);

            heartbeat.start();
            await sender.answer(status);
            await vi.advanceTimersByTimeAsync(120_000);
            heartbeat.beatNow();

            expect(sender.send).toHaveBeenCalledTimes(1);
        }
    });

    it('keeps beating after a transient failure', async () => {
        const sender = heldSender();
        const heartbeat = presenceHeartbeat(sender.send, 30_000);

        heartbeat.start();
        await sender.fail();
        await vi.advanceTimersByTimeAsync(30_000);
        expect(sender.send).toHaveBeenCalledTimes(2);
        await sender.answer(500);
        await vi.advanceTimersByTimeAsync(30_000);

        expect(sender.send).toHaveBeenCalledTimes(3);
        heartbeat.stop();
    });

    it('beats at once when asked, and not after it stopped', async () => {
        const sender = heldSender();
        const heartbeat = presenceHeartbeat(sender.send, 30_000);

        heartbeat.start();
        await sender.answer(204);
        heartbeat.beatNow();
        expect(sender.send).toHaveBeenCalledTimes(2);
        await sender.answer(204);

        heartbeat.stop();
        heartbeat.beatNow();
        await vi.advanceTimersByTimeAsync(60_000);
        expect(sender.send).toHaveBeenCalledTimes(2);
    });

    it('starting twice keeps one timer', async () => {
        const sender = heldSender();
        const heartbeat = presenceHeartbeat(sender.send, 30_000);

        heartbeat.start();
        heartbeat.start();
        await sender.answer(204);
        await vi.advanceTimersByTimeAsync(30_000);

        expect(sender.send).toHaveBeenCalledTimes(2);
        heartbeat.stop();
    });
});
