import { describe, expect, it } from 'vitest';
import {
    boundedChatShare,
    CHAT_MINIMUM_REM,
    DIVIDER_PIXELS,
    placementFor,
    storedShare,
    TERMINAL_MINIMUM_REM,
} from './terminalPlacement';

const REM = 16;
const BOTH = (CHAT_MINIMUM_REM + TERMINAL_MINIMUM_REM) * REM + DIVIDER_PIXELS;

describe('terminal placement', () => {
    it('docks side by side only when both minimums and the divider fit', () => {
        expect(placementFor(BOTH, REM)).toBe('dock');
        expect(placementFor(BOTH - 1, REM)).toBe('tabs');
    });

    it('keeps each pane its minimum when the divider is dragged', () => {
        const width = 1200;

        expect(boundedChatShare(0.01, width, REM)).toBeCloseTo((CHAT_MINIMUM_REM * REM) / width);
        expect(boundedChatShare(0.99, width, REM)).toBeCloseTo(
            1 - (TERMINAL_MINIMUM_REM * REM + DIVIDER_PIXELS) / width,
        );
        expect(boundedChatShare(0.4, width, REM)).toBe(0.4);
    });

    it('reads back only a stored share between nothing and everything', () => {
        expect(storedShare(0.3)).toBe(0.3);
        expect(storedShare(2)).toBeNull();
        expect(storedShare('0.3')).toBeNull();
    });
});
