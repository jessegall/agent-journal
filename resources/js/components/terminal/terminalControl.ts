import type { TerminalControlData } from '@generated/types/core';

/**
 * How a view reaches the journal to control one agent's terminal: take, cancel, renew, give back, send, choose, check
 * and read a take's receipt. Every answer is the take as it stands.
 */
export type TerminalControlClient = {
    take: (interest: string, takeId: string) => Promise<TerminalControlData>;
    cancel: (takeId: string) => Promise<TerminalControlData>;
    renew: (grantId: string) => Promise<TerminalControlData>;
    release: (grantId: string) => Promise<TerminalControlData>;
    input: (
        grantId: string,
        input: TerminalInputPayload,
        sequence: number,
        screenRevision: number,
    ) => Promise<TerminalControlData>;
    choose: (grantId: string, choice: DraftChoice, sequence: number) => Promise<TerminalControlData>;
    check: (grantId: string) => Promise<TerminalControlData>;
    receipt: (takeId: string, sequence: number) => Promise<TerminalControlData>;
    openPrivate: (grantId: string, sequence: number) => Promise<TerminalControlData>;
    submitPrivate: (
        grantId: string,
        submissionId: string,
        value: string,
        sequence: number,
    ) => Promise<TerminalControlData>;
    cancelPrivate: (grantId: string) => Promise<TerminalControlData>;
};

/**
 * One input as the journal takes it: text with or without Enter, one named key, or a paste.
 */
export type TerminalInputPayload =
    | { type: 'text'; text: string; enter: boolean }
    | { type: 'key'; key: string }
    | { type: 'paste'; text: string }
    | { type: 'resize'; rows: number; columns: number };

/**
 * The most bytes one paste may carry, as the journal bounds it.
 */
export const PASTE_BYTE_LIMIT = 16_384;

/**
 * What the writer decides for an unfinished line when they give the input back.
 */
export type DraftChoice = 'send' | 'save-and-clear' | 'cancel-pending-work';

/**
 * Where this view's control stands: watching, asking for control, holding it, giving it back, an input that may
 * have reached the terminal, an unfinished line waiting for a choice, or an actor who may only watch.
 */
export type ControlState =
    | 'watching'
    | 'requesting'
    | 'controlling'
    | 'releasing'
    | 'uncertain'
    | 'choosing'
    | 'private_opening'
    | 'private'
    | 'watch_only';

/**
 * The control as the bar draws it: its state, the notice to show, and the line typed and not yet entered, which give
 * back asks about.
 */
export type ControlView = {
    state: ControlState;
    notice: string;
    unsentLine: string;
    savedDrafts: string[];
    // The size the last resize achieved, as rowsxcolumns, or that it was unavailable.
    geometry: string;
    // Whether the host offers private entry for this terminal.
    privateEntry: boolean;
};

/**
 * How a failed call reads: refused with its code and words, or lost.
 */
export type ControlFailure = { kind: 'refused' | 'lost'; code: string; message: string };

/**
 * How often a held grant is renewed and a pending take or input is asked about.
 */
export const CONTROL_RENEW_MILLISECONDS = 10_000;
export const RECEIPT_POLL_MILLISECONDS = 500;

/**
 * One view's control of an agent's terminal. The grant id lives only in this object, in memory; a retirement, a hide
 * or an identity or privacy change drops it at once, and the host's hold expires by itself. Every input is one
 * sequenced operation for the prompt revision the view saw; an uncertain one is never sent again, only checked.
 */
export class TerminalControl {
    private takeId = '';
    private grantId = '';
    private nextSequence = 1;
    private cancelled = false;
    private lastAchievedSize = '';
    private current: ControlView = {
        state: 'watching',
        notice: '',
        unsentLine: '',
        savedDrafts: [],
        geometry: '',
        privateEntry: false,
    };

    constructor(
        private readonly client: TerminalControlClient,
        private readonly newTakeId: () => string,
        private readonly show: (view: ControlView) => void,
        private readonly failureOf: (failure: unknown) => ControlFailure,
        private readonly wait: (milliseconds: number) => Promise<void>,
    ) {}

    view(): ControlView {
        return this.current;
    }

    hasGrant(): boolean {
        return this.grantId !== '';
    }

    /**
     * Asks for control through the view's read interest; a pending take is asked about until the host answers.
     */
    async take(interest: string): Promise<void> {
        if (interest === '' || this.current.state !== 'watching') {
            return;
        }
        this.takeId = this.newTakeId();
        this.cancelled = false;
        this.publish({ state: 'requesting', notice: '' });

        try {
            await this.settleTake(await this.client.take(interest, this.takeId));
        } catch (failure) {
            this.refuse(failure);
        }
    }

