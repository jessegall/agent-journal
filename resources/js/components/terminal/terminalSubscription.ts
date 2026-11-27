import type {
    ScreenFrameData,
    TerminalFrameData,
    TerminalInterestData,
    TerminalScreenIdentityData,
} from '@generated/types/core';
import { supersedes } from './terminalFrameOrder';

/**
 * The frame a read holds when it asks for the next one: the interest it reads through and the frame's place. A view
 * that holds no frame yet names no epoch and no stream.
 */
export type HeldFrame = { interest: string; epoch?: string; stream?: string; after: number };

/**
 * How the terminal reaches the journal for one agent: open, renew and close one read interest, and read its frames.
 */
export type TerminalClient = {
    open: (requestId: string, signal: AbortSignal) => Promise<TerminalInterestData>;
    renew: (interest: string) => Promise<TerminalInterestData>;
    close: (interest: string) => Promise<void>;
    frame: (held: HeldFrame, signal: AbortSignal) => Promise<TerminalFrameData>;
};

/**
 * A failed call the client could report: refused by the journal with its words, or lost.
 */
export type TerminalFailure = { kind: 'refused' | 'lost'; message: string };

/**
 * What the terminal shows: opening, refused, the live screen, an older host's last reported screen, no preview of a
 * shielded screen, a host that stopped proving itself alive, or the last screen of a terminal that ended.
 */
export type TerminalScreenState =
    | 'opening'
    | 'refused'
    | 'live'
    | 'last_reported'
    | 'preview_unavailable'
    | 'not_reporting'
    | 'connection_lost'
    | 'ended';

/**
 * The terminal's state as its presentation draws it.
 */
export type TerminalScreen = {
    state: TerminalScreenState;
    frame: ScreenFrameData | null;
    // The session and generation the shown screen belongs to, for actions that must name them, such as Stop.
    identity: TerminalScreenIdentityData | null;
    // Whether reads stopped arriving; the last screen stays with its age until its proof runs out.
    reconnecting: boolean;
    // Whether this screen follows a restart of the same session, which the view marks between the screens.
    restarted: boolean;
    refusal: string;
    receivedAt: number;
    endedAt: string;
};

/**
 * How long the screen may go without a tick before the tab counts as woken from a suspension.
 */
export const WAKE_GAP_MILLISECONDS = 3_000;

export function blank(state: TerminalScreenState, receivedAt: number): TerminalScreen {
    return {
        state,
        frame: null,
        identity: null,
        reconnecting: false,
        restarted: false,
        refusal: '',
        receivedAt,
        endedAt: '',
    };
}

function isSameStream(first: TerminalScreenIdentityData, second: TerminalScreenIdentityData): boolean {
    return (
        first.sessionId === second.sessionId &&
        first.processGeneration === second.processGeneration &&
        first.epoch === second.epoch &&
        first.stream === second.stream &&
        first.attachment === second.attachment
    );
}

/**
 * One view's subscription to an agent's terminal. Every open is a new subscription nonce with its own read interest;
 * an answer of a retired nonce, another stream or another privacy revision is dropped, and a privacy or identity
 * change, a hide or a denial clears the screen at once. The screen counts live only until the remaining lifetime the
 * journal relayed runs out on this client's clock.
 */
export class TerminalSubscription {
    private nonce = 0;
    private interest: string | null = null;
    private opening = false;
    private reading = false;
    private stopped = false;
    // lost is a subscription whose reads stopped arriving; its next answer opens afresh, so inspect is checked again.
    private lost = false;
    private restarted = false;
    private identity: TerminalScreenIdentityData | null = null;
    private liveUntil = 0;
    private lastTick: number;
    private reads = new AbortController();
    private current: TerminalScreen;

    constructor(
        private readonly client: TerminalClient,
        private readonly newRequestId: () => string,
        private readonly now: () => number,
        private readonly show: (screen: TerminalScreen) => void,
        private readonly failureOf: (failure: unknown) => TerminalFailure,
    ) {
        this.lastTick = now();
        this.current = blank('opening', now());
    }

    screen(): TerminalScreen {
        return this.current;
    }

    /**
     * The read interest the subscription reads through now; none while it opens or after it stopped.
     */
    readInterest(): string | null {
        return this.interest;
    }

    /**
     * Starts a fresh subscription: the old one is retired and its interest closed first.
     */
    open(): void {
        this.retire();
        this.stopped = false;
        this.restarted = false;
        const nonce = this.nonce;
        this.opening = true;
        this.publish(blank('opening', this.now()));
        this.client.open(this.newRequestId(), this.reads.signal).then(
            (interest) => {
                if (nonce !== this.nonce) {
                    this.closeQuietly(interest.readInterestId);

                    return;
                }
                this.opening = false;
                this.interest = interest.readInterestId;
                this.poll();
            },
            (failure: unknown) => {
                this.opening = false;
                this.fail(nonce, failure);
            },
        );
    }

