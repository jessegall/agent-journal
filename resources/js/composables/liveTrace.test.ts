import { describe, expect, it } from 'vitest';
import { liveTrace, traceLive } from './liveTrace';

describe('liveTrace', () => {
    it('keeps a delivery in the order it happened, each step with its time', () => {
        traceLive('transport connected');
        traceLive('subscription authorized');
        traceLive('signal received');
        traceLive('read started');
        traceLive('read applied');

        const steps = liveTrace().slice(-5);

        expect(steps.map((entry) => entry.step)).toEqual([
            'transport connected',
            'subscription authorized',
            'signal received',
            'read started',
            'read applied',
        ]);
        expect(steps.every((entry) => !Number.isNaN(Date.parse(entry.at)))).toBe(true);
    });

    it('names a read that timed out, one that was cancelled and one that resumed after failing', () => {
        traceLive('read timed out');
        traceLive('read cancelled');
        traceLive('read resumed');

        expect(liveTrace().slice(-3).map((entry) => entry.step)).toEqual([
            'read timed out',
            'read cancelled',
            'read resumed',
        ]);
    });

    it('keeps only the last fifty steps', () => {
        for (let count = 0; count < 60; count++) {
            traceLive('signal received');
        }

        traceLive('read failed');

        expect(liveTrace()).toHaveLength(50);
        expect(liveTrace().at(-1)?.step).toBe('read failed');
    });
});
