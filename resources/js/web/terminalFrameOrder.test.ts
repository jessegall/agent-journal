import type { ScreenFrameData } from '@generated/types/core';
import { describe, expect, it } from 'vitest';
import { supersedes } from '../../../app/Web/Resources/js/terminalFrameOrder';

function frameOf(epoch: string, sequence: number): ScreenFrameData {
    return {
        epoch,
        sequence,
        captured: '2026-11-19T12:00:00Z',
        columns: 20,
        rows: [],
        cursor: { row: 0, column: 0, visible: true },
        buffer: 'normal',
        plain: false,
        tooLarge: false,
        unreadable: false,
        noTerminal: false,
        shielded: false,
        privacyRevision: 0,
        stream: null,
        proof: 0,
        expiresAt: null,
    };
}

describe('supersedes', () => {
    it('draws the first frame', () => {
        expect(supersedes(frameOf('a', 1), null)).toBe(true);
    });

    it('draws a later frame of the same host process and ignores a late one', () => {
        expect(supersedes(frameOf('a', 12), frameOf('a', 10))).toBe(true);
        expect(supersedes(frameOf('a', 9), frameOf('a', 10))).toBe(false);
        expect(supersedes(frameOf('a', 10), frameOf('a', 10))).toBe(false);
    });

    it('starts afresh with a new host process even at a lower sequence', () => {
        expect(supersedes(frameOf('b', 1), frameOf('a', 50))).toBe(true);
    });
});
