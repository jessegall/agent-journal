import type {
    ScreenFrameData,
    TerminalFrameData,
    TerminalInterestData,
    TerminalScreenIdentityData,
} from '@generated/types/core';
import { describe, expect, it } from 'vitest';
import type {
    HeldFrame,
    TerminalClient,
    TerminalFailure,
    TerminalScreen,
} from '@/components/terminal/terminalSubscription';
import {
    TerminalSubscription,
    WAKE_GAP_MILLISECONDS,
} from '@/components/terminal/terminalSubscription';

type Pending<Answer> = { resolve: (answer: Answer) => void; reject: (failure: unknown) => void };

/**
 * A client whose answers the test hands out one by one, and that remembers what it was asked.
 */
class FakeClient implements TerminalClient {
    opens: Pending<TerminalInterestData>[] = [];
    reads: { held: HeldFrame; answer: Pending<TerminalFrameData> }[] = [];
    closed: string[] = [];
    renewed: string[] = [];

    open = (): Promise<TerminalInterestData> =>
        new Promise((resolve, reject) => this.opens.push({ resolve, reject }));

    renew = async (interest: string): Promise<TerminalInterestData> => {
        this.renewed.push(interest);

        return interestOf(interest);
    };

    close = async (interest: string): Promise<void> => {
        this.closed.push(interest);
    };

    frame = (held: HeldFrame): Promise<TerminalFrameData> =>
        new Promise((resolve, reject) => this.reads.push({ held, answer: { resolve, reject } }));
}

function interestOf(id: string): TerminalInterestData {
    return { viewId: id, readInterestId: id, runtimeId: 'runtime', intervalMs: 500, expiresInSeconds: 30, isLive: true };
}

function identityOf(changes: Partial<TerminalScreenIdentityData> = {}): TerminalScreenIdentityData {
    return {
        sessionId: 'session',
        processGeneration: 1,
        epoch: 'epoch',
        stream: 'stream',
        privacyRevision: 0,
        attachment: null,
        containerInstance: null,
        ...changes,
    };
}

function frameOf(sequence: number, changes: Partial<ScreenFrameData> = {}): ScreenFrameData {
    return {
        epoch: 'epoch',
        sequence,
        captured: '2026-11-19T12:00:00Z',
        columns: 20,
        rows: [{ runs: [{ text: 'hello', style: {} }] }],
        cursor: { row: 0, column: 5, isVisible: true },
        buffer: 'normal',
        isPlain: false,
        isTooLarge: false,
        isUnreadable: false,
        hasNoTerminal: false,
        isShielded: false,
        privacyRevision: 0,
        stream: 'stream',
        proof: sequence,
        expiresAt: null,
        ...changes,
    } as ScreenFrameData;
}

function liveAnswer(sequence: number, liveForMs = 15_000): TerminalFrameData {
    return {
        status: 'live',
        identity: identityOf(),
        frame: frameOf(sequence),
        receivedAt: '2026-11-19T12:00:00Z',
        liveForMs,
    } as TerminalFrameData;
}

async function settled(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

function subscribed() {
    const client = new FakeClient();
    const clock = { now: 1_000 };
    const shown: TerminalScreen[] = [];
    let requests = 0;
    const subscription = new TerminalSubscription(
        client,
        () => `request-${++requests}`,
        () => clock.now,
        (screen) => shown.push(screen),
        (failure): TerminalFailure => failure as TerminalFailure,
    );

    return { client, clock, shown, subscription };
}

async function opened(interest = 'interest-1') {
    const setup = subscribed();
    setup.subscription.open();
    setup.client.opens[setup.client.opens.length - 1].resolve(interestOf(interest));
    await settled();

    return setup;
}

describe('TerminalSubscription', () => {
    it('opens one interest and reads its frames through it', async () => {
        const { client, subscription } = await opened();

        client.reads[0].answer.resolve(liveAnswer(1));
        await settled();

        expect(client.reads[0].held).toStrictEqual({ interest: 'interest-1', epoch: undefined, stream: undefined, after: 0 });
        expect(subscription.screen().state).toBe('live');
        expect(subscription.screen().frame?.sequence).toBe(1);
    });

    it('drops the answer of a retired subscription and closes the interest it opened late', async () => {
        const { client, subscription } = subscribed();
        subscription.open();
        subscription.open();

        client.opens[0].resolve(interestOf('stale'));
        client.opens[1].resolve(interestOf('current'));
        await settled();

        expect(client.closed).toContain('stale');
        expect(client.reads.map((read) => read.held.interest)).toEqual(['current']);
    });

    it('accepts only a later frame of the same stream', async () => {
        const { client, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(5));
        await settled();

        subscription.poll();
        client.reads[1].answer.resolve(liveAnswer(4));
        await settled();

        expect(subscription.screen().frame?.sequence).toBe(5);
        expect(client.reads[1].held).toEqual({ interest: 'interest-1', epoch: 'epoch', stream: 'stream', after: 5 });
    });

    it('blanks the screen at once on a privacy change and on a preview the host shielded', async () => {
        const { client, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(1));
        await settled();

        subscription.poll();
        client.reads[1].answer.resolve({
            status: 'preview_unavailable',
            identity: identityOf({ privacyRevision: 1 }),
            liveForMs: 15_000,
        } as TerminalFrameData);
        await settled();

        expect(subscription.screen().state).toBe('preview_unavailable');
        expect(subscription.screen().frame).toBeNull();
    });

    it('opens afresh when an answer belongs to another stream', async () => {
        const { client, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(1));
        await settled();

        subscription.poll();
        client.reads[1].answer.resolve({ ...liveAnswer(1), identity: identityOf({ stream: 'other' }) });
        await settled();

        expect(client.opens).toHaveLength(2);
        expect(client.closed).toEqual(['interest-1']);
        expect(subscription.screen().frame).toBeNull();
    });

    it('counts the screen live only until the relayed lifetime runs out on its own clock', async () => {
        const { client, clock, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(1, 2_000));
        await settled();

        clock.now += 1_000;
        subscription.tick();
        expect(subscription.screen().state).toBe('live');

        clock.now += 1_000;
        subscription.tick();
        expect(subscription.screen().state).toBe('not_reporting');
        expect(subscription.screen().frame).toBeNull();
    });

    it('blanks and opens afresh after the tab woke from a suspension', async () => {
        const { client, clock, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(1, 60_000));
        await settled();

        clock.now += WAKE_GAP_MILLISECONDS + 1;
        subscription.tick();

        expect(subscription.screen().frame).toBeNull();
        expect(client.opens).toHaveLength(2);
    });

    it('closes its own interest when it stops and reads nothing more', async () => {
        const { client, subscription } = await opened();

        subscription.stop();
        subscription.poll();

        expect(client.closed).toEqual(['interest-1']);
        expect(client.reads).toHaveLength(1);
    });

    it('shows a denial and clears the screen', async () => {
        const { client, subscription } = await opened();
        client.reads[0].answer.resolve(liveAnswer(1));
        await settled();

        subscription.poll();
        client.reads[1].answer.reject({ kind: 'refused', message: 'denied' });
        await settled();

        expect(subscription.screen()).toMatchObject({ state: 'refused', frame: null, refusal: 'denied' });
    });
});
