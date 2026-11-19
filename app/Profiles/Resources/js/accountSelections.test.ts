import { describe, expect, it } from 'vitest';
import { isChosen, newestSelections } from './accountSelections';

describe('newestSelections', () => {
    it('keeps a newer choice when an older page answer arrives late', () => {
        const shown = [{ program: 'codex', accountId: 'home', changeNumber: 4 }];
        const late = [{ program: 'codex', accountId: 'work', changeNumber: 3 }];

        expect(newestSelections(shown, late)).toEqual(shown);
    });

    it('takes the arrived choice when it is as new or newer', () => {
        const shown = [{ program: 'codex', accountId: 'home', changeNumber: 4 }];
        const arrived = [{ program: 'codex', accountId: 'work', changeNumber: 5 }];

        expect(newestSelections(shown, arrived)).toEqual(arrived);
        expect(newestSelections(arrived, [{ ...arrived[0], accountId: null }])).toEqual([
            { program: 'codex', accountId: null, changeNumber: 5 },
        ]);
    });

    it('keeps each program apart', () => {
        const result = newestSelections(
            [{ program: 'codex', accountId: 'home', changeNumber: 2 }],
            [{ program: 'claude-code', accountId: 'work', changeNumber: 1 }],
        );

        expect(isChosen(result, 'codex', 'home')).toBe(true);
        expect(isChosen(result, 'claude-code', 'work')).toBe(true);
        expect(isChosen(result, 'codex', 'work')).toBe(false);
    });
});
