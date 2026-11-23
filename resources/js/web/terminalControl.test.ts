import type { TerminalControlData } from '@generated/types/core';
import { describe, expect, it } from 'vitest';
import type { ControlFailure, TerminalControlClient } from '@/components/terminal/terminalControl';
import { TerminalControl } from '@/components/terminal/terminalControl';

function answer(changes: Partial<TerminalControlData>): TerminalControlData {
    return { takeId: 'take', grantId: null, state: 'taking', expiresInSeconds: 30, nextSequence: 1, ...changes } as TerminalControlData;
}

function controlled(client: Partial<TerminalControlClient>) {
    const sent: unknown[][] = [];
    const full: TerminalControlClient = {
        take: async () => answer({}),
        cancel: async () => answer({ state: 'releasing' }),
        renew: async () => answer({ state: 'granted', grantId: 'grant' }),
        release: async () => answer({ state: 'releasing', grantId: 'grant' }),
        input: async (grantId, input, sequence, revision) => {
            const text = textOf(input);
            sent.push([grantId, text, input.type === 'text' && input.enter, sequence, revision]);

            return answer({ state: 'granted', grantId: 'grant', nextSequence: sequence + 1 });
        },
        choose: async () => answer({ state: 'granted', grantId: 'grant' }),
        check: async () => answer({ state: 'granted', grantId: 'grant' }),
        openPrivate: async () => answer({ state: 'granted', grantId: 'grant' }),
        submitPrivate: async () => answer({ state: 'granted', grantId: 'grant' }),
        cancelPrivate: async () => answer({ state: 'granted', grantId: 'grant' }),
        receipt: async (_take, sequence) =>
            answer({
                state: 'granted',
                grantId: 'grant',
                receipt: sequence === 0 ? undefined : { sequence, outcome: 'applied' },
            } as Partial<TerminalControlData>),
        ...client,
    };
    const control = new TerminalControl(
        full,
        () => 'take',
        () => undefined,
        (failure) => failure as ControlFailure,
        async () => undefined,
    );

    return { control, sent };
}

describe('TerminalControl', () => {
    it('learns the grant of a pending take from its receipt and sends sequenced input with the prompt revision', async () => {
        const { control, sent } = controlled({});

        await control.take('interest');
        await control.send('ls', true, 3);
        await control.send('pwd', true, 3);

        expect(control.view().state).toBe('controlling');
        expect(sent).toEqual([
            ['grant', 'ls', true, 1, 3],
            ['grant', 'pwd', true, 2, 3],
        ]);
    });

    it('asks about an unfinished line before giving back, and gives back at once without one', async () => {
        const { control } = controlled({});
        await control.take('interest');

        await control.send('half', false, 0);
        await control.giveBack();
        expect(control.view().state).toBe('choosing');

        await control.choose('save-and-clear');
        expect(control.view()).toMatchObject({ state: 'watching', savedDrafts: ['half'], unsentLine: '' });
    });

    it('shows an uncertain input and never sends it again', async () => {
        const { control, sent } = controlled({
            receipt: async (_take, sequence) =>
                answer({
                    state: 'granted',
                    grantId: 'grant',
                    receipt: sequence === 0 ? undefined : { sequence, outcome: 'uncertain' },
                } as Partial<TerminalControlData>),
        });
        await control.take('interest');

        await control.send('ls', true, 0);
        await control.send('ls', true, 0);

        expect(control.view().state).toBe('uncertain');
        expect(sent).toHaveLength(1);
    });

    it('tells an actor who may only watch so and drops the grant on a retirement', async () => {
        const refused = controlled({
            take: async () => {
                throw { kind: 'refused', code: 'forbidden', message: '' };
            },
        });
        await refused.control.take('interest');
        expect(refused.control.view().state).toBe('watch_only');

        const { control } = controlled({});
        await control.take('interest');
        control.retire();
        expect(control.hasGrant()).toBe(false);
    });
});

/**
 * What one terminal input carries: its text, or the name of its key.
 */
function textOf(input: object): string {
    if ('text' in input && typeof input.text === 'string') {
        return input.text;
    }

    if ('key' in input && typeof input.key === 'string') {
        return input.key;
    }

    return '';
}