    /**
     * Cancels a take on its way; a grant that arrives late is released.
     */
    async cancel(): Promise<void> {
        this.cancelled = true;
        this.publish({ state: 'releasing', notice: '' });

        try {
            await this.client.cancel(this.takeId);
        } finally {
            this.forget('watching');
        }
    }

    async renew(): Promise<void> {
        if (this.grantId === '') {
            return;
        }

        try {
            await this.client.renew(this.grantId);
        } catch (failure) {
            this.retire(this.failureOf(failure).message);
        }
    }

    /**
     * Sends the text, and Enter after it when asked, as one operation at the next sequence.
     */
    async send(text: string, enter: boolean, screenRevision: number): Promise<void> {
        await this.sendInput({ type: 'text', text, enter }, screenRevision);
    }

    /**
     * Sends one input at the next sequence for the prompt revision the writer saw, and follows its receipt.
     */
    async sendInput(input: TerminalInputPayload, screenRevision: number): Promise<void> {
        if (this.grantId === '' || this.current.state !== 'controlling') {
            return;
        }
        const sequence = this.nextSequence;

        try {
            const answer = await this.client.input(this.grantId, input, sequence, screenRevision);
            this.nextSequence = answer.nextSequence;
            this.publish({ unsentLine: this.unsentAfter(input) });
            const outcome = await this.followReceipt(sequence);

            if (input.type === 'resize') {
                this.publish({ geometry: outcome === 'applied' ? this.lastAchievedSize : 'resize unavailable' });
            }
        } catch (failure) {
            this.inputRefused(failure);
        }
    }

    /**
     * The line left unsent after the input: Enter sends it, text and a one-line paste add to it, a key leaves it to
     * the screen.
     */
    private unsentAfter(input: TerminalInputPayload): string {
        if (input.type === 'key' || input.type === 'resize') {
            return this.current.unsentLine;
        }
        if (input.type === 'paste') {
            return this.current.unsentLine + input.text;
        }
        if (input.type === 'text' && input.enter) {
            return '';
        }

        return this.current.unsentLine + input.text;
    }

    /**
     * Gives the input back: at once with nothing unsent, otherwise after the writer chose what becomes of the line.
     */
    async giveBack(): Promise<void> {
        if (this.grantId === '') {
            return;
        }
        if (this.current.unsentLine !== '') {
            this.publish({ state: 'choosing', notice: '' });

            return;
        }
        await this.release();
    }

    keepTyping(): void {
        this.publish({ state: 'controlling', notice: '' });
    }

    /**
     * Carries out the writer's choice for the unfinished line, then gives the input back; Save and clear keeps the
     * line in this tab's memory only, and a clear that did not show keeps control with a way to check the screen.
     */
    async choose(choice: DraftChoice): Promise<void> {
        const sequence = this.nextSequence;
        const line = this.current.unsentLine;

        try {
            const answer = await this.client.choose(this.grantId, choice, sequence);
            this.nextSequence = answer.nextSequence;
            const outcome = await this.followReceipt(sequence);

            if (outcome !== 'applied') {
                return;
            }
            const savedDrafts =
                choice === 'save-and-clear' ? [...this.current.savedDrafts, line] : this.current.savedDrafts;
            this.publish({ unsentLine: '', savedDrafts });
            await this.release();
        } catch (failure) {
            this.inputRefused(failure);
        }
    }

    async check(): Promise<void> {
        if (this.grantId === '') {
            return;
        }

        try {
            await this.client.check(this.grantId);
            this.publish({ state: 'controlling', notice: '' });
        } catch (failure) {
            this.retire(this.failureOf(failure).message);
        }
    }

    /**
     * Asks the host to close every output sink; the masked field shows only once its receipt says it did.
     */
    async openPrivate(): Promise<void> {
        if (this.grantId === '' || this.current.state !== 'controlling' || !this.current.privateEntry) {
            return;
        }
        const sequence = this.nextSequence;
        this.publish({ state: 'private_opening', notice: '' });

        try {
            this.nextSequence = (await this.client.openPrivate(this.grantId, sequence)).nextSequence;
            const outcome = await this.followReceipt(sequence);
            this.publish(
                outcome === 'applied'
                    ? { state: 'private' }
                    : { state: 'controlling', notice: 'Private input is unavailable at this prompt.' },
            );
        } catch (failure) {
            this.inputRefused(failure);
        }
    }

