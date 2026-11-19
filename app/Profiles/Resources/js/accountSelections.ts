/**
 * One program's current choice as the server sent it: the chosen account, if any, and the change number that only
 * grows with each new choice.
 */
export type AccountSelection = {
    program: string;
    accountId: string | null;
    changeNumber: number;
};

/**
 * The choices to show after a page reload arrives: per program, the one with the greater change number, so an older
 * answer that arrives late never takes back a newer choice. The server stays the authority: the arrived choice wins
 * whenever it is at least as new.
 */
export function newestSelections(
    shown: AccountSelection[],
    arrived: AccountSelection[],
): AccountSelection[] {
    const byProgram = new Map<string, AccountSelection>();

    for (const selection of [...shown, ...arrived]) {
        const known = byProgram.get(selection.program);

        if (known === undefined || selection.changeNumber >= known.changeNumber) {
            byProgram.set(selection.program, selection);
        }
    }

    return [...byProgram.values()];
}

/**
 * Whether new starts of the account's program use the account, by the choices shown.
 */
export function isChosen(
    selections: AccountSelection[],
    program: string,
    accountId: string,
): boolean {
    return selections.some(
        (selection) =>
            selection.program === program && selection.accountId === accountId,
    );
}
