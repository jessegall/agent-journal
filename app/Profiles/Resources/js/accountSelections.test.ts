import { describe, expect, it } from 'vitest';
import { isChosen, newestSelections } from './accountSelections';

describe('newestSelections', () => {
    it('keeps a newer choice when an older page answer arrives late', () => {
        const shown = [
            { driver: 'codex', accountId: 'home', changeNumber: 4 },
        ];
        const late = [{ driver: 'codex', accountId: 'work', changeNumber: 3 }];

        expect(newestSelections(shown, late)).toEqual(shown);
    });

    it('takes the arrived choice when it is as new or newer', () => {
        const shown = [
            { driver: 'codex', accountId: 'home', changeNumber: 4 },
        ];
        const arrived = [
            { driver: 'codex', accountId: 'work', changeNumber: 5 },
        ];

        expect(newestSelections(shown, arrived)).toEqual(arrived);
        expect(
            newestSelections(arrived, [{ ...arrived[0], accountId: null }]),
        ).toEqual([{ driver: 'codex', accountId: null, changeNumber: 5 }]);
    });

    it('keeps each driver apart', () => {
        const result = newestSelections(
            [{ driver: 'codex', accountId: 'home', changeNumber: 2 }],
            [{ driver: 'claude-code', accountId: 'work', changeNumber: 1 }],
        );

        expect(isChosen(result, 'codex', 'home')).toBe(true);
        expect(isChosen(result, 'claude-code', 'work')).toBe(true);
        expect(isChosen(result, 'codex', 'work')).toBe(false);
    });
});