    /**
     * Sends the value once under a fresh submission id; the caller drops it at once, and nothing here keeps it.
     */
    async submitPrivate(value: string): Promise<void> {
        if (this.current.state !== 'private') {
            return;
        }
        const sequence = this.nextSequence;
        this.publish({ state: 'controlling', notice: 'The screen stays shielded until the terminal redraws.' });

        try {
            this.nextSequence = (await this.client.submitPrivate(this.grantId, this.newTakeId(), value, sequence))
                .nextSequence;
            await this.followReceipt(sequence);
        } catch (failure) {
            this.inputRefused(failure);
        }
    }

    async cancelPrivate(): Promise<void> {
        if (this.current.state !== 'private' && this.current.state !== 'private_opening') {
            return;
        }
        this.publish({ state: 'controlling', notice: '' });
        await this.client.cancelPrivate(this.grantId).catch(() => undefined);
    }

    deleteSavedDraft(index: number): void {
        this.publish({ savedDrafts: this.current.savedDrafts.filter((_, kept) => kept !== index) });
    }

    /**
     * Drops control in this view at once, as on a hide, a denial or an identity or privacy change: the grant id is
     * forgotten and the host's hold runs out by itself. An unfinished line stays known to this writer, so on return
     * Resolve takes control again and offers its choices.
     */
    retire(notice = ''): void {
        this.forget('watching');
        this.publish({ notice });
    }

    /**
     * Forgets everything this tab kept, saved drafts included, as on a session change or access loss.
     */
    erase(): void {
        this.forget('watching');
        this.publish({ unsentLine: '', savedDrafts: [], notice: '' });
    }

    private async settleTake(answer: TerminalControlData): Promise<void> {
        let current = answer;

        while (isStillTaking(current) && !this.cancelled) {
            await this.wait(RECEIPT_POLL_MILLISECONDS);
            current = await this.client.receipt(this.takeId, 0);
        }

        if (this.cancelled) {
            if (current.grantId !== null) {
                await this.client.release(current.grantId).catch(() => undefined);
            }

            return;
        }

        if (current.grantId === null || current.state !== 'granted') {
            this.forget('watching');
            this.publish({ notice: 'The host did not give control; the terminal stays in Watch.' });

            return;
        }

        this.grantId = current.grantId;
        this.nextSequence = current.nextSequence;
        this.publish({ privateEntry: current.isPrivateEntry });
        this.publish({ state: this.current.unsentLine === '' ? 'controlling' : 'choosing', notice: '' });
    }

    /**
     * Asks about the input until the host said how it ended, and shows an uncertain or paused one.
     */
    private async followReceipt(sequence: number): Promise<string> {
        for (;;) {
            const answer = await this.client.receipt(this.takeId, sequence);
            const outcome = answer.receipt?.outcome ?? 'pending';
            this.lastAchievedSize = answer.receipt?.achievedSize ?? '';

            if (outcome === 'uncertain') {
                this.publish({ state: 'uncertain', notice: 'Input may have reached the terminal.' });
            }
            if (outcome === 'refused') {
                this.publish({ notice: 'Input paused for this prompt.' });
            }
            if (outcome !== 'pending') {
                return outcome;
            }
            await this.wait(RECEIPT_POLL_MILLISECONDS);
        }
    }

    private async release(): Promise<void> {
        const grantId = this.grantId;
        this.publish({ state: 'releasing', notice: '' });

        try {
            await this.client.release(grantId);
        } finally {
            this.forget('watching');
        }
    }

    private refuse(failure: unknown): void {
        const reason = this.failureOf(failure);
        this.forget(reason.code === 'forbidden' ? 'watch_only' : 'watching');
        this.publish({ notice: reason.code === 'forbidden' ? 'You can watch this terminal.' : reason.message });
    }

    private inputRefused(failure: unknown): void {
        const reason = this.failureOf(failure);

        if (reason.kind === 'lost') {
            this.publish({ state: 'uncertain', notice: 'Input may have reached the terminal.' });

            return;
        }
        this.retire(reason.message);
    }

    private forget(state: ControlState): void {
        this.takeId = state === 'watching' || state === 'watch_only' ? '' : this.takeId;
        this.grantId = '';
        this.nextSequence = 1;
        this.publish({ state });
    }

    private publish(change: Partial<ControlView>): void {
        this.current = { ...this.current, ...change };
        this.show(this.current);
    }
}

/**
 * Whether a take is still waiting for its grant.
 */
function isStillTaking(answer: TerminalControlData): boolean {
    return answer.grantId === null && answer.state === 'taking';
}
