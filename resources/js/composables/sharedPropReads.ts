/**
 * What became of one read of a prop: its answer applied, it failed, or the user may not see what it reads.
 */
export type PropReadOutcome = 'applied' | 'failed' | 'denied';

/**
 * Sends one read of a prop and answers how to cancel it; it calls ended once with the outcome.
 */
export type PropReadSender = (propName: string, ended: (outcome: PropReadOutcome) => void) => () => void;

type InFlightRead = {
    generation: number;
    // The mounts waiting on the read, in the order they joined; the first announces its outcome.
    mounts: number[];
    announcers: Map<number, (outcome: PropReadOutcome) => void>;
    cancel: () => void;
};

/**
 * The reads of one tab's props, shared by every mount that asks for the same key at once: the signed-in user, the
 * prop (its registration and record), the query and the authorization generation. Two keys never share a read. The
 * mount that started a read announces its outcome once; when it leaves, the next mount still waiting takes that over;
 * when none is left the read is cancelled. A denial raises the authorization generation and cancels every older read,
 * so a late answer after it paints nothing anywhere.
 */
export class SharedPropReads {
    private readonly inFlight = new Map<string, InFlightRead>();

    /**
     * The mounts showing each prop now, one per host.
     */
    private readonly shown = new Map<string, Set<number>>();

    private generation = 0;

    constructor(private readonly send: PropReadSender) {}

    /**
     * The key a read of this prop is shared under, for this user and query, in the current authorization generation.
     */
    keyOf(principal: string, propName: string, query: string): string {
        return [principal, propName, query, this.generation].join('|');
    }

    /**
     * Joins the read under the key, or starts it when none is in flight; announce hears its outcome only while this
     * mount is the one announcing.
     */
    request(key: string, propName: string, mount: number, announce: (outcome: PropReadOutcome) => void): void {
        const joined = this.inFlight.get(key);

        if (joined !== undefined) {
            if (!joined.mounts.includes(mount)) {
                joined.mounts.push(mount);
            }

            joined.announcers.set(mount, announce);

            return;
        }

        const read: InFlightRead = {
            generation: this.generation,
            mounts: [mount],
            announcers: new Map([[mount, announce]]),
            cancel: () => undefined,
        };
        this.inFlight.set(key, read);
        read.cancel = this.send(propName, (outcome) => this.end(key, read, outcome));
    }

    /**
     * The mount leaves: the read stays for the mounts still waiting, and is cancelled when none is.
     */
    detach(key: string, mount: number): void {
        const read = this.inFlight.get(key);

        if (read === undefined) {
            return;
        }

        read.mounts = read.mounts.filter((waiting) => waiting !== mount);
        read.announcers.delete(mount);

        if (read.mounts.length === 0) {
            this.inFlight.delete(key);
            read.cancel();
        }
    }

    /**
     * The user may no longer see what some read shows: every read started before is cancelled and its answer is
     * never painted.
     */
    deny(): void {
        this.generation++;

        for (const read of this.inFlight.values()) {
            read.cancel();
        }

        this.inFlight.clear();
    }

    /**
     * A host shows the prop.
     */
    show(propName: string, mount: number): void {
        this.shown.set(propName, (this.shown.get(propName) ?? new Set()).add(mount));
    }

    /**
     * A host stops showing the prop; answers whether it was the last one showing it.
     */
    hide(propName: string, mount: number): boolean {
        const mounts = this.shown.get(propName);
        mounts?.delete(mount);

        if (mounts !== undefined && mounts.size > 0) {
            return false;
        }

        this.shown.delete(propName);

        return true;
    }

    isInFlight(key: string): boolean {
        return this.inFlight.has(key);
    }

    private end(key: string, read: InFlightRead, outcome: PropReadOutcome): void {
        if (this.inFlight.get(key) !== read || read.generation !== this.generation) {
            return;
        }

        this.inFlight.delete(key);

        if (outcome === 'denied') {
            this.deny();
        }

        const announcer = read.mounts[0];

        if (announcer !== undefined) {
            read.announcers.get(announcer)?.(outcome);
        }
    }
}