    /**
     * Reads the next frame unless a read is still out; a subscription whose open was lost opens again.
     */
    poll(): void {
        if (this.stopped) {
            return;
        }
        if (this.interest === null) {
            if (!this.opening && this.current.state === 'opening') {
                this.open();
            }

            return;
        }
        if (this.reading) {
            return;
        }
        const nonce = this.nonce;
        const drawn = this.current.frame;
        this.reading = true;
        this.client
            .frame(
                {
                    interest: this.interest,
                    epoch: drawn?.epoch,
                    stream: drawn?.stream ?? undefined,
                    after: drawn?.sequence ?? 0,
                },
                this.reads.signal,
            )
            .then(
                (answer) => {
                    this.reading = false;
                    if (nonce === this.nonce) {
                        this.accept(answer);
                    }
                },
                (failure: unknown) => {
                    this.reading = false;
                    this.fail(nonce, failure);
                },
            );
    }

    renew(): void {
        if (this.interest === null) {
            return;
        }
        const nonce = this.nonce;
        this.client.renew(this.interest).catch((failure: unknown) => {
            if (nonce === this.nonce && this.failureOf(failure).kind === 'refused') {
                this.open();
            }
        });
    }

    /**
     * Blanks a screen whose relayed lifetime ran out, and blanks and reopens after the tab woke from a suspension.
     */
    tick(): void {
        const now = this.now();
        const slept = now - this.lastTick > WAKE_GAP_MILLISECONDS;
        this.lastTick = now;
        if (slept && this.interest !== null) {
            this.open();

            return;
        }
        if (this.current.state === 'live' && now >= this.liveUntil) {
            this.publish({ ...blank('not_reporting', this.current.receivedAt) });
        }
    }

    /**
     * Ends the subscription, as when the view hides or unmounts: reads stop, its interest closes and the screen clears.
     */
    stop(): void {
        this.retire();
        this.stopped = true;
        this.publish(blank('opening', this.now()));
    }

    private accept(answer: TerminalFrameData): void {
        if (this.lost) {
            this.lost = false;
            this.open();

            return;
        }
        if (answer.status === 'restarted') {
            this.open();
            this.restarted = true;
            this.publish(this.current);

            return;
        }
        if (answer.status === 'ended') {
            this.interest = null;
            this.publish({
                ...blank('ended', this.current.receivedAt),
                frame: answer.frame ?? null,
                endedAt: answer.endedAt ?? '',
            });

            return;
        }
        const identity = answer.identity;
        if (identity === undefined) {
            return;
        }
        if (this.identity !== null && !isSameStream(this.identity, identity)) {
            this.open();

            return;
        }
        if (this.identity !== null && this.identity.privacyRevision !== identity.privacyRevision) {
            this.publish(blank('opening', this.now()));
        }
        this.identity = identity;
        if (answer.liveForMs !== undefined) {
            this.liveUntil = this.now() + answer.liveForMs;
        }
        if (answer.status === 'unchanged') {
            return;
        }
        if (answer.status === 'preview_unavailable' || answer.status === 'connection_lost') {
            this.publish({ ...blank(answer.status, this.now()), identity });

            return;
        }
        const frame = answer.frame;
        if (frame === undefined || !supersedes(frame, this.current.frame)) {
            return;
        }
        this.publish({
            ...blank(answer.status, Date.parse(answer.receivedAt ?? '') || this.now()),
            frame,
            identity,
        });
    }

    private fail(nonce: number, failure: unknown): void {
        if (nonce !== this.nonce) {
            return;
        }
        const reason = this.failureOf(failure);
        if (reason.kind === 'lost') {
            this.lost = true;
            this.publish({ ...this.current, reconnecting: true });

            return;
        }
        this.retire();
        this.publish({ ...blank('refused', this.now()), refusal: reason.message });
    }

    private retire(): void {
        this.nonce++;
        this.reads.abort();
        this.reads = new AbortController();
        this.reading = false;
        this.opening = false;
        if (this.interest !== null) {
            this.closeQuietly(this.interest);
        }
        this.interest = null;
        this.identity = null;
        this.liveUntil = 0;
    }

    private closeQuietly(interest: string): void {
        this.client.close(interest).catch(() => undefined);
    }

    private publish(screen: TerminalScreen): void {
        this.current = { ...screen, restarted: this.restarted };
        this.show(screen);
    }
}
